// 浏览历史的 localStorage 实现。
// 不依赖登录态：匿名浏览也会被记录。

import { upsertRecord } from './historyUtils';

const STORAGE_KEY = 'beatai-history';

export function createLocalHistoryStore() {
  return {
    requiresAuth: false,

    isReady() {
      return true;
    },

    async getAll() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
      } catch (error) {
        console.error('Failed to read browsing history:', error);
        return [];
      }
    },

    async add(record) {
      const list = await this.getAll();
      const next = upsertRecord(list, record);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (error) {
        console.error('Failed to write browsing history:', error);
      }
      return next;
    },

    async clear() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear browsing history:', error);
      }
    }
  };
}
