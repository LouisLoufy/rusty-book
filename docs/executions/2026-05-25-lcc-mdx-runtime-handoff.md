# 2026-05-25：LCC widget 渲染管线 → MDX 运行时 迁移交接

> 这份文档把当前对话搞完的工作和下一步要做的 MDX 迁移交接给新会话。**新对话只要读这一份就能直接接着干，不需要回看上一份 `2026-05-25-books-collections-unification-and-lcc-mdx-prep.md`**（那份只是这一轮的起点，已经实施完）。

## 0. 当前对话干完了什么（high-level）

把 LCC 从「老 LearnClaudeCode → VersionPage 管线 + JS data 模块」收敛成「`MarkdownBookContent` 单一管线 + `<doc-tabs>` 容器 + `<doc-component name="X" />` 嵌入」的统一形态。LCC 跟其他书的渲染路径**完全对称**。

但落地过程发现现有 markdown 嵌入栈的几个**底层痛点不可消除**（详见 §3），最终决定：**下一步迁移到 MDX 运行时**。

仓库 main 分支现在的相关 commit：

| Commit | 含义 |
|---|---|
| `aadb35e` | feat: LCC 收敛到 MarkdownBookContent 管线（+ DocTabs/DocTab + doc-component widget 注册 + 13 个 .md 改造） |
| `c485662` | refactor: 删旧 LCC 渲染管线（LearnClaudeCode.js / VersionPage.js / sidebarConfig.js 等） |
| `0992628` | [被 revert] refactor: 把 doc-tabs/doc-tab 折叠进 doc-component dispatcher（统一企图） |
| `e9c4707` | Revert 0992628（保留两路注册：容器型直接注册 + 叶子用 dispatcher） |

`e9c4707` 跟 `0992628` 内容相互抵消。**实际有效状态等价于 `c485662`**。

---

## 1. 当前架构（**必读** —— 新对话直接读这一节就能上手）

### 1.1 渲染管线（URL → DOM）

```
URL → App.js BOOKS.map Route
  → BookPage (无条件分发，所有书都走 markdown 管线)
  → MarkdownBookContent (拉 _meta.json + 路由校验 + DocsLayout 套外壳)
    → DocsLayout (sidebar + workspace)
    → <Routes><Route path="*" element={<DocContent />} /></Routes>
      → DocContent
        ├ useDocArticleModel (fetch .md → 解析 frontmatter → normalize)
        └ DocMarkdownRenderer (react-markdown)
          └ remark-parse → remark-rehype → rehype-raw → rehype-sanitize → components map
```

### 1.2 组件注册的两条路（**关键**）

#### A. 直接注册（`src/components/docs/markdownRenderers.js` 的 `createDocMarkdownComponents`）

```js
'doc-tabs': DocTabs,         // 容器，必须直接注册
'doc-tab': DocTab,           // 容器内标记
'doc-component'({...}) {...},  // wrapper dispatcher（见 B）
```

直接注册的组件，react-markdown 会**递归对嵌套元素也应用 map**。所以 `<doc-tab>` 嵌套在 `<doc-tabs>` 里时，DocTab 元素能被 DocTabs 用 `child.type === DocTab` 识别到。

#### B. Dispatcher（`src/components/docs/markdownEmbeds/registry.js`）

```js
export const DOC_COMPONENT_REGISTRY = {
  'scene-sequence': SceneSequenceDocEmbed,
  component: RegisteredDocComponentEmbed,
  'agent-loop-simulator': AgentLoopSimulator,
  'source-viewer': SourceViewer,
  'deep-dive': DeepDive,
  'session-visualization': SessionVisualization
};
```

作者 markdown 写 `<doc-component name="X" foo="bar" />`，dispatcher 按 name 查找渲染。**只能用于叶子组件**（不持子内容、不被父组件识别）。

#### 为什么这是两路而不是一路

react-markdown 行为：
- map entry 是**直接组件引用**（`'tag': Component`）→ 递归处理嵌套
- map entry 是 **wrapper 函数**（`'tag': (props) => <X/>`）→ 只在顶层应用，嵌套 fall back 到 intrinsic

`<doc-component name="X">` 本质需要按 name 分发 → 必然是 wrapper → 嵌套场景下不工作 → 容器型必须用独立 tag 名直接注册。

### 1.3 LCC .md 文件结构（示例 `public/docs/llc-content/zh/s01.md`）

