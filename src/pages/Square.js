import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppHeader from '../components/AppHeader/AppHeader';
import Footer from '../components/Footer/Footer';
import './Square.css';

const Square = () => {
  const [meta, setMeta] = useState(null);
  const navigate = useNavigate();

  // Load docs metadata
  useEffect(() => {
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
      })
      .catch(err => console.error('Failed to load docs meta:', err));
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the first item in the first section of this category
    const firstSection = category.sections?.[0];
    const firstItem = firstSection?.items?.[0];

    if (firstItem?.path) {
      navigate(firstItem.path);
    }
  };

  const categories = meta?.categories || [];

  return (
    <>
      <Helmet>
        <title>广场 | BeatAI</title>
        <meta name="description" content="BeatAI 社区广场 - 分享、交流与探索" />
      </Helmet>

      <div className="square-page dynamic-background">
        {/* Background Layer */}
        <div className="sailor-moon-bg-layer"></div>

        {/* 复用统一的 AppHeader - 广场页面不激活任何书籍标签 */}
        <AppHeader
          categories={categories}
          activeCategory={null}
          onCategoryClick={handleCategoryClick}
        />

        <div className="square-container">
          <div className="square-hero">
            <h1 className="square-title">欢迎来到广场</h1>
            <p className="square-subtitle">
              这是一个开放的交流空间，在这里你可以分享想法、探索知识、结识同好
            </p>
          </div>

          <div className="square-content">
            <div className="square-section">
              <h2 className="section-title">探索内容</h2>
              <div className="square-grid">
                <div className="square-card glass-card">
                  <div className="card-icon">🏷️</div>
                  <h3>标签浏览</h3>
                  <p>按标签探索相关内容</p>
                  <a href="/tags/Rust" className="card-link">浏览标签 →</a>
                </div>

                <div className="square-card glass-card">
                  <div className="card-icon">📚</div>
                  <h3>知识文档</h3>
                  <p>系统化的技术学习资料</p>
                  <a href="/rust-course/about-book" className="card-link">开始学习 →</a>
                </div>

                <div className="square-card glass-card">
                  <div className="card-icon">💡</div>
                  <h3>AI 前沿</h3>
                  <p>最新的 AI 技术分享</p>
                  <a href="/ai-insights/viewpoint/intro" className="card-link">了解更多 →</a>
                </div>

                <div className="square-card glass-card">
                  <div className="card-icon">📝</div>
                  <h3>我的笔记</h3>
                  <p>记录学习与思考</p>
                  <a href="/my-notes" className="card-link">查看笔记 →</a>
                </div>
              </div>
            </div>

            <div className="square-section">
              <h2 className="section-title">热门标签</h2>
              <div className="tags-cloud">
                <a href="/tags/Rust" className="tag-cloud-item">Rust</a>
                <a href="/tags/基础" className="tag-cloud-item">基础</a>
                <a href="/tags/进阶" className="tag-cloud-item">进阶</a>
                <a href="/tags/所有权" className="tag-cloud-item">所有权</a>
                <a href="/tags/AI" className="tag-cloud-item">AI</a>
                <a href="/tags/入门" className="tag-cloud-item">入门</a>
                <a href="/tags/数据类型" className="tag-cloud-item">数据类型</a>
                <a href="/tags/Cargo" className="tag-cloud-item">Cargo</a>
              </div>
            </div>
          </div>
        </div>

        {/* 复用统一的 Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Square;
