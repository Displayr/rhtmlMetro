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

const STYLE_BLOCK = /<style\b[^>]*>([\s\S]*?)<\/style>/gi

function stripDangerousCss (css) {
  return String(css)
    .replace(/@import\b[^;}]*;?/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/-moz-binding\b[^;}]*;?/gi, '')
    .replace(/\bbehaviou?r\s*:[^;}]*;?/gi, '')
    .replace(/javascript\s*:/gi, '')
}

module.exports = function sanitizeHtml (text) {
  const styles = []
  const withoutStyles = String(text).replace(STYLE_BLOCK, function (match, css) {
    styles.push('<style>' + stripDangerousCss(css) + '</style>')
    return ''
  })
  return styles.join('') + DOMPurify.sanitize(withoutStyles, SANITIZE_CONFIG)
}
