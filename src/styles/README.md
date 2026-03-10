# 通用动态背景系统

## 概述

这是一个可复用的动态背景系统，为页面提供统一的视觉效果，包括：
- 动态渐变背景（3层径向渐变，带动画效果）
- 网格背景（可自定义密度）
- 深色/浅色主题自适应

## 使用方法

### 基础用法

1. **导入 CSS 文件**

```javascript
import '../styles/Background.css';
```

2. **添加类名到容器元素**

```jsx
<div className="dynamic-background">
  {/* 你的内容 */}
</div>
```

### 变体

#### 静态背景（无动画）

如果你想要相同的视觉效果但不需要动画：

```jsx
<div className="dynamic-background dynamic-background-static">
  {/* 你的内容 */}
</div>
```

#### 不同网格密度

- **密集网格**（40px 间距）

```jsx
<div className="dynamic-background dynamic-background-dense">
  {/* 你的内容 */}
</div>
```

- **稀疏网格**（80px 间距）

```jsx
<div className="dynamic-background dynamic-background-sparse">
  {/* 你的内容 */}
</div>
```

## 技术细节

### 背景层级

1. **渐变层（::before）**
   - z-index: 0
   - 使用 3 个径向渐变创建流动效果
   - 动画周期：20 秒
   - 浅色模式透明度：0.1-0.15
   - 深色模式透明度：0.18-0.25

2. **网格层（::after）**
   - z-index: 0
   - 默认网格尺寸：60px × 60px
   - 使用 CSS linear-gradient 创建
   - pointer-events: none（不影响交互）

### 主题支持

系统自动适配 `[data-theme="dark"]` 和 `[data-theme="light"]`：

- **浅色模式**：较淡的渐变和网格，更轻盈的视觉
- **深色模式**：较强的渐变和网格，更鲜明的对比

### 动画

`@keyframes backgroundFlow` 实现流动效果：
- 缩放范围：1.0 - 1.1
- 旋转范围：-2° - 2°
- 透明度变化：0.8 - 1.0

## 现有应用

目前已在以下页面使用：

- ✅ 主页（`App.js`）
- ✅ 文档页面（`DocsLayout.js`）

## 自定义

### 修改渐变颜色

编辑 `Background.css` 中的 `radial-gradient` 值：

```css
.dynamic-background::before {
  background:
    radial-gradient(circle at 20% 30%, rgba(YOUR_COLOR) 0%, transparent 50%),
    /* ... */
}
```

### 修改网格尺寸

```css
.dynamic-background::after {
  background-size: 80px 80px; /* 默认是 60px 60px */
}
```

### 调整动画速度

```css
.dynamic-background::before {
  animation: backgroundFlow 15s ease-in-out infinite; /* 默认 20s */
}
```

## 性能优化

- 使用 `pointer-events: none` 避免影响交互
- CSS 动画由 GPU 加速
- 伪元素实现，不增加 DOM 节点
- 使用 `will-change: transform` 可进一步优化（如需要）

## 注意事项

⚠️ **确保容器内容的 z-index 大于 0**

由于背景层的 z-index 为 0，容器内的内容需要设置相对定位和适当的 z-index：

```css
.your-content {
  position: relative;
  z-index: 1;
}
```

## 未来扩展

可能的扩展方向：

- [ ] 添加更多渐变颜色变体
- [ ] 提供自定义 CSS 变量支持
- [ ] 添加粒子效果层
- [ ] 支持用户自定义动画速度
