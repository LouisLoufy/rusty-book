// Book title mapping utility
// Maps book IDs (from URL paths) to human-readable titles from _meta.json
import { loadDocsMeta } from './docsMeta';

let bookTitleMap = null;
let loadPromise = null;

/**
 * Load book titles from _meta.json
 * @returns {Promise<Object>} Map of book ID to title
 */
export async function loadBookTitles() {
  // Return cached map if already loaded
  if (bookTitleMap) {
    return bookTitleMap;
  }

  // Return existing load promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const meta = await loadDocsMeta();

      // Build map from categories
      bookTitleMap = {};
      if (meta.categories && Array.isArray(meta.categories)) {
        meta.categories.forEach(category => {
          if (category.id && category.title) {
            bookTitleMap[category.id] = category.title;
          }
        });
      }

      return bookTitleMap;
    } catch (error) {
      console.error('Failed to load book titles:', error);
      bookTitleMap = {}; // Set empty map to prevent repeated failed requests
      return {};
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

/**
 * Get book title by ID
 * @param {string} bookId - The book ID from URL path
 * @returns {string} Human-readable book title or formatted ID
 */
export function getBookTitle(bookId) {
  if (!bookId) return '';

  // If map is loaded and has the title, use it
  if (bookTitleMap && bookTitleMap[bookId]) {
    return bookTitleMap[bookId];
  }

  // Fallback: Format the ID nicely (e.g., "rust-course" -> "Rust Course")
  return bookId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
