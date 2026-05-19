import React from 'react';

const TagChipBar = ({ tags, selectedTag, onSelectTag, onClear }) => {
  const isAllActive = !selectedTag;

  return (
    <div className="archive-chips" role="radiogroup" aria-label="标签筛选">
      <button
        type="button"
        role="radio"
        aria-checked={isAllActive}
        className={`archive-chip archive-chip-all ${isAllActive ? 'is-active' : ''}`}
        onClick={onClear}
      >
        全部
      </button>
      {tags.map(({ tag }) => {
        const isActive = selectedTag === tag;
        return (
          <button
            key={tag}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`archive-chip ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelectTag(tag)}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
};

export default TagChipBar;