```md
# s01: The Agent Loop (智能体循环)

*Bash is All You Need*

> The minimal agent kernel is a while loop + one tool

<doc-component name="session-visualization" version="s01" />

<doc-tabs>

<doc-tab label="学习">

正文 markdown，**完整支持** H2 / 代码块 / 链接 / blockquote / 嵌套 <doc-component />

</doc-tab>

<doc-tab label="模拟">

<doc-component name="agent-loop-simulator" version="s01" />

</doc-tab>

<doc-tab label="源码">

<doc-component name="source-viewer" version="s01" />

</doc-tab>

<doc-tab label="深入探索">

<doc-component name="deep-dive" version="s01" />

</doc-tab>

</doc-tabs>
```

**注意每对 `<doc-tab>` / `</doc-tab>` 前后都必须有空行** —— CommonMark §4.6 type-7 HTML 块规则要求。

### 1.4 关键文件

```
src/
├── App.js                                       路由（每本书一条）
├── content/books.js                             书注册表，无 contentKind 字段
├── pages/
│   ├── BookPage.js                              单一分发到 MarkdownBookContent
│   └── MarkdownBookContent.js                   外壳：_meta.json + DocsLayout
└── components/
    ├── docs/
    │   ├── DocContent.js                        文章主区（无 LCC 私货）
    │   ├── DocsLayout.js                        sidebar + workspace
    │   ├── DocMarkdownRenderer.js               react-markdown 包装
    │   ├── markdownRenderers.js                 ★ sanitizeSchema + components map
    │   ├── DocTabs.js                           ★ DocTabs + DocTab（直接注册）
    │   ├── NotFoundState.js                     in-book 404
    │   ├── useDocArticleModel.js                数据装配
    │   └── markdownEmbeds/
    │       ├── registry.js                      ★ DOC_COMPONENT_REGISTRY + LearnClaudeCode.css import
    │       └── DocMarkdownComponent.js          ★ <doc-component> dispatcher
    └── learnClaudeCode/
        ├── AgentLoopSimulator.js                LCC widget
        ├── SourceViewer.js                      LCC widget（接 version prop 自查）
        ├── DeepDive.js                          LCC widget（合 ExecutionFlow + DesignDecisions）
        ├── ExecutionFlow.js                     DeepDive 内部
        ├── DesignDecisions.js                   DeepDive 内部
        └── lcc-styles.css                       ★ LCC widget 样式（由 registry import）

src/vendor/learn-claude-code/
├── data.js                                      LCC 数据 barrel（ANNOTATIONS/SCENARIOS/EXECUTION_FLOWS/versionsData/zhMessages）
├── data/{annotations,scenarios,generated}/      JSON 数据
├── visualizations/                              12 个 .tsx 可视化 + index + hooks
└── i18n/zh.json                                 中文 labels

public/docs/llc-content/
├── _meta.json                                   LCC 的 TOC（7 个 section + 14 个 leaf）
└── zh/{preface,s01..s12,bp01}.md                14 个 markdown 文件
```

### 1.5 测试验证

- `cd /Users/sunfei/development/beatai && CI=true npm test -- --watchAll=false`：42/42 应通过
- `(BROWSER=none PORT=3456 npm start &) > /dev/null 2>&1; until curl -sf http://localhost:3456 >/dev/null; do sleep 2; done`
- §1.6 烟测（同上一份交接的 §1.6 那条命令，14 个 LCC URL 包括在内）
- 跑完：`lsof -ti:3456 | xargs -r kill`

---

## 2. 现架构的硬伤（**为什么要迁 MDX**）

| 痛点 | 来源 | 现在怎么 hack 绕的 |
|---|---|---|
| 自定义 tag 前后必须空行 | CommonMark §4.6 type-7 HTML 块规则 | 作者+脚本严格控制空行 |
| `<X />` 自闭合得 normalize | parse5 不认 custom element 的 XHTML 自闭合 | `normalizeDocComponentMarkdown` 把 `<X .../>` 改写成 `<X ...>\n</X>` |
| 属性被 sanitize 加 `user-content-` 前缀 | rehype-sanitize clobberPrefix | `normalizeComponentName` 显式 strip 前缀 |
| 「容器 vs 叶子」两套注册 | react-markdown 对 wrapper map entry 不递归 | §1.2 的双路设计 |
| Tab body 里 markdown 是否被重新解析靠空行经验 | 上面所有问题叠加 | 文档 + 作者直觉 |

