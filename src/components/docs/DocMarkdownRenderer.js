import React, { Suspense, lazy } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { sanitizeSchema } from './markdownRenderers';
import { useDocMarkdownComponents } from './docMarkdownRendererUtils';

const DocMarkdownMathRenderer = lazy(() => import('./DocMarkdownMathRenderer'));

const remarkPlugins = [remarkGfm, remarkCjkFriendly];
const rehypePlugins = [rehypeRaw, [rehypeSanitize, sanitizeSchema]];

function BaseDocMarkdownRenderer({
  children,
  enablePlayground = false,
  includeH1 = true,
  markdownUrl = '',
  onImageClick = null
}) {
  const markdownComponents = useDocMarkdownComponents({
    enablePlayground,
    includeH1,
    markdownUrl,
    onImageClick
  });

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={markdownComponents}
    >
      {children}
    </ReactMarkdown>
  );
}

export default function DocMarkdownRenderer({
  children,
  enableMath = false,
  enablePlayground = false,
  includeH1 = true,
  markdownUrl = '',
  onImageClick = null
}) {
  const baseRenderer = (
    <BaseDocMarkdownRenderer
      enablePlayground={enablePlayground}
      includeH1={includeH1}
      markdownUrl={markdownUrl}
      onImageClick={onImageClick}
    >
      {children}
    </BaseDocMarkdownRenderer>
  );

  if (!enableMath) {
    return baseRenderer;
  }

  return (
    <Suspense fallback={baseRenderer}>
      <DocMarkdownMathRenderer
        enablePlayground={enablePlayground}
        includeH1={includeH1}
        markdownUrl={markdownUrl}
        onImageClick={onImageClick}
      >
        {children}
      </DocMarkdownMathRenderer>
    </Suspense>
  );
}
