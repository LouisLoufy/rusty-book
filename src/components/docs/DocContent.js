import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import matter from 'gray-matter';
import TableOfContents from './TableOfContents';
import './DocContent.css';
import 'highlight.js/styles/github-dark.css';

// Utility function to convert heading text to URL-friendly ID
const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const DocContent = () => {
  const { category, slug } = useParams();
  const [content, setContent] = useState('');
  const [frontmatter, setFrontmatter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/docs/${category}/${slug}.md`);

        if (!response.ok) {
          throw new Error('Document not found');
        }

        const text = await response.text();
        const { data, content: markdownContent } = matter(text);

        setFrontmatter(data);
        setContent(markdownContent);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDoc();
  }, [category, slug]);

  // Extract headings from rendered content for TOC
  useEffect(() => {
    if (!content) return;

    // Wait for ReactMarkdown to render
    const timer = setTimeout(() => {
      const article = document.querySelector('.doc-content');
      const headingElements = article?.querySelectorAll('h2, h3, h4');
      const extractedHeadings = Array.from(headingElements || []).map((el) => ({
        id: el.id,
        text: el.textContent,
        level: parseInt(el.tagName.substring(1))
      }));
      setHeadings(extractedHeadings);
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  if (loading) {
    return <div className="doc-loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="doc-error">
        <h1>Document Not Found</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Create heading components with auto-generated IDs
  const createHeading = (level) => {
    return ({ children, ...props }) => {
      const text = children?.toString() || '';
      const id = slugify(text);
      const Tag = `h${level}`;
      return <Tag id={id} className={`doc-h${level}`} {...props}>{children}</Tag>;
    };
  };

  return (
    <>
      <Helmet>
        <title>{frontmatter.title} | LoongBot Docs</title>
        <meta name="description" content={frontmatter.description} />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
      </Helmet>

      <div className="doc-wrapper">
        <article className="doc-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: createHeading(1),
              h2: createHeading(2),
              h3: createHeading(3),
              h4: createHeading(4),
              p: ({ node, ...props }) => <p className="doc-p" {...props} />,
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              a: ({ node, ...props }) => <a className="doc-link" {...props} />,
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code className="doc-code-inline" {...props} />
                ) : (
                  <code className="doc-code-block" {...props} />
                ),
              pre: ({ node, ...props }) => <pre className="doc-pre" {...props} />,
              table: ({ node, ...props }) => (
                <div className="doc-table-wrapper">
                  <table className="doc-table" {...props} />
                </div>
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="doc-blockquote" {...props} />
              ),
              ul: ({ node, ...props }) => <ul className="doc-ul" {...props} />,
              ol: ({ node, ...props }) => <ol className="doc-ol" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        <TableOfContents headings={headings} />
      </div>
    </>
  );
};

export default DocContent;
