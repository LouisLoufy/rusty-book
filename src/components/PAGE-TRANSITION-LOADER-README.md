# Page Transition Loader

## 功能概述

为页面跳转添加了创意酷炫的Loading效果，提升用户体验。**Loading动画至少持续1.2秒**，确保用户能够看到完整的加载动画和所有视觉效果。

## 设计特点

### 1. **视觉元素**
- 🎨 **BeatAI Logo**: 使用品牌Logo作为核心加载指示器
- 🌈 **渐变背景**: 动态呼吸式渐变背景
- ✨ **辉光效果**: Logo周围的脉冲辉光
- 🎯 **装饰粒子**: 6个浮动粒子增强视觉层次
- 📊 **进度条**: 流畅的渐变进度指示

### 2. **动画效果**
- **Logo容器**:
  - 上下浮动动画 (3秒周期)
  - 360度旋转动画 (8秒周期)
  - 脉冲缩放效果

- **背景层**:
  - 径向渐变呼吸 (2秒周期)
  - 透明度变化

- **文字**:
  - 渐变文字闪烁
  - 光泽扫过效果

- **进度条**:
  - 流畅填充动画 (1.5秒周期)
  - 发光阴影效果

- **装饰粒子**:
  - 浮动上升动画
  - 不同延迟形成波浪效果
  - 淡入淡出

### 3. **技术实现**

#### 最小加载时间控制
使用 `lazyWithMinLoadTime` 工具确保Loading至少显示1200ms（1.2秒）：

```javascript
// src/utils/lazyWithMinLoadTime.js
export const lazyWithMinLoadTime = (importFunc, minLoadTime = 1200) => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    importFunc().then((module) => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        resolve(module);
      }, remaining);
    });
  });
};
```

#### 在 App.js 中使用
```javascript
import { lazyWithMinLoadTime } from './utils/lazyWithMinLoadTime';

// Lazy load components with minimum load time (1200ms)
const Square = lazy(() => lazyWithMinLoadTime(() => import('./pages/Square')));

<Suspense fallback={<PageTransitionLoader />}>
  <Routes>
    {/* 路由配置 */}
  </Routes>
</Suspense>
```

### 4. **加载时间保证** ⏱️

- **最小持续时间**: 1200ms (1.2秒)
- **实际加载快于1200ms**: 延迟补足至1200ms
- **实际加载慢于1200ms**: 按实际时间加载
- **用户体验**: 确保动画完整播放，所有视觉效果（Logo浮动、旋转、粒子动画、进度条）都能被用户看到

### 4. **响应式设计**
- ✅ 桌面端：完整效果
- ✅ 平板端：适配调整
- ✅ 移动端：优化尺寸

### 5. **主题适配**
- ✅ Dark模式：明亮辉光效果
- ✅ Light模式：柔和阴影效果
- ✅ 自动适配Color Theme配色

## 触发场景

Loading效果会在以下情况下显示：

1. **初次加载**：首次访问网站
2. **页面跳转**：使用React Router的懒加载组件切换
3. **路由导航**：点击导航链接、卡片等
4. **代码分割**：动态导入的组件加载时

## 性能优化

- ✅ CSS动画（GPU加速）
- ✅ 使用 `transform` 而非 `position` 属性
- ✅ `will-change` 提示浏览器优化
- ✅ 最小化重绘和回流
- ✅ 文件大小：CSS 4KB，JS 1KB

## 文件结构

```
src/
├── components/
│   ├── PageTransitionLoader.js      # 组件逻辑
│   └── PageTransitionLoader.css     # 样式和动画
└── utils/
    └── lazyWithMinLoadTime.js       # 最小加载时间工具
```

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 移动浏览器

## 自定义调整

### 修改最小加载时间
```javascript
// 在 lazyWithMinLoadTime 调用时指定
const Square = lazy(() => lazyWithMinLoadTime(() => import('./pages/Square'), 1000)); // 1秒
```

### 修改动画速度
```css
/* 在 PageTransitionLoader.css 中 */
.loader-logo-wrapper {
  animation: logoFloat 3s ease-in-out infinite;  /* 修改这里 */
}
```

### 修改Logo大小
```javascript
// 在 PageTransitionLoader.js 中
<BeatAILogoWave size={80} />  {/* 修改 size 值 */}
```

### 修改颜色
使用CSS变量自动适配主题：
- `--accent-gradient`: 渐变色
- `--glow-color`: 辉光颜色
- `--background-gradient`: 背景渐变

## 未来优化

- [ ] 添加进度百分比显示
- [ ] 根据网络速度调整动画
- [ ] 添加更多粒子效果变体
- [ ] 支持自定义加载文案
