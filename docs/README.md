# 文档索引

本目录包含项目的设计文档和发布说明。

## 📁 目录结构

```
docs/
├── design/          # 设计文档和技术方案
├── releases/        # 版本发布说明
└── README.md        # 本文件
```

---

## 📐 设计文档

设计文档记录了重要的技术决策、问题分析和解决方案。

### 已有文档

1. **[DARK_MODE_FIX.md](./design/DARK_MODE_FIX.md)**
   - 暗色模式显示问题的分析和修复
   - 包含问题诊断、根本原因和解决方案
   - 相关版本：v0.2.0

2. **[THEME_SWITCH_FIX.md](./design/THEME_SWITCH_FIX.md)**
   - 主题切换闪烁问题的完整修复记录
   - 详细的问题分析和多种解决方案对比
   - 相关版本：v0.2.0

3. **[BUG_FIX_REPORT.md](./design/BUG_FIX_REPORT.md)**
   - Bug 修复的汇总报告
   - 包含测试结果和验证清单
   - 相关版本：v0.2.0

4. **[IMPLEMENTATION_SUMMARY.md](./design/IMPLEMENTATION_SUMMARY.md)**
   - 实施总结文档
   - 记录实现细节和技术栈
   - 相关版本：v0.2.0

---

## 📦 发布说明

发布说明记录了每个版本的新功能、修复和改进。

### 版本历史

#### [v0.3.0](./releases/RELEASE_NOTES_v0.3.0.md) - 2026-03-10
**重大更新：两级导航系统 + UI 全面优化**

主要亮点：
- 🎉 全新的两级独立导航系统
- 📚 Rust语言圣经文档（61个文档）
- 🐛 修复 TOC Unicode 兼容性（中文标题支持）
- 🎨 极简设计风格 + 布局紧凑化
- 📏 内容区域扩展（+56px 可用空间）

#### [v0.2.0](./releases/RELEASE_NOTES_v0.2.0.md) - 之前版本
**主题系统和基础功能**

主要亮点：
- 🎨 主题系统实现
- 🐛 暗色模式修复
- 🔧 基础文档系统

---

## 📝 文档规范

### 设计文档模板

创建新的设计文档时，请遵循以下结构：

```markdown
# 标题

> 创建日期：YYYY-MM-DD
> 作者：[姓名]
> 相关版本：vX.X.X

## 问题描述
[详细描述要解决的问题]

## 分析
[问题的根本原因分析]

## 解决方案
[提出的解决方案]

### 方案对比
[如果有多个方案，进行对比]

## 实施
[具体的实施步骤]

## 验证
[如何验证方案有效]

## 后续
[后续需要关注的事项]
```

### 发布说明模板

创建新的发布说明时，请遵循以下结构：

```markdown
# Release Notes vX.X.X

> 发布日期：YYYY-MM-DD
> 版本标签：vX.X.X

## 🎉 新功能
[列出新增功能]

## 🐛 修复
[列出修复的问题]

## 🎨 优化
[列出改进项]

## 📦 文件变更
[统计数据]

## 🚀 升级指南
[如何升级]

## 📊 性能对比
[性能数据]
```

---

## 🔍 快速查找

### 按主题查找

**导航系统**
- [v0.3.0 Release Notes](./releases/RELEASE_NOTES_v0.3.0.md) - 两级导航系统

**主题系统**
- [DARK_MODE_FIX.md](./design/DARK_MODE_FIX.md) - 暗色模式修复
- [THEME_SWITCH_FIX.md](./design/THEME_SWITCH_FIX.md) - 主题切换优化

**Bug 修复**
- [BUG_FIX_REPORT.md](./design/BUG_FIX_REPORT.md) - Bug 修复汇总

**实施记录**
- [IMPLEMENTATION_SUMMARY.md](./design/IMPLEMENTATION_SUMMARY.md) - 实施总结

### 按版本查找

**v0.3.0**
- 发布说明：[RELEASE_NOTES_v0.3.0.md](./releases/RELEASE_NOTES_v0.3.0.md)

**v0.2.0**
- 发布说明：[RELEASE_NOTES_v0.2.0.md](./releases/RELEASE_NOTES_v0.2.0.md)
- 设计文档：
  - [DARK_MODE_FIX.md](./design/DARK_MODE_FIX.md)
  - [THEME_SWITCH_FIX.md](./design/THEME_SWITCH_FIX.md)
  - [BUG_FIX_REPORT.md](./design/BUG_FIX_REPORT.md)
  - [IMPLEMENTATION_SUMMARY.md](./design/IMPLEMENTATION_SUMMARY.md)

---

## 🤝 贡献文档

欢迎贡献文档！请遵循以下准则：

1. **选择合适的目录**
   - 设计文档 → `docs/design/`
   - 发布说明 → `docs/releases/`

2. **使用清晰的文件名**
   - 设计文档：`FEATURE_NAME_DESIGN.md`
   - 发布说明：`RELEASE_NOTES_vX.X.X.md`

3. **遵循模板**
   - 使用上述提供的文档模板
   - 保持结构清晰

4. **添加到索引**
   - 更新本 README.md
   - 在相应章节添加链接

5. **提交规范**
   ```bash
   git add docs/
   git commit -m "docs: add [文档名称]"
   ```

---

## 📚 相关资源

### 项目文档
- [项目 README](../README.md) - 项目介绍和快速开始
- [QUICK_START_GUIDE.md](../QUICK_START_GUIDE.md) - 快速上手指南

### 外部资源
- [React 文档](https://react.dev/)
- [Rust 语言圣经](https://course.rs/)
- [Markdown 指南](https://www.markdownguide.org/)

---

## 📞 联系方式

如有文档相关问题，请联系：

- **GitHub Issues**: https://github.com/loong-ai/website/issues
- **Email**: [your-email@example.com]

---

**最后更新**: 2026-03-10
**维护者**: Sunfei
