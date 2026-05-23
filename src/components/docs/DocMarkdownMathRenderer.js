import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import 'katex/dist/katex.min.css';
import { sanitizeSchema } from './markdownRenderers';
import { useDocMarkdownComponents } from './docMarkdownRendererUtils';

const remarkPlugins = [remarkGfm, remarkCjkFriendly, remarkMath];
const rehypePlugins = [rehypeRaw, [rehypeSanitize, sanitizeSchema], rehypeKatex];

export default function DocMarkdownMathRenderer({
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
