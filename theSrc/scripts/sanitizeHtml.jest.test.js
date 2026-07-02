const sanitizeHtml = require('./sanitizeHtml')

describe('sanitizeHtml (RS-22478)', () => {
  test('removes script tags and inline event handlers', () => {
    const out = sanitizeHtml('<div onclick="evil()">hi</div><script>alert(1)</script>')
    expect(out).not.toContain('<script')
    expect(out).not.toContain('onclick')
    expect(out).toContain('hi')
  })

  test('retains <style> blocks (the reason styles are extracted before DOMPurify)', () => {
    const out = sanitizeHtml('<style>.x{color:red}</style><div class="x">hi</div>')
    expect(out).toContain('<style>')
    expect(out).toContain('color:red')
  })

  test('keeps iframe embeds (YouTube) and video controls', () => {
    const out = sanitizeHtml('<iframe src="https://www.youtube.com/embed/abc" allowfullscreen></iframe>')
    expect(out).toContain('<iframe')
    expect(out).toContain('youtube.com/embed/abc')
  })

  // Comment 3432550432: String(text) turned nullish input into the literal "null"/"undefined".
  test('nullish input renders empty, not the string "null"/"undefined"', () => {
    expect(sanitizeHtml(null)).toBe('')
    expect(sanitizeHtml(undefined)).toBe('')
  })

  // Comment 3432550429: target="_blank" without rel="noopener" enables reverse tabnabbing.
  test('anchors with a target get rel="noopener noreferrer"', () => {
    const out = sanitizeHtml('<a href="https://example.com" target="_blank">x</a>')
    expect(out).toContain('rel="noopener noreferrer"')
  })

  test('anchors without a target are left unchanged (no rel injected)', () => {
    const out = sanitizeHtml('<a href="https://example.com">x</a>')
    expect(out).not.toContain('rel=')
  })

  // Comment 3432550424: @import lets CSS pull in external resources; the whole rule (and its
  // external URL) must be removed, while legitimate CSS is kept.
  test('@import is stripped from style CSS', () => {
    const out = sanitizeHtml('<style>@import url("https://evil.example/x.css"); .x{color:red}</style>')
    expect(out).not.toContain('evil.example')
    expect(out).toContain('color:red')
  })

  // ...and the CSS-escaped form (@\69 mport, which browsers parse as @import) must not slip past
  // the regex the reviewer flagged.
  test('CSS-escaped @import (@\\69 mport) is also stripped', () => {
    const out = sanitizeHtml('<style>@\\69 mport url("https://evil.example/x.css"); .x{color:red}</style>')
    expect(out).not.toContain('evil.example')
    expect(out).toContain('color:red')
  })
})

