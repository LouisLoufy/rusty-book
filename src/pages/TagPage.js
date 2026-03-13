import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TagProvider, useTag } from '../contexts/TagContext';
import AppHeader from '../components/AppHeader/AppHeader';
import './TagPage.css';

// Inner component that uses TagContext
const TagPageContent = () => {
  const { tagName } = useParams();
  const decodedTagName = decodeURIComponent(tagName);
  const { getArticlesByTag, groupByCategory } = useTag();

  // Get all articles with this tag
  const articles = getArticlesByTag(decodedTagName);

  // Group articles by category
  const groupedArticles = groupByCategory(articles);
  const categories = Object.keys(groupedArticles);

  return (
    <>
      <Helmet>
        <title>#{decodedTagName} 标签 | BeatAI Docs</title>
        <meta
          name="description"
          content={`浏览所有带有 ${decodedTagName} 标签的文章，共 ${articles.length} 篇。`}
        />
      </Helmet>

      <div className="tag-page">
        <AppHeader />

        <div className="tag-page-container">
          <div className="tag-page-header">
            <h1 className="tag-page-title">#{decodedTagName}</h1>
            <p className="tag-page-subtitle">
              共 {articles.length} 篇文章
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="tag-page-empty">
              <p>暂无带有此标签的文章</p>
              <Link to="/" className="tag-page-back-link">
                返回首页
              </Link>
            </div>
          ) : (
            <div className="tag-page-content">
              {categories.map((category) => (
                <div key={category} className="tag-category-section">
                  <h2 className="tag-category-title">
                    <span className="tag-category-icon">📖</span>
                    {category}
                  </h2>

                  <div className="tag-articles-list">
                    {groupedArticles[category].map((article, index) => (
                      <Link
                        key={index}
                        to={article.path}
                        className="tag-article-item"
                      >
                        <span className="tag-article-arrow">→</span>
                        <span className="tag-article-title">{article.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Main component that loads meta and provides TagContext
const TagPage = () => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load docs metadata
    const metaPath = `${process.env.PUBLIC_URL}/docs/_meta.json`;
    fetch(metaPath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setMeta(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load docs meta:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="tag-page-loading">Loading...</div>;
  }

  if (!meta) {
    return <div className="tag-page-error">Failed to load metadata</div>;
  }

  return (
    <TagProvider meta={meta}>
      <TagPageContent />
    </TagProvider>
  );
};

export default TagPage;
