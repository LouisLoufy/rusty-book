// 浏览历史存储层的统一入口。
//
// HistoryStore 接口约定：
//   requiresAuth: boolean        该实现是否依赖登录
//   isReady(): boolean           当前能否读写（本地恒 true；远程需 token）
//   getAll(): Promise<Record[]>  读取全部记录
//   add(record): Promise<Record[]>  写入一条记录，返回去重截断后的新列表
//   clear(): Promise<void>       清空记录
//
// Record 形状：{ path, title, categoryId, category, section, visitedAt }
//
// 工厂按配置选择实现。未来接入远程存储（如以 GitHub 仓库为后端）时，
// 只需在此返回新的实现，HistoryContext / recorder / UI 均无需改动。

import { createLocalHistoryStore } from './localHistoryStore';

// eslint-disable-next-line no-unused-vars
export function createHistoryStore(options = {}) {
  // 未来：根据 options（如 githubToken、远程开关）切换到 RemoteHistoryStore
  return createLocalHistoryStore();
}
