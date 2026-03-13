import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import './styles/Background.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnnotationProvider } from './contexts/AnnotationContext';
import { TagProvider } from './contexts/TagContext';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Docs = lazy(() => import('./pages/Docs'));
const MyNotes = lazy(() => import('./components/docs/MyNotes'));
const TagPage = lazy(() => import('./pages/TagPage'));
const Square = lazy(() => import('./pages/Square'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AnnotationProvider>
          <BrowserRouter>
            <div className="App dynamic-background">
              <Suspense fallback={<div className="loading">Loading...</div>}>
                <Routes>
                  <Route path="/genesis-lab" element={<Home />} />
                  <Route path="/my-notes" element={<MyNotes />} />
                  <Route path="/square" element={<Square />} />
                  <Route path="/tags/:tagName" element={<TagPage />} />
                  <Route path="/*" element={<Docs />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </AnnotationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
