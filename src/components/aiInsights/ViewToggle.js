import React from 'react';

const OPTIONS = [
  { value: 'card', label: '卡片' },
  { value: 'list', label: '列表' },
];

const ViewToggle = ({ value, onChange }) => {
  return (
    <div className="archive-view-toggle" role="radiogroup" aria-label="视图模式">
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`archive-view-toggle-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default ViewToggle;
