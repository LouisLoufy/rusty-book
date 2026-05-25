import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { NotFoundState } from '../components/learnClaudeCode/NotFoundState';
import { getTutorialHubByPathname } from '../utils/tutorialHubs';
import LearnAiDocsBook from './LearnAiDocsBook';
import LearnClaudeCode from './LearnClaudeCode';

function TutorialBook() {
  const { space: spaceSlug } = useParams();
  const location = useLocation();
  const hub = getTutorialHubByPathname(location.pathname);

  if (!hub) {
    return <NotFoundState label={location.pathname} />;
  }

  const currentSpace = hub.getSpace(spaceSlug);
  if (!currentSpace) {
    return <NotFoundState label={spaceSlug || location.pathname} />;
  }

  if (currentSpace.contentSource === 'docs') {
    return <LearnAiDocsBook />;
  }

  if (hub.allowsLccContentSource && currentSpace.contentSource === 'lcc') {
    return <LearnClaudeCode />;
  }

  return <NotFoundState label={spaceSlug || location.pathname} />;
}

export default TutorialBook;
