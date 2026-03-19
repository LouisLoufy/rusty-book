# Markdown 书籍接入

Markdown 书籍现在使用两层元数据：

1. 根索引 [`public/docs/_meta.json`](/Users/sunfei/development/test1/public/docs/_meta.json)
2. 每本书自己的 [`public/docs/<book-id>/_meta.json`](/Users/sunfei/development/test1/public/docs/ai-insights/_meta.json)

## 目录约定

每本 Markdown 书都放在自己的目录下：

```text
public/docs/<book-id>/
  _meta.json
  intro.md
  ...
```

根索引只保留书籍列表和每本书的 `metaFile`，运行时再聚合成统一的 `meta.categories`。

## 新增一本书

推荐使用脚本：

```bash
npm run register-markdown-book -- \
  --id ai-patterns \
  --title "AI Patterns" \
  --description "Agent patterns and field notes"
```

可选参数：

```bash
--github-repo <url>
--repo-title <label>
--section-title <title>
--doc-slug <slug>
--doc-title <title>
--doc-file <filename>
--dry-run
```

脚本会自动：

1. 在根索引注册这本书
2. 创建 `public/docs/<book-id>/_meta.json`
3. 创建一个 starter Markdown 页面

## 后续维护

- 新增章节或文章时，只改对应书籍目录下的 `_meta.json`
- 不再把所有 Markdown 书的元数据堆到根 `_meta.json`
- 页面渲染型书籍不走这套结构
