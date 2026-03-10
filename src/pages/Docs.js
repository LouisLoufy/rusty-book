import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DocsLayout from '../components/docs/DocsLayout';
import DocContent from '../components/docs/DocContent';
import './Docs.css';

const Docs = () => {
  const [docsMeta, setDocsMeta] = useState(null);

  useEffect(() => {
    // Load docs metadata
    fetch('/docs/_meta.json')
      .then(res => res.json())
      .then(data => setDocsMeta(data))
      .catch(err => console.error('Failed to load docs meta:', err));
  }, []);

  if (!docsMeta) {
    return <div className="docs-loading">Loading documentation...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Documentation | LoongBot</title>
        <meta name="description" content="Complete documentation for LoongBot - the open-source AI bot framework" />
      </Helmet>

      <DocsLayout meta={docsMeta}>
        <Routes>
          <Route index element={<Navigate to="/docs/getting-started/introduction" replace />} />
          <Route path=":category/:slug" element={<DocContent />} />
        </Routes>
      </DocsLayout>
    </>
  );
};

export default Docs;
