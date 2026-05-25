import React from 'react';

// Inline "page within a book wasn't found" state. Generic — used by any book
// renderer that wants to render an in-shell 404 (e.g. when the URL points at
// a path the book's `_meta.json` doesn't enumerate).
export function NotFoundState({ label }) {
  return (
    <div className="doc-error">
      <h1>Page not found</h1>
      <p>{label}</p>
    </div>
  );
}