// Regression guards for the hand-rolled CSS scrub. Per the RS-22478 investigation, DOMPurify does
// NOT sanitize <style> content at all (it either drops the whole block or keeps it verbatim), so
// stripDangerousCss is the only thing defending this surface — these lock in each vector while
// ensuring legitimate CSS is preserved intact. Each test also asserts a co-located benign rule
// survives, so a scrub that simply nukes everything would not pass.
describe('sanitizeHtml CSS scrub (RS-22478)', () => {
  test('strips expression() (legacy IE script-in-CSS)', () => {
    const out = sanitizeHtml('<style>.a{ width: expression(alert(1)) } .b{color:blue}</style>')
    expect(out).not.toContain('expression')
    expect(out).toContain('color:blue')
  })

  test('strips the CSS-escaped form of expression() too', () => {
    // \65 is the hex escape for "e"; browsers parse \65 xpression( as expression(.
    const out = sanitizeHtml('<style>.a{ width: \\65 xpression(alert(1)) } .b{color:blue}</style>')
    expect(out).not.toContain('xpression')
    expect(out).toContain('color:blue')
  })

  test('strips -moz-binding (XBL script binding)', () => {
    const out = sanitizeHtml('<style>.a{ -moz-binding: url("https://evil.example/x.xml#e") } .b{color:blue}</style>')
    expect(out).not.toContain('moz-binding')
    expect(out).not.toContain('evil.example')
    expect(out).toContain('color:blue')
  })

  test('strips behavior (IE .htc binding)', () => {
    const out = sanitizeHtml('<style>.a{ behavior: url(evil.htc) } .b{color:blue}</style>')
    expect(out).not.toContain('behavior')
    expect(out).not.toContain('evil.htc')
    expect(out).toContain('color:blue')
  })

  test('strips javascript: URIs inside CSS', () => {
    const out = sanitizeHtml('<style>.a{ background: url(javascript:alert(1)) } .b{color:blue}</style>')
    expect(out).not.toContain('javascript:')
    expect(out).toContain('color:blue')
  })

  test('preserves legitimate multi-rule CSS intact (does not over-strip)', () => {
    const css = '.choice-modelling-design-main-container { overflow: auto; color: #3E7DCC; }' +
      ' .choice-modelling-design-main-container th { background: white; padding: 5px; }'
    const out = sanitizeHtml('<style>' + css + '</style><div class="choice-modelling-design-main-container">x</div>')
    expect(out).toContain('.choice-modelling-design-main-container')
    expect(out).toContain('overflow: auto')
    expect(out).toContain('#3E7DCC')
    expect(out).toContain('padding: 5px')
    expect(out).toContain('<div class="choice-modelling-design-main-container">x</div>')
  })

  test('keeps legitimate url() (e.g. background images) — known residual, must not break valid CSS', () => {
    const out = sanitizeHtml('<style>.hero{ background: url("https://cdn.example/bg.png") }</style>')
    expect(out).toContain('cdn.example/bg.png')
  })

  test('retains multiple <style> blocks and preserves their relative order', () => {
    const out = sanitizeHtml('<style>.a{color:red}</style><p>mid</p><style>.b{color:blue}</style>')
    expect(out).toContain('color:red')
    expect(out).toContain('color:blue')
    expect(out).toContain('mid')
    expect(out.indexOf('color:red')).toBeLessThan(out.indexOf('color:blue'))
  })

  // Review comment 3433312072 (blocker): the scrubbed CSS is re-inserted inside a rawtext <style>
  // OUTSIDE DOMPurify. After decodeCssEscapes runs, a CSS-escaped </style> (\3C/style\3E) decodes
  // into a real </style> that terminates the block, and a following \3Cimg ...\3E becomes a live,
  // unsanitized <img onerror>. The scrubbed CSS must never be able to break out of <style>.
  test('CSS-escaped </style> breakout cannot inject a live element', () => {
    const out = sanitizeHtml('<style>x\\3C/style\\3E\\3Cimg src=x onerror=alert(1)\\3E</style>')
    const div = document.createElement('div')
    div.innerHTML = out
    expect(div.querySelector('img')).toBeNull()
    expect(div.querySelector('script')).toBeNull()
  })

  // Review comment 3433312088: an out-of-range / surrogate codepoint escape must not throw
  // (String.fromCodePoint(0x110000) is a RangeError) — that would break the whole Box render.
  test('out-of-range codepoint escapes do not throw (content-controlled DoS)', () => {
    expect(() => sanitizeHtml('<style>.a{content:"\\110000"}</style>')).not.toThrow()
    expect(() => sanitizeHtml('<style>.a{content:"\\d800"}</style>')).not.toThrow()
  })

  // The breakout fix must escape '<' only — '>' cannot terminate <style>, and escaping it would
  // break legitimate '>' child combinators in arbitrary as_html CSS.
  test('preserves > child combinators in CSS', () => {
    const out = sanitizeHtml('<style>.a > .b{color:red}</style>')
    expect(out).toContain('.a > .b')
  })
})

describe('sanitizeHtml Font Awesome <link> allowlist (RS-22478 follow-up)', () => {
  const FA_LINK = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">'

  test('keeps an https Font Awesome CDN stylesheet link', () => {
    const out = sanitizeHtml(FA_LINK + '<i class="fas fa-arrow-down"></i>')
    expect(out).toContain('rel="stylesheet"')
    expect(out).toContain('href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"')
    expect(out).toContain('<i class="fas fa-arrow-down">')
  })

  test('preserves the Subresource Integrity hash and crossorigin', () => {
    const out = sanitizeHtml(FA_LINK)
    expect(out).toContain('integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"')
    expect(out).toContain('crossorigin="anonymous"')
  })
})
