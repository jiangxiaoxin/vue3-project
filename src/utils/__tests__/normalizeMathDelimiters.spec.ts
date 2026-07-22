import { describe, expect, it } from 'vitest'
import {
  normalizeMathDelimiters,
  renderMarkdown
} from '../renderMarkdown'

describe('normalizeMathDelimiters', () => {
  it('converts latex delimiters to dollar signs', () => {
    const input = '电荷：\\(\\sum q\\)\n\n\\[\nF = ma\n\\]'
    const normalized = normalizeMathDelimiters(input)

    expect(normalized).toBe('电荷：$\\sum q$\n\n$$\nF = ma\n$$')
    expect(renderMarkdown(input)).toContain('katex')
  })

  it('converts bare bracket math blocks to dollar signs', () => {
    const input =
      '[\nF = k\\frac{|q_1q_2|}{r^2}\n]\n\n[\nk \\approx 9.0\\times10^9\n]'
    const normalized = normalizeMathDelimiters(input)

    expect(normalized).toContain('$$')
    expect(normalized).not.toMatch(/^\[/m)
    expect(renderMarkdown(input)).toContain('katex')
  })
})
