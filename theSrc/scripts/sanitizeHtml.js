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

// CSS lets any character be written as a backslash escape (e.g. \69 == "i", \@ == "@"), so a literal
// match for @import etc. is bypassable via forms like @\69 mport. Decode escapes first so the scrubs
// below see the canonical text. (This also decodes legitimate escapes to their character, which
// renders identically.)
function decodeCssEscapes (css) {
  return css
    .replace(/\\([0-9a-fA-F]{1,6})[ \t\n\f\r]?/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\(.)/g, '$1')
}

function stripDangerousCss (css) {
  return decodeCssEscapes(String(css))
    .replace(/@import\b[^;}]*;?/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/-moz-binding\b[^;}]*;?/gi, '')
    .replace(/\bbehaviou?r\s*:[^;}]*;?/gi, '')
    .replace(/javascript\s*:/gi, '')
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
  return styles.join('') + DOMPurify.sanitize(withoutStyles, SANITIZE_CONFIG)
}
