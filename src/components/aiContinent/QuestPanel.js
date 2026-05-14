import React from 'react';
import {
  AI_CONTINENT_NODE_MAP,
  getDifficultyLabel
} from '../../data/aiContinentMap';

export default function QuestPanel({
  selectedNode,
  selectedPrerequisites,
  completedSet,
  selectedMissing,
  statusByNodeId,
  canCompleteSelected,
  onCompleteSelected,
  pathSuggestion
}) {
  return (
    <aside className="ai-quest-panel">
      {selectedNode ? (
        <>
          <p className="quest-kicker">Quest Card</p>
          <h3>{selectedNode.title}</h3>
          <p className="quest-subtitle">{selectedNode.subtitle}</p>

          <div className="quest-meta">
            <span>地区：{selectedNode.zone}</span>
            <span>难度：{getDifficultyLabel(selectedNode.difficulty)}</span>
            <span>建议时长：{selectedNode.duration}</span>
          </div>

          <div className="quest-block">
            <h4>前置依赖</h4>
            {selectedPrerequisites.length === 0 ? (
              <p>无，已是起点区域。</p>
            ) : (
              <ul>
                {selectedPrerequisites.map((id) => (
                  <li key={id}>
                    {AI_CONTINENT_NODE_MAP[id].title}
                    {completedSet.has(id) ? ' (已完成)' : ' (未完成)'}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="quest-block">
            <h4>解锁状态</h4>
            {statusByNodeId[selectedNode.id] === 'done' && <p>该地点已完成，可以继续推进后续路线。</p>}
            {statusByNodeId[selectedNode.id] === 'ready' && <p>前置条件满足，可开始学习并标记完成。</p>}
            {statusByNodeId[selectedNode.id] === 'locked' && (
              <p>
                还缺 {selectedMissing.length} 个前置地点：
                {selectedMissing.map((id) => AI_CONTINENT_NODE_MAP[id].title).join('、')}
              </p>
            )}
          </div>

          <div className="quest-actions">
            <button
              type="button"
              className="quest-btn"
              onClick={onCompleteSelected}
              disabled={!canCompleteSelected}
            >
              完成当前地点
            </button>
          </div>

          <div className="quest-block">
            <h4>主线推荐（按依赖排序）</h4>
            {pathSuggestion.length === 0 ? (
              <p>恭喜，所有地点已探索完成。</p>
            ) : (
              <ul>
                {pathSuggestion.slice(0, 5).map((node, index) => (
                  <li key={node.id}>
                    {index + 1}. {node.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <p>请选择一个地点查看任务详情。</p>
      )}
    </aside>
  );
}
