import React from 'react';
import { defaultSchema } from 'rehype-sanitize';
import { slugifyHeading, getTextContent } from '../../utils/markdown';
import Prism from '../../utils/prism';

export const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a || []),
      'target',
      'rel'
    ]
  }
};

export function createMarkdownHeading(level) {
  return ({ children, ...props }) => {
    const text = getTextContent(children);
    const id = slugifyHeading(text);
    const Tag = `h${level}`;

    return (
      <Tag id={id} className={`doc-h${level}`} {...props}>
        {children}
      </Tag>
    );
  };
}

export function createMarkdownCodeComponent({ playgroundRenderer = null } = {}) {
  return ({ inline, className, children, ...props }) => {
    if (inline) {
      return <code className="doc-code-inline" {...props}>{children}</code>;
    }

    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const isPlayground = className?.includes('playground');

    if (isPlayground && playgroundRenderer) {
      return playgroundRenderer({ code, language });
    }

    const highlightedCode = language && Prism.languages[language]
      ? Prism.highlight(code, Prism.languages[language], language)
      : code;

    return (
      <code
        className={`doc-code-block ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        {...props}
      />
    );
  };
}

export function createMarkdownPreComponent() {
  return ({ children, ...props }) => {
    const codeClassName = children?.props?.className || '';
    const languageMatch = /language-(\w+)/.exec(codeClassName);
    const language = languageMatch ? languageMatch[1] : '';
    const preClassName = ['doc-pre', codeClassName, props.className].filter(Boolean).join(' ');

    return (
      <pre
        {...props}
        className={preClassName}
        data-language={language || undefined}
      >
        {children}
      </pre>
    );
  };
}
