import { normalizeDocsMeta } from './docsMetaNormalizer';
import { forEachDocItem } from './docsMetaTraversal';

const QUIET = { warn: false };

function createMeta() {
  return normalizeDocsMeta({
    categories: [{
      id: 'book',
      title: 'Book',
      sections: [{
        title: 'Section',
        items: [{
          title: 'Parent',
          path: 'book/parent',
          children: [{
            title: 'Child',
            path: 'book/child'
          }],
          items: [{
            title: 'Nested Item',
            path: 'book/nested'
          }]
        }]
      }]
    }]
  }, QUIET);
}

test('walks normalized doc items with category and section context', () => {
  const visited = [];

  forEachDocItem(createMeta(), (item, { category, section }) => {
    visited.push(`${category.title}/${section.title}/${item.title}`);
  }, { includeSections: true });

  expect(visited).toEqual([
    'Book/Section/Section',
    'Book/Section/Parent',
    'Book/Section/Child',
    'Book/Section/Nested Item'
  ]);
});

test('stops traversal when visitor returns false', () => {
  const visited = [];

  forEachDocItem(createMeta(), (item) => {
    visited.push(item.title);
    return item.title === 'Parent' ? false : undefined;
  }, { includeSections: true });

  expect(visited).toEqual(['Section', 'Parent']);
});
