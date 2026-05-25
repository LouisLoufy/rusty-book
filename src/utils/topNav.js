import { LEARN_AI_BASE_PATH } from './learnAiPaths';
import { MBA_BASE_PATH } from './mbaPaths';

// 顶部导航是一份薄薄的链接清单：label + href。
// 要新增一本书的快捷入口，在这里追加一行即可，href 写它的现有 URL（首篇文章或 hub 路径都行）。
// 不再依赖「自动把 doc category 升级成顶栏项」的隐式规则。
export const TOP_NAV_ITEMS = Object.freeze([
  { id: 'ai-insights',    label: 'AI 前沿学习',   href: '/ai-insights' },
  { id: 'rust-course',    label: 'RUST 语言圣经', href: '/rust-course/about-book' },
  { id: 'ai-tutorials',   label: 'AI 学习教程',   href: LEARN_AI_BASE_PATH },
  { id: 'mba-tutorials',  label: '组织管理教程',  href: MBA_BASE_PATH }
]);

// 最长前缀匹配，避免 /rust-course/foo 错点亮短前缀邻居。
export function getActiveTopNavItem(pathname = '') {
  return TOP_NAV_ITEMS
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0] || null;
}
