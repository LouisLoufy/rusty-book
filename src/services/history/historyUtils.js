// 浏览历史的纯函数工具：去重、截断、分组。
// 不依赖任何存储实现，本地与远程实现共用。

export const MAX_HISTORY = 100;

// 写入一条访问记录：按 path 去重，新记录置顶，超出上限截断。
export function upsertRecord(list, record) {
  const rest = (list || []).filter((item) => item.path !== record.path);
  return [record, ...rest].slice(0, MAX_HISTORY);
}

function dayKey(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatDayLabel(timestamp) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const key = dayKey(timestamp);
  if (key === dayKey(today)) {
    return '今天';
  }
  if (key === dayKey(yesterday)) {
    return '昨天';
  }

  const d = new Date(timestamp);
  if (d.getFullYear() === today.getFullYear()) {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 严格按访问时间倒序，再按天(day)切分为分组。
export function groupByDate(list) {
  const sorted = [...(list || [])].sort((a, b) => b.visitedAt - a.visitedAt);

  const groups = [];
  let current = null;

  sorted.forEach((record) => {
    const key = dayKey(record.visitedAt);
    if (!current || current.key !== key) {
      current = { key, label: formatDayLabel(record.visitedAt), records: [] };
      groups.push(current);
    }
    current.records.push(record);
  });

  return groups;
}
