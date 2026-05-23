function stripBom(value) {
  return String(value || '').replace(/^\uFEFF/, '');
}

function unquoteScalar(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const inner = trimmed.slice(1, -1);

    return trimmed.startsWith('"')
      ? inner.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
      : inner.replace(/''/g, "'");
  }

  return trimmed;
}

function parseScalar(value) {
  const scalar = unquoteScalar(value);

  if (scalar === 'true') {
    return true;
  }

  if (scalar === 'false') {
    return false;
  }

  if (scalar === 'null') {
    return null;
  }

  if (scalar.startsWith('[') && scalar.endsWith(']')) {
    const body = scalar.slice(1, -1).trim();

    if (!body) {
      return [];
    }

    return body.split(',').map((item) => parseScalar(item));
  }

  return scalar;
}

function parseFrontmatterBlock(block) {
  const data = {};
  let activeArrayKey = '';

  block.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    if (activeArrayKey && trimmed.startsWith('- ')) {
      data[activeArrayKey].push(parseScalar(trimmed.slice(2)));
      return;
    }

    const match = /^([A-Za-z0-9_-]+):(?:\s*(.*))?$/.exec(line);

    if (!match) {
      activeArrayKey = '';
      return;
    }

    const [, key, rawValue = ''] = match;
    const value = rawValue.trim();

    if (!value) {
      data[key] = [];
      activeArrayKey = key;
      return;
    }

    data[key] = parseScalar(value);
    activeArrayKey = '';
  });

  return data;
}

export function parseMarkdownFrontmatter(markdown) {
  const source = stripBom(markdown);

  if (!source.startsWith('---')) {
    return {
      data: {},
      content: source
    };
  }

  const firstLineEnd = source.indexOf('\n');

  if (firstLineEnd === -1 || source.slice(0, firstLineEnd).trim() !== '---') {
    return {
      data: {},
      content: source
    };
  }

  const closingMatch = /\n---[ \t]*(?:\r?\n|$)/.exec(source.slice(firstLineEnd));

  if (!closingMatch) {
    return {
      data: {},
      content: source
    };
  }

  const blockStart = firstLineEnd + 1;
  const blockEnd = firstLineEnd + closingMatch.index;
  const contentStart = blockEnd + closingMatch[0].length;

  return {
    data: parseFrontmatterBlock(source.slice(blockStart, blockEnd)),
    content: source.slice(contentStart)
  };
}
