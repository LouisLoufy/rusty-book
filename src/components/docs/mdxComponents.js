import { useMemo } from 'react';
import DocTabs, { DocTab } from './DocTabs';
import { useDocMarkdownComponents } from './docMarkdownRendererUtils';
import AgentLoopSimulator from '../learnClaudeCode/AgentLoopSimulator';
import DeepDive from '../learnClaudeCode/DeepDive';
import SourceViewer from '../learnClaudeCode/SourceViewer';
import { SessionVisualization } from '../../vendor/learn-claude-code/visualizations/index.js';
import '../learnClaudeCode/lcc-styles.css';

export function useMdxComponents({
  enablePlayground = false,
  includeH1 = true,
  markdownUrl = '',
  onImageClick = null
} = {}) {
  const docComponents = useDocMarkdownComponents({
    enablePlayground,
    includeH1,
    markdownUrl,
    onImageClick
  });

  return useMemo(() => ({
    ...docComponents,
    Tabs: DocTabs,
    Tab: DocTab,
    AgentLoopSimulator,
    SourceViewer,
    DeepDive,
    SessionVisualization
  }), [docComponents]);
}
