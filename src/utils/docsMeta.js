const DOCS_META_PATH = `${process.env.PUBLIC_URL || ''}/docs/_meta.json`;

let docsMetaCache = null;
let docsMetaPromise = null;

function normalizeDocsMeta(meta) {
  if (!meta?.categories) {
    return meta;
  }

  return {
    ...meta,
    categories: meta.categories.map((category) => {
      if (category.id !== 'ai-insights' || !Array.isArray(category.sections)) {
        return category;
      }

      return {
        ...category,
        sections: [...category.sections].reverse()
      };
    })
  };
}

function findFirstPathInItems(items = []) {
  for (const item of items) {
    if (item.path) {
      return item.path;
    }

    if (item.children?.length) {
      const childPath = findFirstPathInItems(item.children);
      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}

function findItemByPath(items = [], path, category, section) {
  for (const item of items) {
    if (item.path === path) {
      return { type: 'item', item, category, section };
    }

    if (item.children?.length) {
      const found = findItemByPath(item.children, path, category, section);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function getDocsMetaUrl() {
  return DOCS_META_PATH;
}

export async function loadDocsMeta() {
  if (docsMetaCache) {
    return docsMetaCache;
  }

  if (docsMetaPromise) {
    return docsMetaPromise;
  }

  docsMetaPromise = fetch(getDocsMetaUrl())
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      docsMetaCache = normalizeDocsMeta(data);
      return docsMetaCache;
    })
    .finally(() => {
      docsMetaPromise = null;
    });

  return docsMetaPromise;
}

export function getFirstNavigablePathForSection(section) {
  if (!section) {
    return null;
  }

  return findFirstPathInItems(section.items || []) || section.path || null;
}

export function getFirstNavigablePathForCategory(category) {
  if (!category) {
    return null;
  }

  return getFirstNavigablePathForSection(category.sections?.[0]);
}

export function getDefaultDocsPath(meta) {
  return getFirstNavigablePathForCategory(meta?.categories?.[0]) || '/';
}

export function collectDocPaths(meta) {
  const paths = new Set();

  const collectItems = (items = []) => {
    items.forEach((item) => {
      if (item.path) {
        paths.add(item.path);
      }

      if (item.children?.length) {
        collectItems(item.children);
      }
    });
  };

  (meta?.categories || []).forEach((category) => {
    paths.add(`/${category.id}`);

    (category.sections || []).forEach((section) => {
      if (section.path) {
        paths.add(section.path);
      }

      collectItems(section.items || []);
    });
  });

  return paths;
}

export function findMetaEntryByPath(meta, path) {
  for (const category of meta?.categories || []) {
    if (`/${category.id}` === path) {
      return { type: 'category', item: category, category, section: null };
    }

    for (const section of category.sections || []) {
      if (section.path === path) {
        return { type: 'section', item: section, category, section };
      }

      const foundItem = findItemByPath(section.items || [], path, category, section);
      if (foundItem) {
        return foundItem;
      }
    }
  }

  return null;
}

export function findActiveCategoryByPath(meta, path) {
  const found = findMetaEntryByPath(meta, path);

  if (found?.category) {
    return found.category;
  }

  const categories = meta?.categories || [];
  const categoryByPrefix = categories.find((category) => path.startsWith(`/${category.id}`));

  return categoryByPrefix || categories[0] || null;
}
