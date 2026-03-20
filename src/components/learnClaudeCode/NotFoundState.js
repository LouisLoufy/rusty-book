import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  LEARN_AI_BASE_PATH,
  LEARN_AI_PRACTICES_BASE_PATH,
  LEARN_CLAUDE_CODE_BASE_PATH,
  LEGACY_LEARN_CLAUDE_CODE_BASE_PATH
} from '../../utils/learnAiPaths';

export function NotFoundState({ label }) {
  return (
    <div className="doc-error">
      <h1>Page not found</h1>
      <p>{label}</p>
    </div>
  );
}

export function LearnRouteNotFound() {
  const location = useLocation();
  const label = location.pathname
    .replace(`${LEARN_AI_BASE_PATH}/`, '')
    .replace(`${LEARN_AI_PRACTICES_BASE_PATH}/`, '')
    .replace(`${LEARN_CLAUDE_CODE_BASE_PATH}/`, '')
    .replace(`${LEGACY_LEARN_CLAUDE_CODE_BASE_PATH}/`, '') || location.pathname;

  return <NotFoundState label={label} />;
}