**每条都是底层工具的天然行为**，靠 hack 绕过。长期不可维护，给作者写 `.md` 的体验也差。

---

## 3. 下一步任务：MDX 运行时迁移（**Path A**）

### 3.1 目标

加 `@mdx-js/mdx` 运行时编译。文件**按扩展名分发**：

- `.md` → 走现有 `DocMarkdownRenderer`（react-markdown 管线）
- `.mdx` → 走新 `MdxRenderer`（MDX 编译 → React）

LCC 13 个 .md（preface + s01..s12 + bp01）改成 `.mdx`，语法换成 JSX；其他书（ai-insights / rust-course / deep-learning / agent-harness / elon-book）**一个字符不动**。

### 3.2 MDX 之后 LCC .mdx 写法（示例 `s01.mdx`）

```mdx
---
subtitle: "Bash is All You Need"
keyInsight: "The minimal agent kernel is a while loop + one tool"
---

# S01 Agent 循环

<SessionVisualization version="s01" />

<Tabs>
  <Tab label="学习">
## 实际学习内容
**粗体**、`code`、列表全部正常 markdown
    
代码块也正常：

\`\`\`python
def agent_loop():
    pass
\`\`\`
  </Tab>
  <Tab label="模拟">
    <AgentLoopSimulator version="s01" />
  </Tab>
  <Tab label="源码">
    <SourceViewer version="s01" />
  </Tab>
  <Tab label="深入探索">
    <DeepDive version="s01" />
  </Tab>
</Tabs>
```

注意：
- ✅ JSX 是一等公民，**不再需要空行 ceremony**
- ✅ `<X />` 自闭合原生支持
- ✅ 属性不被 sanitize 重命名
- ✅ 所有组件平等，无「容器/叶子」分歧
- ✅ frontmatter 仍然工作
- ✅ 一个 components scope 注册所有 widget

### 3.3 实施步骤

1. **安装依赖**：`npm install @mdx-js/mdx`（runtime 编译器，~80KB gzip）
2. **新增 `src/components/docs/MdxRenderer.js`**（~30 行）：
   ```js
   import { evaluate } from '@mdx-js/mdx';
   import * as runtime from 'react/jsx-runtime';
   // 异步编译 .mdx 文本 + 缓存 + 渲染
   ```
3. **新增 `src/components/docs/mdxComponentScope.js`**：集中 export 所有 MDX 可用的组件（Tabs / Tab / AgentLoopSimulator / SourceViewer / DeepDive / SessionVisualization），统一传给 `<Content components={...} />`
4. **改 `DocContent.js`**（~5 行）：
   ```js
   const isMdx = docMetaEntry?.item?.file?.endsWith('.mdx');
   {isMdx
     ? <MdxRenderer source={rawDoc} markdownUrl={markdownUrl} />
     : <DocMarkdownRenderer ...>{markdownContent}</DocMarkdownRenderer>}
   ```
5. **重命名 + 改写 13 个 LCC 文件**：写一次性 node 脚本批量转换
    - 文件 `.md` → `.mdx`
    - `<doc-component name="X" version="Y" />` → `<X version="Y" />`（首字母大写 + PascalCase）
    - `<doc-tabs>` → `<Tabs>`，`<doc-tab label="X">` → `<Tab label="X">`
    - 去掉 doc-tab 前后强制空行
    - **重点**：扫一遍正文里是否有未在 code fence 内的 `{` 或 `}`，需要转义成 `\{` `\}` 或包进 `` `code` ``（MDX 把字面 `{` 当 JS 表达式起点）
6. **改 `public/docs/llc-content/_meta.json`**：所有 `file` 字段的 `.md` → `.mdx`（sed）
7. **跑回归**：
    - `CI=true npm test --watchAll=false` 42/42
    - 14 个 LCC URL 全 200 + 浏览器视觉 4-tab 正常
    - 其他书（rust-course / ai-insights）零回归（因为它们还是 .md，走老管线）

### 3.4 第二阶段（LCC 全部迁完后再做）

一旦 LCC 全部 .mdx 化、其他书没有用 `<doc-component>` 的内容（已确认目前没有），可以**删一大堆 hack**：

