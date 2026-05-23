import React, { createContext, useContext, useMemo } from 'react';
import { normalizeMetaPath } from '../utils/docsMeta';
import { forEachDocItem } from '../utils/docsMetaTraversal';

const TagContext = createContext();

export const useTag = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTag must be used within a TagProvider');
  }
  return context;
};

/**
 * Recursively build a tag index from meta.json structure
 * @param {Object} meta - The meta.json data
 * @returns {Object} - Tag index mapping tag names to article arrays
 */
const buildTagIndex = (meta) => {
  const tagIndex = {};

  forEachDocItem(meta, (item, { category }) => {
    if (item.tags.length > 0) {
      const articleInfo = {
        title: item.title,
        path: item.path,
        category: category.title,
        file: item.file
      };

      item.tags.forEach(tag => {
        if (!tagIndex[tag]) {
          tagIndex[tag] = [];
        }
        tagIndex[tag].push(articleInfo);
      });
    }
  }, { includeSections: true });

  return tagIndex;
};

/**
 * Get all unique tags from the meta data
 * @param {Object} tagIndex - The tag index
 * @returns {Array} - Sorted array of tag names
 */
const getAllTags = (tagIndex) => {
  return Object.keys(tagIndex).sort();
};

/**
 * Get articles by tag name
 * @param {Object} tagIndex - The tag index
 * @param {string} tagName - The tag to search for
 * @returns {Array} - Array of articles with the specified tag
 */
const getArticlesByTag = (tagIndex, tagName) => {
  return tagIndex[tagName] || [];
};

/**
 * Group articles by category
 * @param {Array} articles - Array of article objects
 * @returns {Object} - Object with categories as keys and article arrays as values
 */
const groupByCategory = (articles) => {
  const grouped = {};

  articles.forEach(article => {
    const category = article.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(article);
  });

  return grouped;
};

/**
 * Find tags for a specific article by path
 * @param {Object} meta - The meta.json data
 * @param {string} path - The article path
 * @returns {Array} - Array of tags for the article
 */
const findArticleTags = (meta, path) => {
  let foundTags = null;
  const normalizedPath = normalizeMetaPath(path);

  forEachDocItem(meta, (item) => {
    if (normalizeMetaPath(item.path) === normalizedPath) {
      foundTags = item.tags;
      return false;
    }
    return undefined;
  }, { includeSections: true });

  return foundTags || [];
};

export const TagProvider = ({ children, meta }) => {
  // Build tag index and cache it
  const tagIndex = useMemo(() => buildTagIndex(meta), [meta]);

  const value = {
    tagIndex,
    getAllTags: () => getAllTags(tagIndex),
    getArticlesByTag: (tagName) => getArticlesByTag(tagIndex, tagName),
    groupByCategory,
    findArticleTags: (path) => findArticleTags(meta, path)
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};
