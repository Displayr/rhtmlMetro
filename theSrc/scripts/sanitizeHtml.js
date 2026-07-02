// RS-22478: sanitise as_html Box content before it is inserted via .html().
//
// Box is a public widget API, so sanitising must happen here in the widget (not just
// in callers such as flipFormat). We can't simply hand the whole string to DOMPurify:
// it strips <style> blocks (its <style> handling varies by version/config), which would
// drop the table/widget CSS that flipFormat emits. So we pull the <style> blocks out
// first, scrub their CSS ourselves, run everything else through DOMPurify (which removes
// <script>, event-handler attributes, javascript:/srcdoc and other active vectors), then
// re-insert the scrubbed <style>.
//
// The CSS scrub is best-effort defence-in-depth for the lower-severity CSS surface
// (@import / external resource loads / legacy expression()/behavior/-moz-binding); the
// high-severity script vectors are removed by DOMPurify. Anything not inside a
// well-formed <style>...</style> still passes through DOMPurify, so a forged </style>
// cannot smuggle script past it.
const DOMPurify = require('dompurify')

const SANITIZE_CONFIG = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'controls'],
}

// target="_blank" (and other targets) without rel="noopener" lets the opened page navigate the
// opener via window.opener (reverse tabnabbing). DOMPurify keeps target, so add the rel ourselves.
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A' && node.hasAttribute('target')) {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

const STYLE_BLOCK = /<style\b[^>]*>([\s\S]*?)<\/style>/gi

// RS-22478 follow-up: DOMPurify strips <link>, which broke the documented Font Awesome CDN
// pattern (help centre 360004283115 + "Adding Icons to Dashboards Using Font Awesome"). Like
// <style> blocks, we pull <link> tags out before DOMPurify and re-insert only https stylesheet
// links to an allowlisted host, rebuilt from scratch so no other attributes (e.g. onload) ride
// along. External CSS is a higher-risk vector than <img> (attribute-selector exfiltration), so
// the host list is deliberately narrow and exact-match.
const STYLESHEET_HOST_ALLOWLIST = new Set(['use.fontawesome.com'])
// The (?:[^>"']|"[^"]*"|'[^']*')* form matches a '>' only when it is OUTSIDE a quoted attribute
// value, so a link with e.g. title="a > b" is captured whole instead of being truncated at the
// first '>' (which would drop a valid link and leak the tag remainder as text).
const LINK_TAG = /<link\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi
const HTML_COMMENT = /<!--[\s\S]*?-->/g

function extractAllowedStylesheetLink (linkTagHtml) {
  // Fail closed: any DOM/parse failure (e.g. a runtime without <template> support, or an
  // unparseable href) must drop this one link, never throw out of the .replace() callback and
  // take down sanitisation of the whole input.
  try {
    // Parse inertly: a detached <template>'s <link> does not load.
    const template = document.createElement('template')
    template.innerHTML = linkTagHtml
    const link = template.content.querySelector('link')
    if (!link) return null

    if ((link.getAttribute('rel') || '').trim().toLowerCase() !== 'stylesheet') return null

    const url = new URL(link.getAttribute('href') || '')
    if (url.protocol !== 'https:') return null
    if (!STYLESHEET_HOST_ALLOWLIST.has(url.hostname.toLowerCase())) return null

    // Rebuild from scratch so only known-safe attributes survive (drops onload/onerror/etc.),
    // and outerHTML escapes the values so a crafted href cannot break out of the tag.
    const clean = document.createElement('link')
    clean.setAttribute('rel', 'stylesheet')
    clean.setAttribute('href', url.href)
    if (link.hasAttribute('integrity')) clean.setAttribute('integrity', link.getAttribute('integrity'))
    if (link.hasAttribute('crossorigin')) clean.setAttribute('crossorigin', link.getAttribute('crossorigin'))
    return clean.outerHTML
  } catch (e) {
    return null
  }
}

// CSS lets any character be written as a backslash escape (e.g. \69 == "i", \@ == "@"), so a literal
// match for @import etc. is bypassable via forms like @\69 mport. Decode escapes first so the scrubs
// below see the canonical text. Note: decoding is global, so in rare cases it can change otherwise-
// meaningful escapes (e.g. inside a content: "…" string, or an escape used to separate tokens) — an
// accepted trade-off to defeat the escape-based bypass on this best-effort, lower-severity surface.
function decodeCssEscapes (css) {
  return css
    .replace(/\\([0-9a-fA-F]{1,6})[ \t\n\f\r]?/g, (_, hex) => {
      // Per CSS spec, a null / out-of-range / surrogate escape maps to U+FFFD — NOT a thrown error.
      // String.fromCodePoint would otherwise throw a RangeError on e.g. \110000, breaking the render.
      const cp = parseInt(hex, 16)
      return (cp === 0 || cp > 0x10FFFF || (cp >= 0xD800 && cp <= 0xDFFF)) ? '�' : String.fromCodePoint(cp)
    })
    .replace(/\\(.)/g, '$1')
}

function stripDangerousCss (css) {
  return decodeCssEscapes(String(css))
    .replace(/@import\b[^;}]*;?/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/-moz-binding\b[^;}]*;?/gi, '')
    .replace(/\bbehaviou?r\s*:[^;}]*;?/gi, '')
    .replace(/javascript\s*:/gi, '')
    // This scrubbed CSS is re-inserted into a rawtext <style> element OUTSIDE DOMPurify, so it must
    // not be able to break out of it. After decoding, a literal '<' (e.g. a decoded </style>) would
    // terminate the element and inject unsanitized markup, so re-escape it as the CSS escape '\3C '
    // (which renders identically). '>' is left alone: it cannot terminate <style>, and escaping it
    // would break legitimate '>' child combinators.
    .replace(/</g, '\\3C ')
}

module.exports = function sanitizeHtml (text) {
  // Nullish content renders as nothing, not the literal strings "null"/"undefined".
  if (text == null) {
    return ''
  }
  const styles = []
  const withoutStyles = String(text).replace(STYLE_BLOCK, function (match, css) {
    styles.push('<style>' + stripDangerousCss(css) + '</style>')
    return ''
  })
  // Strip HTML comments before extracting <link> so a commented-out (deliberately inert) link
  // is not revived by the raw-text match below. Done AFTER <style> extraction so a legacy
  // <style><!-- css --></style> block's CSS has already been pulled out and is untouched.
  // Comments are inert content DOMPurify discards anyway, so removing them here is safe.
  const withoutComments = withoutStyles.replace(HTML_COMMENT, '')
  // Extract <link> AFTER <style>/comments so a <link> written as text inside CSS
  // (e.g. content:'<link>') or inside a comment is not mistaken for a real tag. All <link>
  // tags leave the DOMPurify stream; only approved ones are re-inserted.
  const links = []
  const withoutLinks = withoutComments.replace(LINK_TAG, function (match) {
    const clean = extractAllowedStylesheetLink(match)
    if (clean) links.push(clean)
    return ''
  })
  return links.join('') + styles.join('') + DOMPurify.sanitize(withoutLinks, SANITIZE_CONFIG)
}
