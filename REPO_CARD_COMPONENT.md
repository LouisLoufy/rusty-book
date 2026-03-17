# 📦 RepoCard 通用组件

## 📋 概述

将 Sidebar 中硬编码的 GitHub 仓库卡片重构为通用的 `RepoCard` 组件，支持为每本书籍显示对应的 GitHub 仓库信息。

## 🎯 重构目标

- ✅ 将 sidebar-repo-link 抽象为可复用的 RepoCard 组件
- ✅ 支持从 `_meta.json` 配置中读取仓库信息
- ✅ 每本书都可以有自己的 GitHub 仓库卡片
- ✅ 保持原有的样式和交互效果
- ✅ 移除硬编码的 rust-course 特殊处理

## 📦 组件位置

- `src/components/common/RepoCard.js` - 仓库卡片组件
- `src/components/common/RepoCard.css` - 样式文件
- `src/components/common/index.js` - 导出组件

## 🚀 使用方法

### 在 Sidebar 中使用（自动）

组件会自动从 `meta` 对象中读取 `githubRepo` 和 `repoTitle` 字段，无需手动配置：

```jsx
// Sidebar.js 中已集成
{repoInfo && (
  <RepoCard
    repoUrl={repoInfo.url}
    repoOwner={repoInfo.owner}
    repoName={repoInfo.name}
    title={repoInfo.title}
  />
)}
```

### 独立使用

```jsx
import { RepoCard } from '../common';

<RepoCard
  repoUrl="https://github.com/sunface/rust-course"
  repoOwner="sunface"
  repoName="rust-course"
  title="繁星点点，只因有你"
/>
```

## 📚 API 文档

### RepoCard Props

| 属性 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `repoUrl` | `string` | ✅ | - | GitHub 仓库完整 URL |
| `repoOwner` | `string` | ✅ | - | 仓库所有者（用户名或组织名） |
| `repoName` | `string` | ✅ | - | 仓库名称 |
| `title` | `string` | ❌ | `'繁星点点，只因有你'` | 卡片标题 |
| `className` | `string` | ❌ | `''` | 额外的 CSS 类名 |

## ⚙️ 配置说明

### 在 `_meta.json` 中配置仓库信息

每本书的 category 对象中添加以下字段：

```json
{
  "id": "rust-course",
  "title": "Rust语言圣经",
  "description": "Rust 编程语言完整学习指南",
  "githubRepo": "https://github.com/sunface/rust-course",
  "repoTitle": "繁星点点，只因有你",
  "sections": [...]
}
```

**字段说明：**

- `githubRepo` (string, 可选): GitHub 仓库完整 URL
- `repoTitle` (string, 可选): 卡片标题，默认为 "繁星点点，只因有你"

**注意：** 如果不配置 `githubRepo`，则该书籍不会显示仓库卡片。

## 🎨 样式特性

### 设计亮点

- ✅ Glass morphism 毛玻璃效果
- ✅ 渐变紫粉色边框和图标背景
- ✅ Hover 悬浮效果（上移、阴影）
- ✅ 响应式设计（移动端适配）
- ✅ Dark/Light 主题自适应

### 主要样式类

- `.repo-card` - 卡片容器
- `.repo-card-icon` - GitHub 图标容器
- `.repo-card-content` - 内容区域
- `.repo-card-title` - 标题（大写字母间距）
- `.repo-card-url` - 仓库链接

## 📖 示例

### 当前配置的书籍

#### 1. AI前沿分享
```json
{
  "githubRepo": "https://github.com/beatai-org/beatai.org",
  "repoTitle": "欢迎贡献内容"
}
```

显示效果：
```
┌─────────────────────────────────┐
│ [GitHub Icon]  欢迎贡献内容       │
│                beatai-org/beatai.org │
└─────────────────────────────────┘
```

#### 2. Rust语言圣经
```json
{
  "githubRepo": "https://github.com/sunface/rust-course",
  "repoTitle": "繁星点点，只因有你"
}
```

显示效果：
```
┌─────────────────────────────────┐
│ [GitHub Icon]  繁星点点，只因有你  │
│                sunface/rust-course │
└─────────────────────────────────┘
```

## 🔄 重构对比

### Before（硬编码）

```jsx
// Sidebar.js
const isRustCourse = location.pathname.startsWith('/rust-course');

{isRustCourse && (
  <div className="sidebar-repo-link glass-morphism">
    <div className="sidebar-repo-icon">
      <svg>...</svg>
    </div>
    <div className="sidebar-repo-content">
      <div className="sidebar-repo-title">繁星点点，只因有你</div>
      <a href="https://github.com/sunface/rust-course">
        sunface/rust-course
      </a>
    </div>
  </div>
)}
```

**问题：**
- ❌ 硬编码 rust-course
- ❌ 其他书籍无法使用
- ❌ 仓库信息分散在代码中
- ❌ 难以维护和扩展

### After（通用组件）

```jsx
// Sidebar.js
const repoInfo = meta.githubRepo ? {
  url: meta.githubRepo,
  owner: meta.githubRepo.split('/').slice(-2)[0],
  name: meta.githubRepo.split('/').slice(-1)[0],
  title: meta.repoTitle || '繁星点点，只因有你'
} : null;

{repoInfo && (
  <RepoCard
    repoUrl={repoInfo.url}
    repoOwner={repoInfo.owner}
    repoName={repoInfo.name}
    title={repoInfo.title}
  />
)}
```

**优势：**
- ✅ 所有书籍都可配置仓库卡片
- ✅ 仓库信息集中在 _meta.json
- ✅ 组件可复用
- ✅ 易于维护和扩展

## 🗑️ 已删除的代码

从 `Sidebar.css` 中移除了以下样式（共 60 行）：

- `.sidebar-repo-link`
- `.sidebar-repo-icon`
- `.sidebar-repo-content`
- `.sidebar-repo-title`
- `.sidebar-repo-url`

这些样式现在统一在 `RepoCard.css` 中管理。

## ✅ 测试检查项

- [ ] AI前沿分享页面显示 "beatai-org/beatai.org" 卡片
- [ ] Rust语言圣经页面显示 "sunface/rust-course" 卡片
- [ ] 卡片样式与之前保持一致
- [ ] Hover 效果正常
- [ ] 点击链接能正确跳转到 GitHub
- [ ] 移动端样式正常
- [ ] Dark/Light 模式切换正常

## 🔮 未来扩展

可以考虑添加：

- [ ] 显示 Star 数量
- [ ] 显示最新更新时间
- [ ] 显示贡献者数量
- [ ] 显示仓库描述
- [ ] 支持其他代码托管平台（GitLab、Gitee）
- [ ] 添加 Fork、Watch 按钮

---

**创建时间**: 2026-03-17
**版本**: 1.0.0
**影响范围**: Sidebar、所有书籍文档
