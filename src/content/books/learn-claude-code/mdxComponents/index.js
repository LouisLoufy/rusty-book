import AgentLoopSimulator from './AgentLoopSimulator';
import DeepDive from './DeepDive';
import SourceViewer from './SourceViewer';
import * as visualizations from '../visualizations';
import './styles.css';

const mdxComponents = {
  AgentLoopSimulator,
  DeepDive,
  SourceViewer,
  ...visualizations
};

export default mdxComponents;
