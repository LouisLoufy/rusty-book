import React, { Suspense, lazy, useCallback, useMemo } from 'react';
import {
  createDocMarkdownComponents,
  createMarkdownCodeComponent,
  createMarkdownPreComponent
} from './markdownRenderers';

const LazyCodePlayground = lazy(() => import('./CodePlayground'));

function CodePlaygroundFallback({ code, language }) {
  return (
    <code
      className={`doc-code-block ${language ? `language-${language}` : ''}`.trim()}
      data-raw-code={code}
    >
      {code}
    </code>
  );
}

export function useDocMarkdownComponents({
  enablePlayground = false,
  includeH1 = true,
  markdownUrl = '',
  onImageClick = null
} = {}) {
  const playgroundRenderer = useCallback(({ code, language }) => {
    if (!enablePlayground) {
      return null;
    }

    return (
      <Suspense fallback={<CodePlaygroundFallback code={code} language={language} />}>
        <LazyCodePlayground initialCode={code} language={language} />
      </Suspense>
    );
  }, [enablePlayground]);

  return useMemo(() => {
    const codeComponent = createMarkdownCodeComponent({
      playgroundRenderer: enablePlayground ? playgroundRenderer : null
    });
    const preComponent = createMarkdownPreComponent();

    return createDocMarkdownComponents({
      codeComponent,
      includeH1,
      markdownUrl,
      onImageClick,
      preComponent
    });
  }, [enablePlayground, includeH1, markdownUrl, onImageClick, playgroundRenderer]);
}
