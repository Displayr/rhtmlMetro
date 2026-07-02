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

describe('sanitizeHtml <link> allowlist rejects everything else (RS-22478 follow-up)', () => {
  test('drops a stylesheet link to a non-allowlisted host', () => {
    expect(sanitizeHtml('<link rel="stylesheet" href="https://evil.example/x.css">')).not.toContain('<link')
  })

  test('drops a look-alike suffix host (exact match only)', () => {
    expect(sanitizeHtml('<link rel="stylesheet" href="https://use.fontawesome.com.evil.com/x.css">')).not.toContain('<link')
  })

  test('drops non-stylesheet rels (e.g. preload)', () => {
    expect(sanitizeHtml('<link rel="preload" href="https://use.fontawesome.com/x.css">')).not.toContain('<link')
  })

  test('drops http (non-https) links', () => {
    expect(sanitizeHtml('<link rel="stylesheet" href="http://use.fontawesome.com/x.css">')).not.toContain('<link')
  })

  test('drops javascript: hrefs', () => {
    expect(sanitizeHtml('<link rel="stylesheet" href="javascript:alert(1)">')).not.toContain('<link')
  })

  test('strips event-handler attributes from an otherwise-allowed link', () => {
    const out = sanitizeHtml('<link rel="stylesheet" href="https://use.fontawesome.com/x" onload="alert(1)">')
    expect(out).toContain('<link')
    expect(out).not.toContain('onload')
  })

  test('normalises case and whitespace in rel and keeps the link', () => {
    const out = sanitizeHtml('<LINK REL=" Stylesheet " HREF="https://use.fontawesome.com/x.css">')
    expect(out).toContain('rel="stylesheet"')
    expect(out).toContain('href="https://use.fontawesome.com/x.css"')
  })
})

describe('sanitizeHtml preserves documented Box features (RS-22478 follow-up)', () => {
  // Help centre 360004283115 — the KPI box (flex layout + <font> + <i> icon).
  test('KPI flex-box example survives', () => {
    const kpi = '<div style="height:100%;background:#61A1E9;display:flex">' +
      '<div style="flex: 1 1 50%; color: white; display: flex; flex-direction: column; padding: 12pt">' +
      '<div style="font-size: 32pt; font-weight: bold">45</div><div>Injuries per day</div></div>' +
      '<div style="flex: 1 1 30%; display: flex; align-items: center;">' +
      '<font color="red" style="font-size: 48pt"><i class="fas fa-ambulance"></i></font></div></div>'
    const out = sanitizeHtml(kpi)
    expect(out).toContain('display:flex')
    expect(out).toContain('<font color="red"')
    expect(out).toContain('<i class="fas fa-ambulance">')
  })

  // Help centre 360004368515 — linking images from an arbitrary public URL.
  test('image-linking example survives (external <img> host + responsive <style>)', () => {
    const img = '<style>\n.responsive {\nwidth: 100%;\nheight: auto;\n}\n</style>' +
      '<img src="https://i.imgur.com/abc123.png" alt="Coca-Cola" class="responsive">'
    const out = sanitizeHtml(img)
    expect(out).toContain('<style>')
    expect(out).toContain('.responsive')
    expect(out).toContain('src="https://i.imgur.com/abc123.png"')
    expect(out).toContain('alt="Coca-Cola"')
  })
})

// PR #54 review (Kevin Huang): robustness of the raw-text <link> extraction.
describe('sanitizeHtml <link> extraction robustness (RS-22478 follow-up)', () => {
  // A '>' inside a quoted attribute value must not truncate the tag: the quote-aware LINK_TAG
  // captures the whole tag, so a valid FA link is kept and no tag remainder leaks as text.
  test('keeps a link whose attribute value contains ">"', () => {
    const out = sanitizeHtml('<link rel="stylesheet" title="a > b" href="https://use.fontawesome.com/x.css">')
    expect(out).toContain('href="https://use.fontawesome.com/x.css"')
    expect(out).not.toContain('href="https://use.fontawesome.com/x.css">"') // no leaked remainder
    expect(out).not.toContain(' b"')
  })

  // A commented-out link must stay inert — the raw-text extractor must not revive it.
  test('does not revive a commented-out link', () => {
    const out = sanitizeHtml('<!-- <link rel="stylesheet" href="https://use.fontawesome.com/x.css"> --><p>hi</p>')
    expect(out).not.toContain('<link')
    expect(out).toContain('<p>hi</p>')
  })

  test('extracts only the live link when an allowlisted link is also present in a comment', () => {
    const out = sanitizeHtml(
      '<!-- <link rel="stylesheet" href="https://use.fontawesome.com/dead.css"> -->' +
      '<link rel="stylesheet" href="https://use.fontawesome.com/live.css">')
    expect(out).toContain('href="https://use.fontawesome.com/live.css"')
    expect(out).not.toContain('dead.css')
  })

  // Fail closed: a parse failure inside extraction drops the one link, it never throws out of
  // the replace callback and aborts sanitising the rest of the input.
  test('a link that fails to parse is dropped, and surrounding content is still sanitised', () => {
    const orig = document.createElement.bind(document)
    const spy = jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'template') throw new Error('no <template> support')
      return orig(tag)
    })
    try {
      const out = sanitizeHtml('<link rel="stylesheet" href="https://use.fontawesome.com/x.css"><script>alert(1)</script><p>ok</p>')
      expect(out).not.toContain('<link') // link dropped (fail closed)
      expect(out).not.toContain('<script') // rest of the input still sanitised, no throw
      expect(out).toContain('<p>ok</p>')
    } finally {
      spy.mockRestore()
    }
  })
})
