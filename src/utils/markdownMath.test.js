import { hasMarkdownMath } from './markdownMath';

test('detects block and bracket math', () => {
  expect(hasMarkdownMath('Intro\n\n$$\ny = wx + b\n$$')).toBe(true);
  expect(hasMarkdownMath('Inline \\(x_i + y_i\\) text')).toBe(true);
  expect(hasMarkdownMath('Block \\[x^2\\] text')).toBe(true);
});

test('detects likely inline dollar math without matching ordinary currency', () => {
  expect(hasMarkdownMath('The loss is $L = y - \\hat{y}$ here.')).toBe(true);
  expect(hasMarkdownMath('The price is $12 today.')).toBe(false);
  expect(hasMarkdownMath('See RoPE \\[23\\] and ALiBi \\[31\\].')).toBe(false);
});

test('ignores math-looking text inside code ranges', () => {
  expect(hasMarkdownMath('`$x = y$`\n\n```math\nx = y\n```')).toBe(false);
});
