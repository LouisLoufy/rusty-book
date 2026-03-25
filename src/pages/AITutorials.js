import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import LearnClaudeCodeIcon from '../components/icons/LearnClaudeCodeIcon';
import PageShell from '../components/layout/PageShell';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import { useDocsMeta } from '../hooks/useDocsMeta';
import { getLearnAiDefaultPath } from '../utils/learnAiPaths';
import { buildKnowledgeSpaces, getAiTutorialSpace } from '../utils/knowledgeSpaces';
import './AITutorials.css';

function AITutorialsContent({ categories, spaces }) {
  const handleCategoryClick = useCategoryNavigation();
  const [cardHovered, setCardHovered] = useState(false);
  const activeSpace = useMemo(() => getAiTutorialSpace(), []);

  return (
    <>
      <Helmet>
        <title>AI 学习教程 | BeatAI</title>
        <meta
          name="description"
          content="集中浏览 BeatAI 收录的 AI 学习教程，目前包含 Learn Claude Code，可直达书籍正文。"
        />
      </Helmet>

      <PageShell
        rootClassName="ai-tutorials-page"
        spaces={spaces}
        activeSpace={activeSpace}
        onSpaceClick={handleCategoryClick}
        categories={categories}
        activeCategory={null}
        onCategoryClick={handleCategoryClick}
      >
        <div className="ai-tutorials-container">
          <section className="ai-tutorials-grid" aria-label="AI tutorial books">
            <Link
              to={getLearnAiDefaultPath()}
              className="ai-tutorial-card glass-card"
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => setCardHovered(false)}
            >
              <div className="ai-tutorial-card-spotlight" aria-hidden="true"></div>
              <div className="ai-tutorial-card-icon">
                <LearnClaudeCodeIcon size={88} animated={cardHovered} />
              </div>
              <div className="ai-tutorial-card-body">
                <span className="ai-tutorial-card-badge">已上线</span>
                <h2>Learn Claude Code</h2>
                <p>
                  收录从零手搓 Claude Code 与最佳实践内容，覆盖学习路径、版本拆解、源码讲解与实践经验。
                </p>
              </div>
              <div className="ai-tutorial-card-footer">
                <span>1 本教程书</span>
                <span className="ai-tutorial-card-arrow">进入阅读</span>
              </div>
            </Link>
          </section>
        </div>
      </PageShell>
    </>
  );
}

export default function AITutorials() {
  const { meta, loading, error } = useDocsMeta();

  if (loading) {
    return <div className="ai-tutorials-status">Loading...</div>;
  }

  if (error || !meta) {
    return <div className="ai-tutorials-status">Failed to load tutorials</div>;
  }

  return (
    <AITutorialsContent
      categories={meta.categories || []}
      spaces={buildKnowledgeSpaces(meta)}
    />
  );
}
