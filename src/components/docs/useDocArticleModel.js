import { useMemo } from 'react';
import matter from 'gray-matter';
import { useMarkdownSource } from '../../hooks/useMarkdownSource';
import { findMetaEntryByPath } from '../../utils/docsMetaSelectors';
import { normalizeDocComponentMarkdown, resolvePublicContentUrl } from '../../utils/markdown';
import { AI_INSIGHTS_CATEGORY_ID } from '../../utils/siteRoutes';
import {
  buildDocPageDescription,
  buildDocPageTitle,
  formatContributors,
  formatPublishedDate,
  stripAiInsightsTitle
} from './docContentUtils';

export function useDocArticleModel({ meta, pathname = '', findTitleByPath = () => null } = {}) {
  const docPath = useMemo(() => pathname.replace(/^\//, ''), [pathname]);
  const docMetaEntry = useMemo(
    () => findMetaEntryByPath(meta, pathname),
    [meta, pathname]
  );
  const isAiInsightsArticle = docMetaEntry?.category?.id === AI_INSIGHTS_CATEGORY_ID;
  const titleFromMeta = useMemo(
    () => docMetaEntry?.item?.title || findTitleByPath(pathname),
    [docMetaEntry, findTitleByPath, pathname]
  );
  const markdownUrl = useMemo(() => {
    const fileFromMeta = docMetaEntry?.item?.file;
    return resolvePublicContentUrl(fileFromMeta || `/docs/${docPath}.md`);
  }, [docPath, docMetaEntry]);
  const {
    text: rawDoc,
    loading,
    error
  } = useMarkdownSource({
    url: markdownUrl,
    enabled: Boolean(docPath)
  });
  const { data: frontmatter, content } = useMemo(() => {
    if (!rawDoc) {
      return { data: {}, content: '' };
    }

    return matter(rawDoc);
  }, [rawDoc]);
  const pageTitle = useMemo(
    () => buildDocPageTitle(docPath, titleFromMeta, frontmatter.title),
    [docPath, frontmatter.title, titleFromMeta]
  );
  const pageDescription = useMemo(
    () => buildDocPageDescription(frontmatter.description, pageTitle),
    [frontmatter.description, pageTitle]
  );
  const markdownContent = useMemo(() => {
    return normalizeDocComponentMarkdown(
      stripAiInsightsTitle(content, isAiInsightsArticle)
    );
  }, [content, isAiInsightsArticle]);
  const historyRecord = useMemo(() => {
    if (error || !rawDoc || docMetaEntry?.type !== 'item') {
      return null;
    }

    const articleTitle = titleFromMeta || frontmatter.title;
    if (!articleTitle) {
      return null;
    }

    return {
      path: pathname,
      title: articleTitle,
      categoryId: docMetaEntry.category?.id || null,
      category: docMetaEntry.category?.title || null,
      section: docMetaEntry.section?.title || null
    };
  }, [
    docMetaEntry,
    error,
    frontmatter.title,
    pathname,
    rawDoc,
    titleFromMeta
  ]);

  return {
    content,
    docMetaEntry,
    docPath,
    error,
    formattedContributors: formatContributors(docMetaEntry?.item?.contributors),
    formattedPublishedDate: formatPublishedDate(docMetaEntry?.item?.publishedAt),
    frontmatter,
    historyRecord,
    isAiInsightsArticle,
    isTranslatedArticle: Boolean(frontmatter.url && frontmatter.translated),
    loading,
    markdownContent,
    markdownUrl,
    pageDescription,
    pageTitle,
    rawDoc,
    titleFromMeta
  };
}
