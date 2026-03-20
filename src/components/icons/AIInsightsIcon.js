import React from 'react';

/**
 * AI 前沿分享图标 - 创意设计
 *
 * 设计理念：
 * - 神经网络节点 + 能量波动
 * - 代表 AI 的智能和动态
 * - 使用主题配色
 */
const AIInsightsIcon = ({ size = 80, className = '', animated = true }) => {
  const gradientId = `ai-icon-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-start, #667eea)" />
          <stop offset="100%" stopColor="var(--accent-end, #f093fb)" />
        </linearGradient>

        {/* 辉光效果 */}
        <filter id={`${gradientId}-glow`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 背景圆环 */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        opacity="0.2"
      />

      {/* 中心主节点 */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill={`url(#${gradientId})`}
        filter={`url(#${gradientId}-glow)`}
      />

      {/* 神经网络节点 - 上 */}
      <circle
        cx="50"
        cy="20"
        r="6"
        fill={`url(#${gradientId})`}
        opacity="0.8"
      />

      {/* 神经网络节点 - 右上 */}
      <circle
        cx="75"
        cy="30"
        r="6"
        fill={`url(#${gradientId})`}
        opacity="0.8"
      />

      {/* 神经网络节点 - 右下 */}
      <circle
        cx="75"
        cy="70"
        r="6"
        fill={`url(#${gradientId})`}
        opacity="0.8"
      />

      {/* 神经网络节点 - 左下 */}
      <circle
        cx="25"
        cy="70"
        r="6"
        fill={`url(#${gradientId})`}
        opacity="0.8"
      />

      {/* 神经网络节点 - 左上 */}
      <circle
        cx="25"
        cy="30"
        r="6"
        fill={`url(#${gradientId})`}
        opacity="0.8"
      />

      {/* 连接线 - 从中心到各节点 */}
      <g stroke={`url(#${gradientId})`} strokeWidth="1.5" opacity="0.4">
        <line x1="50" y1="50" x2="50" y2="20" />
        <line x1="50" y1="50" x2="75" y2="30" />
        <line x1="50" y1="50" x2="75" y2="70" />
        <line x1="50" y1="50" x2="25" y2="70" />
        <line x1="50" y1="50" x2="25" y2="30" />
      </g>

      {/* 能量波动环 - 动画 */}
      <circle
        cx="50"
        cy="50"
        r="20"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      >
        {animated ? (
          <>
            <animate
              attributeName="r"
              from="20"
              to="35"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.6"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          </>
        ) : null}
      </circle>

      {/* 装饰粒子 */}
      <circle cx="85" cy="15" r="2" fill={`url(#${gradientId})`} opacity="0.6" />
      <circle cx="15" cy="85" r="2" fill={`url(#${gradientId})`} opacity="0.6" />
      <circle cx="85" cy="85" r="2" fill={`url(#${gradientId})`} opacity="0.6" />
    </svg>
  );
};

export default AIInsightsIcon;
