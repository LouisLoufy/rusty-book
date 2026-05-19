import React from 'react';
import { Link } from 'react-router-dom';

const ArchiveList = ({ groups }) => {
  return (
    <div className="archive-list">
      {groups.map(({ date, articles }) => (
        <section key={date} className="archive-list-group">
          <h2 className="archive-list-date">
            <span className="archive-list-date-mark">##</span>
            <span className="archive-list-date-value">{date}</span>
          </h2>
          <ul className="archive-list-items">
            {articles.map((article) => (
              <li key={article.path} className="archive-list-item">
                <span className="archive-list-bullet">-</span>
                <Link
                  to={{ pathname: article.path, search: '?mode=read' }}
                  className="archive-list-link"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default ArchiveList;
