import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import PageSeo from '../components/seo/PageSeo';
import { ReadingModeProvider } from '../contexts/ReadingModeContext';
import { useReadingModeSearchParam } from '../hooks/useReadingModeSearchParam';
import { getBookDefaultUrl, getBooksOfCollection } from '../content';
import { preloadRouteForPath } from '../utils/routePrefetch';
import './AITutorials.css';

export default function CollectionPage({ collection }) {
  const readingMode = useReadingModeSearchParam();
  const { isReadingMode } = readingMode;
  const books = useMemo(() => getBooksOfCollection(collection), [collection]);

  const preloadBookRoute = (book) => {
    preloadRouteForPath(getBookDefaultUrl(book));
  };

  return (
    <ReadingModeProvider value={readingMode}>
      <>
        <PageSeo title={collection.title} description={collection.description} />

        <PageShell
          rootClassName={`ai-tutorials-page ${isReadingMode ? 'reading-mode' : ''}`.trim()}
          hideHeader={isReadingMode}
        >
          <div className="ai-tutorials-container">
            <section className="ai-tutorials-grid" aria-label={`${collection.title} books`}>
              {books.map((book) => (
                <Link
                  key={book.id}
                  to={getBookDefaultUrl(book)}
                  className="ai-tutorial-card glass-card"
                  onMouseEnter={() => preloadBookRoute(book)}
                  onFocus={() => preloadBookRoute(book)}
                  onTouchStart={() => preloadBookRoute(book)}
                >
                  <h2>{book.bookTitle}</h2>
                  <p>{book.description}</p>
                </Link>
              ))}
            </section>
          </div>
        </PageShell>
      </>
    </ReadingModeProvider>
  );
}
