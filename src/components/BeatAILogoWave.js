import React from 'react';

/**
 * BeatAI Logo 设计方案 4 - 音频波形（带跳动效果）
 *
 * 设计理念：
 * - 音频波形条代表 "Beat" 的节奏感
 * - 波形按节拍跳动，符合 Beat 定位
 * - 简洁、动感、现代
 * - 使用主题配色（--accent-gradient）
 */
const BeatAILogoWave = ({ size = 32, className = '', animated = true }) => {
  // 使用唯一 ID 避免多个实例冲突
  const gradientId = `wave-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const animationId = `beat-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* 使用 CSS 变量获取主题配色 */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-start, #667eea)" />
          <stop offset="100%" stopColor="var(--accent-end, #f093fb)" />
        </linearGradient>
      </defs>

      {animated && (
        <style>
          {`
            @keyframes ${animationId}-beat-1 {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(1.4); }
            }
            @keyframes ${animationId}-beat-2 {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(1.2); }
            }
            @keyframes ${animationId}-beat-3 {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(1.3); }
            }
            @keyframes ${animationId}-beat-4 {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(1.15); }
            }

            .${animationId}-bar-1 {
              animation: ${animationId}-beat-1 1.2s ease-in-out infinite;
              transform-origin: center;
            }
            .${animationId}-bar-2 {
              animation: ${animationId}-beat-2 1.2s ease-in-out 0.1s infinite;
              transform-origin: center;
            }
            .${animationId}-bar-3 {
              animation: ${animationId}-beat-3 1.2s ease-in-out 0.2s infinite;
              transform-origin: center;
            }
            .${animationId}-bar-4 {
              animation: ${animationId}-beat-4 1.2s ease-in-out 0.3s infinite;
              transform-origin: center;
            }
            .${animationId}-bar-5 {
              animation: ${animationId}-beat-3 1.2s ease-in-out 0.4s infinite;
              transform-origin: center;
            }
            .${animationId}-bar-6 {
              animation: ${animationId}-beat-2 1.2s ease-in-out 0.5s infinite;
              transform-origin: center;
            }
            .${animationId}-bar-7 {
              animation: ${animationId}-beat-1 1.2s ease-in-out 0.6s infinite;
              transform-origin: center;
            }

            @keyframes ${animationId}-pulse {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }

            .${animationId}-dot {
              animation: ${animationId}-pulse 2s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g fill={`url(#${gradientId})`}>
        {/* 第一组 - 低 */}
        <rect className={animated ? `${animationId}-bar-1` : undefined} x="8" y="20" width="4" height="8" rx="2" />

        {/* 第二组 - 高 */}
        <rect className={animated ? `${animationId}-bar-2` : undefined} x="13" y="12" width="4" height="24" rx="2" />

        {/* 第三组 - 中 */}
        <rect className={animated ? `${animationId}-bar-3` : undefined} x="18" y="16" width="4" height="16" rx="2" />

        {/* 第四组 - 最高 (中心) */}
        <rect className={animated ? `${animationId}-bar-4` : undefined} x="23" y="8" width="4" height="32" rx="2" />

        {/* 第五组 - 中 */}
        <rect className={animated ? `${animationId}-bar-5` : undefined} x="28" y="16" width="4" height="16" rx="2" />

        {/* 第六组 - 高 */}
        <rect className={animated ? `${animationId}-bar-6` : undefined} x="33" y="12" width="4" height="24" rx="2" />

        {/* 第七组 - 低 */}
        <rect className={animated ? `${animationId}-bar-7` : undefined} x="38" y="20" width="4" height="8" rx="2" />
      </g>

      <circle
        className={animated ? `${animationId}-dot` : undefined}
        cx="10"
        cy="12"
        r="1.5"
        fill="var(--accent-start, #667eea)"
        opacity="0.7"
      />
      <circle
        className={animated ? `${animationId}-dot` : undefined}
        cx="38"
        cy="36"
        r="1.5"
        fill="var(--accent-end, #f093fb)"
        opacity="0.7"
        style={animated ? { animationDelay: '1s' } : undefined}
      />
    </svg>
  );
};

export default BeatAILogoWave;
