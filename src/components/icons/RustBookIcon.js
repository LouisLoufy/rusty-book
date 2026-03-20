import React from 'react';

/**
 * Rust 语言圣经图标 - 创意设计
 *
 * 设计理念：
 * - 齿轮 + 代码符号
 * - 代表 Rust 的系统编程和精密性
 * - 使用主题配色
 */
const RustBookIcon = ({ size = 80, className = '', animated = true }) => {
  const gradientId = `rust-icon-gradient-${Math.random().toString(36).substr(2, 9)}`;

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
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 书本外形 */}
      <path
        d="M 25 15 L 75 15 L 75 85 L 25 85 L 25 15 Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />

      {/* 书脊 */}
      <line
        x1="30"
        y1="15"
        x2="30"
        y2="85"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        opacity="0.5"
      />

      {/* 齿轮 - 外圈 */}
      <circle
        cx="50"
        cy="45"
        r="18"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        fill="none"
        filter={`url(#${gradientId}-glow)`}
      />

      {/* 齿轮 - 内圈 */}
      <circle
        cx="50"
        cy="45"
        r="10"
        fill={`url(#${gradientId})`}
        opacity="0.2"
      />

      {/* 齿轮齿 - 8个 */}
      <g fill={`url(#${gradientId})`} opacity="0.8">
        {/* 上 */}
        <rect x="48" y="25" width="4" height="6" rx="1" />
        {/* 右上 */}
        <rect x="61" y="31" width="6" height="4" rx="1" transform="rotate(45 64 33)" />
        {/* 右 */}
        <rect x="66" y="43" width="6" height="4" rx="1" />
        {/* 右下 */}
        <rect x="61" y="55" width="6" height="4" rx="1" transform="rotate(-45 64 57)" />
        {/* 下 */}
        <rect x="48" y="63" width="4" height="6" rx="1" />
        {/* 左下 */}
        <rect x="31" y="55" width="6" height="4" rx="1" transform="rotate(45 34 57)" />
        {/* 左 */}
        <rect x="26" y="43" width="6" height="4" rx="1" />
        {/* 左上 */}
        <rect x="31" y="31" width="6" height="4" rx="1" transform="rotate(-45 34 33)" />
      </g>

      {/* 中心代码符号 {} */}
      <text
        x="50"
        y="50"
        fontSize="16"
        fontWeight="bold"
        fill={`url(#${gradientId})`}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="monospace"
      >
        {'{}'}
      </text>

      {/* 书页装饰线 */}
      <g stroke={`url(#${gradientId})`} strokeWidth="1.5" opacity="0.3">
        <line x1="35" y1="70" x2="65" y2="70" />
        <line x1="35" y1="75" x2="60" y2="75" />
        <line x1="35" y1="80" x2="55" y2="80" />
      </g>

      {/* 装饰星星 */}
      <g fill={`url(#${gradientId})`} opacity="0.6">
        <circle cx="70" cy="20" r="2" />
        <circle cx="75" cy="25" r="1.5" />
        <circle cx="30" cy="75" r="1.5" />
      </g>

      {/* 旋转动画齿轮（可选） */}
      {animated ? (
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 50 45"
          to="360 50 45"
          dur="20s"
          repeatCount="indefinite"
        />
      ) : null}
    </svg>
  );
};

export default RustBookIcon;
