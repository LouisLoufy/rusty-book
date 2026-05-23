function stripCodeRanges(markdown) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');
}

function hasMathSignal(value) {
  return /\\[A-Za-z]+|[_^=<>]|[A-Za-z0-9]\s*[+\-*/]\s*[A-Za-z0-9]/.test(value);
}

function hasDelimitedMath(source, pattern) {
  let match = pattern.exec(source);

  while (match) {
    if (hasMathSignal(match[1] || '')) {
      return true;
    }

    match = pattern.exec(source);
  }

  return false;
}

export function hasMarkdownMath(markdown) {
  const source = stripCodeRanges(markdown);

  if (!source) {
    return false;
  }

  if (/(^|\n)\s*\$\$[\s\S]+?\$\$/m.test(source)) {
    return true;
  }

  if (
    hasDelimitedMath(source, /\\\(([\s\S]+?)\\\)/g) ||
    hasDelimitedMath(source, /\\\[([\s\S]+?)\\\]/g)
  ) {
    return true;
  }

  return hasDelimitedMath(
    source,
    /(?:^|[^\\$])\$([^\s$][^$\n]{0,200}?[=^_\\+\-*/<>][^$\n]*?[^\s$])\$(?!\$)/g
  );
}
