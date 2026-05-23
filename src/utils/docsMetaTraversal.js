function walkItems(items, visitor, context) {
  for (const item of items) {
    if (visitor(item, context) === false) {
      return false;
    }

    if (item.children.length > 0 && walkItems(item.children, visitor, context) === false) {
      return false;
    }

    if (item.items.length > 0 && walkItems(item.items, visitor, context) === false) {
      return false;
    }
  }

  return true;
}

export function forEachDocItem(meta, visitor, options = {}) {
  const includeSections = options.includeSections === true;

  for (const category of meta?.categories || []) {
    for (const section of category.sections) {
      const context = { category, section };

      if (includeSections && visitor(section, context) === false) {
        return;
      }

      if (walkItems(section.items, visitor, context) === false) {
        return;
      }
    }
  }
}
