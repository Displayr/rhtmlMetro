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
