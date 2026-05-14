import React from 'react';
import {
  AI_CONTINENT_ROUTE_MAP,
  getDifficultyLabel
} from '../../data/aiContinentMap';

const WORLD_MAP_IMAGE_SRC = `${process.env.PUBLIC_URL || ''}/images/ai-continent/world-map-illustration.png`;

function getRouteClassNames(route, statusByNodeId, selectedNodeId, ancestorChain) {
  const fromStatus = statusByNodeId[route.from];
  const toStatus = statusByNodeId[route.to];
  const highlighted = selectedNodeId && (route.to === selectedNodeId || ancestorChain.has(route.from));

  return [
    'ai-map-route',
    `is-${route.kind}`,
    fromStatus === 'done' ? 'is-unlocked' : '',
    toStatus === 'done' ? 'is-done' : '',
    toStatus === 'ready' ? 'is-ready' : '',
    highlighted ? 'is-highlighted' : ''
  ]
    .filter(Boolean)
    .join(' ');
}

export default function MapScene({
  nodes,
  statusByNodeId,
  selectedNodeId,
  mode,
  pathSuggestion,
  ancestorChain,
  onSelectNode
}) {
  return (
    <div className="ai-map-wrap">
      <div className="ai-map-header">
        <div className="ai-map-heading">
          <h2>游戏地图贴图版</h2>
          <p>底图已换成完整地图插画，当前页面只叠加路线、节点和任务交互。</p>
        </div>
      </div>

      <div className="ai-map-canvas">
        <div
          className="ai-map-illustration"
          aria-hidden="true"
          style={{ backgroundImage: `url(${WORLD_MAP_IMAGE_SRC})` }}
        />

        <svg className="ai-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="routeRoadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dcc38a" />
              <stop offset="100%" stopColor="#f2dc9d" />
            </linearGradient>

            <linearGradient id="routeSeaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8fe6ff" />
              <stop offset="100%" stopColor="#54ccee" />
            </linearGradient>

            <linearGradient id="routeRidgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e7e4df" />
              <stop offset="100%" stopColor="#aeb4bb" />
            </linearGradient>
          </defs>

          {AI_CONTINENT_ROUTE_MAP.map((route) => {
            const routeClassName = getRouteClassNames(route, statusByNodeId, selectedNodeId, ancestorChain);

            return (
              <g key={route.id}>
                <path className={`ai-map-route-glow ${routeClassName}`} d={route.path} />
                <path className={routeClassName} d={route.path} />
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => {
          const status = statusByNodeId[node.id];
          const selected = node.id === selectedNodeId;
          const mainlineCandidate = mode === 'mainline' && pathSuggestion[0]?.id === node.id;
          const nodeClass = [
            'ai-node',
            `is-${status}`,
            selected ? 'is-selected' : '',
            mainlineCandidate ? 'is-mainline' : ''
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={node.id}
              type="button"
              className={nodeClass}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => onSelectNode(node.id)}
            >
              <span className="ai-node-anchor-line" />
              <span className="ai-node-surface">
                <span className="ai-node-topline">
                  <span className={`ai-node-status-dot is-${status}`} />
                  <span className="ai-node-difficulty">{getDifficultyLabel(node.difficulty)}</span>
                </span>
                <span className="ai-node-title">{node.title}</span>
                <span className="ai-node-zone">{node.zone}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="ai-map-legend">
        <span className="legend-item"><i className="legend-dot is-done" /> 已完成</span>
        <span className="legend-item"><i className="legend-dot is-ready" /> 可学习</span>
        <span className="legend-item"><i className="legend-dot is-locked" /> 未解锁</span>
        <span className="legend-item"><i className="legend-stroke is-road" /> 陆路</span>
        <span className="legend-item"><i className="legend-stroke is-sea" /> 航线</span>
      </div>
    </div>
  );
}
