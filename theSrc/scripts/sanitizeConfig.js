// RS-22478: DOMPurify config for as_html Box content.
//
// FORCE_BODY parses the input inside <body> so a leading <style> block (the table
// CSS that flipFormat emits) is preserved instead of being dropped during fragment
// parsing. iframe + the associated attributes keep YouTube/video embeds working
// (video/source/audio are already allowed by default; iframe is not). Script tags,
// event-handler attributes (onerror/onclick/...) and javascript:/srcdoc vectors are
// still stripped by DOMPurify.
module.exports = {
  FORCE_BODY: true,
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'controls'],
}
