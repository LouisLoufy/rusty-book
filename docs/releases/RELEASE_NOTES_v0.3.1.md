# Release Notes v0.3.1

> 发布日期：2026-03-10
> 版本标签：v0.3.1
> 类型：Bug 修复版本

## 🐛 Bug 修复

### 修复侧边栏展开时的自动滚动问题

**问题描述**：
- 点击文档左侧导航栏的展开符号 `+` 时，导航栏会自动滚动到最底部
- 这导致用户需要手动滚动回原位置才能查看展开的内容
- 严重影响了导航的用户体验

**根本原因**：

在 `Sidebar.js` 组件中，自动滚动的 `useEffect` 错误地依赖了 `expandedItems` 状态：

```javascript
// 修复前（第 66 行）
useEffect(() => {
  const activeLink = navRef.current.querySelector('.sidebar-link.active');
  if (activeLink) {
    activeLink.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}, [location.pathname, expandedItems]); // ❌ 问题：依赖了 expandedItems
```

当用户点击 `+` 展开菜单时：
1. `toggleExpand()` 函数更新 `expandedItems` 状态
2. `expandedItems` 变化触发 `useEffect`
3. 执行 `scrollIntoView`，滚动到当前激活的链接
4. 如果激活的链接在页面底部，整个侧边栏就会滚动到底部

**解决方案**：

移除 `expandedItems` 依赖，只保留 `location.pathname`：

```javascript
// 修复后（第 66 行）
useEffect(() => {
  const activeLink = navRef.current.querySelector('.sidebar-link.active');
  if (activeLink) {
    activeLink.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}, [location.pathname]); // ✅ 只在路由变化时触发
```

现在：
- ✅ 点击 `+` 展开/折叠菜单 → 侧边栏保持在当前位置
- ✅ 点击链接跳转页面 → 侧边栏自动滚动到激活的链接（保持原有功能）

---

## 📦 文件变更

### 修改的文件

**src/components/docs/Sidebar.js**
- 第 66 行：移除 `expandedItems` 依赖
- 添加注释说明修改原因

```diff
- }, [location.pathname, expandedItems]);
+ }, [location.pathname]); // Only trigger on route change, not on manual expand/collapse
```

### 变更统计

```
修改文件数：1 个
修改行数：1 行代码 + 1 行注释
代码变化：-1 依赖项
```

---

## ✅ 验证测试

### 测试场景

#### 场景 1：展开菜单（修复的场景）

**操作**：
1. 滚动侧边栏到中间位置
2. 点击任意章节的 `+` 号展开子菜单

**预期结果**：
- ✅ 子菜单展开显示
- ✅ 侧边栏保持在当前滚动位置
- ✅ 不会自动滚动到其他位置

**修复前**：
- ❌ 侧边栏会自动滚动到底部
- ❌ 用户需要手动滚回原位置

#### 场景 2：折叠菜单

**操作**：
1. 点击已展开章节的 `−` 号折叠子菜单

**预期结果**：
- ✅ 子菜单折叠隐藏
- ✅ 侧边栏保持在当前位置
- ✅ 不会触发滚动

#### 场景 3：页面导航（保持原有功能）

**操作**：
1. 点击侧边栏中的某个链接
2. 页面跳转到新文档

**预期结果**：
- ✅ 页面内容正确加载
- ✅ 侧边栏自动滚动到新激活的链接
- ✅ 激活的链接显示在视口中央（原有功能保持）

---

## 🎯 影响分析

### 正面影响

✅ **修复了导航体验问题**
- 用户展开菜单时不再被迫滚动到底部
- 导航操作更加流畅自然
- 减少了用户的额外操作

✅ **保持了原有功能**
- 页面跳转时的自动定位功能仍然正常
- 不影响其他导航行为

### 无副作用

✅ **兼容性**
- 不影响任何其他组件
- 不改变 API 或配置格式
- 完全向后兼容

✅ **性能**
- 减少了不必要的 effect 触发
- 轻微提升性能（减少 DOM 操作）

---

## 📊 版本对比

### v0.3.0 → v0.3.1

| 指标 | v0.3.0 | v0.3.1 | 变化 |
|------|--------|--------|------|
| 侧边栏展开行为 | ❌ 自动滚动到底部 | ✅ 保持当前位置 | 修复 |
| 页面跳转滚动 | ✅ 正常 | ✅ 正常 | 无变化 |
| 代码行数 | 基准 | -1 行 | 优化 |
| 依赖项数量 | 2 | 1 | -1 |

---

## 🚀 升级指南

### 从 v0.3.0 升级

**1. 拉取最新代码**
```bash
git pull origin main
git checkout v0.3.1
```

**2. 无需额外操作**
- 不需要重新安装依赖
- 不需要更新配置
- 开发服务器会自动热重载

**3. 测试验证**
```bash
# 如果开发服务器未运行
npm start
```

访问 http://localhost:3000/docs 并测试导航展开功能。

---

## 📝 技术细节

### React useEffect 依赖项

**问题代码**：
```javascript
useEffect(() => {
  // 滚动逻辑
}, [location.pathname, expandedItems]);
```

`expandedItems` 是一个状态对象，存储了哪些菜单项被展开：
```javascript
{
  "/docs/rust-bible/basic-intro": true,
  "/docs/rust-bible/basic-trait-intro": true
}
```

当用户点击 `+` 时：
1. `toggleExpand(path)` 更新 `expandedItems`
2. `expandedItems` 变化触发所有依赖它的 `useEffect`
3. 滚动 effect 被触发，执行 `scrollIntoView`

**为什么这样设计**：

原始设计的意图是：当菜单展开时（比如路由变化导致的自动展开），滚动到激活的链接。

但这导致了副作用：**手动展开时也会触发滚动**。

**正确的设计**：

滚动只应该在**路由变化**时触发：
- 用户点击链接跳转 → 路由变化 → 滚动到新位置 ✅
- 用户手动展开菜单 → 路由不变 → 不滚动 ✅

---

## 🎉 总结

### 修复内容

✅ **修复侧边栏展开时的自动滚动 bug**
- 修改文件：`src/components/docs/Sidebar.js`
- 修改行数：1 行
- 影响：显著提升导航用户体验

### 版本信息

- **版本号**：v0.3.1
- **类型**：Bug 修复
- **发布日期**：2026-03-10
- **基于版本**：v0.3.0

---

**发布者**: Claude Opus 4.6
**审核者**: Sunfei
**状态**: 准备发布