- `normalizeDocComponentMarkdown`（`src/utils/markdown.js`）
- `DocMarkdownComponent.js` + `markdownEmbeds/registry.js`（如果 .md 不再有 `<doc-component>`）
- `sanitizeSchema` 里 `doc-component / doc-tabs / doc-tab` 三条 tagName + attribute 白名单
- `DocTabs.js`（被 MDX 版的 Tabs 替代）

但**第二阶段先不做**，等 LCC 跑稳定一两周。两套管线并存的「污染」极小（就是 markdownRenderers.js 里多 10 行注册）。

### 3.5 可能踩到的坑

- **`{` / `}` 字面字符**：MDX 把它们当 JS 表达式起点。代码块（fence 内）安全；行内 `{foo}` 会被解释为 `<>{foo}</>`。LCC 的 s01-s12 几乎全是 Python 代码块，**应该没问题**但要 grep 检查 `<doc-tab>` body 里有没有正文 `{...}`：
   ```bash
   grep -E '[^`]\{[^`]*\}[^`]' public/docs/llc-content/zh/*.md
   ```
- **MDX 3 严格 JSX 语法**：行内 `<` 必须是合法 JSX 标签起点或者转义。一般技术文章里不写裸 `<` 当小于号，但要扫一遍。
- **frontmatter 解析器**：MDX 默认不解析 frontmatter，需要加 `remark-frontmatter` + `remark-mdx-frontmatter`（或者沿用当前 `parseMarkdownFrontmatter` 在 MdxRenderer 入口处先 strip frontmatter）。**建议沿用现有 frontmatter 解析器**，传 frontmatter 给 MdxRenderer 作为参数，避免引新依赖。
- **缓存**：MDX 编译有性能开销，应该按 `markdownUrl` 缓存编译产物。`React.lazy` + `Suspense` 是一种做法；或者用 `useMemo` 缓存编译结果。

### 3.6 不要碰

- `src/vendor/learn-claude-code/`（数据 + visualizations，保留原样）
- `src/components/learnClaudeCode/*.js`（LCC widget 本身，作为 React 组件依旧使用）
- 其他书的 `.md` 文件和 `_meta.json`
- `src/content/books.js`（已稳定）

---

## 4. 仓库当前状态

- 分支：`main`，干净（无未提交改动）
- 7 个 commit 比 origin/main 领先（之前 4 个 + 本轮 3 个 + revert 1 个）
- 测试：`CI=true npm test` 42/42 通过
- dev server：本次 session 结束前用了 port 3456，新会话起一个新 server 即可

如果遇到 dev server 端口冲突或者 webpack 卡死，最后兜底：`lsof -ti:3456 | xargs -r kill && (BROWSER=none PORT=3456 npm start &) > /tmp/lcc-mdx-dev.log 2>&1`。

---

## 5. 用户偏好（本次对话观察到的，**重要**）

- **「最抽象统一、简洁清晰」**的设计优先，会主动质疑残留的不对称 —— 本轮的 unification 尝试就是被用户质疑出来的，后来证明工具约束下不能完全统一
- **重构前先 commit 备份**，删代码前要测过
- 大变更前会问「下一步做什么」，希望得到带 ROI 排序的菜单 + 推荐
- 实施期间偏好流水推进，不需要每步问确认，但**完成阶段会要 commit**
- 中文沟通；技术输出要简练、带具体文件路径和行号
- **不要主动 commit，除非用户说 commit**
- 让 dev server 真的跑起来 + curl 烟测每条 URL 是验证标准；**浏览器视觉确认由用户自己做**
- 对底层工具（react-markdown / parse5 / rehype-sanitize）的怪癖**没有耐心** —— 这是要迁 MDX 的根本原因。新对话动手前要再次确认 MDX 路径还是用户想要的

---

## 6. 新对话开场建议

> **已读 2026-05-25 那份 MDX 迁移交接说明。当前 main 分支干净停在 `e9c4707`，下一步是 §3 的 MDX 运行时接入（Path A）。先安装 `@mdx-js/mdx` + 写 `MdxRenderer.js` + 在 `DocContent.js` 按文件扩展名分发；然后写一次性脚本把 LCC 13 个 .md 转 .mdx + 更新 `_meta.json`；最后跑回归。预估 3-4 小时。在动手前请用户最终确认是要走 Path A（runtime）还是 Path B（Vite + 编译期 MDX），以及是否接受 `@mdx-js/mdx` 的 ~80KB gzip 依赖。**
