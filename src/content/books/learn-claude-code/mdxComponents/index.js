import AgentLoopSimulator from './AgentLoopSimulator';
import SourceViewer from './SourceViewer';
import DeepDive from './DeepDive';
import * as visualizations from './visualizations';
import './styles.css';

const mdxComponents = {
  AgentLoopSimulator,
  SourceViewer,
  DeepDive,
  ...visualizations
};

export default mdxComponents;
