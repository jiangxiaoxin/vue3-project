import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../renderMarkdown'

describe('renderMarkdown', () => {
  it('renders headings and tables as HTML elements', () => {
    const html = renderMarkdown(
      '### 住宿建议\n\n| 区域 | 优点 |\n| --- | --- |\n| 老城区 | 方便 |'
    )

    expect(html).toContain('<h3>')
    expect(html).toContain('住宿建议')
    expect(html).toContain('<table>')
    expect(html).toContain('<th>')
    expect(html).toContain('老城区')
    expect(html).not.toContain('### 住宿建议')
  })

  it('keeps bold and list markup', () => {
    const html = renderMarkdown('- **重点**事项')

    expect(html).toContain('<ul>')
    expect(html).toContain('<strong>')
    expect(html).toContain('重点')
  })

  it('strips script tags from markdown HTML', () => {
    const html = renderMarkdown('<script>alert(1)</script>安全文本')

    expect(html).not.toContain('<script>')
    expect(html).toContain('安全文本')
  })

  it('renders inline and block math with KaTeX', () => {
    const html = renderMarkdown('能量公式 $E=mc^2$\n\n$$\\frac{a}{b}$$')

    expect(html).toContain('katex')
    expect(html).not.toContain('$E=mc^2$')
    expect(html).toContain('mc')
    expect(html).toContain('frac')
  })

  it('renders chemical formulas with mhchem', () => {
    const html = renderMarkdown('水分子：$\\ce{H2O}$')

    expect(html).toContain('katex')
    expect(html).not.toContain('\\ce{H2O}')
    expect(html).toMatch(/H/)
    expect(html).toMatch(/O/)
  })

  it('normalizes bare bracket math blocks used by some models', () => {
    const html = renderMarkdown(
      '2. 库仑定律\n\n[\nF = k\\frac{|q_1q_2|}{r^2}\n]\n\n其中\n\n[\nk \\approx 9.0\\times10^9\n]'
    )

    expect(html).toContain('katex')
    expect(html).toContain('frac')
    expect(html).not.toContain('\\frac{|q_1q_2|}{r^2}')
  })

  it('normalizes LaTeX \\[ \\] and \\( \\) delimiters', () => {
    const html = renderMarkdown(
      '电荷：\\(\\sum q\\)\n\n\\[\nF = ma\n\\]'
    )

    expect(html).toContain('katex')
    expect(html).not.toContain('\\sum q')
    expect(html).not.toContain('\\[\nF = ma\n\\]')
  })

  it('does not treat markdown links as math brackets', () => {
    const html = renderMarkdown('查看 [文档](https://example.com) 了解更多')

    expect(html).toContain('<a href="https://example.com"')
    expect(html).toContain('文档')
    expect(html).not.toContain('katex')
  })
})
