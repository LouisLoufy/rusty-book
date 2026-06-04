# Chrome 内置翻译能否接入 material-pipeline

**日期**：2026-06-04
**作者**：sunfei + Claude
**状态**：调研完成；结论为**暂不接入，维持 LLM rewrite**（保留可选的「免费初稿」用法）

## 背景与问题

Chrome 工具栏「翻译此页」的体感质量不错。提出疑问：它有没有接口可以调用、能否用进 material-pipeline 的翻译环节，替代或辅助当前的 LLM 翻译。

需要先澄清一个常见混淆：

- **「翻译此页」UI** —— 没有官方对外接口，无法从外部程序调用它。
- 真正可编程的是 Chrome 内置 AI 系列里的 **Translator API**（`window.Translator`），这才是「能调用」的那个。本文评估的就是它。

## 调研结论：Translator API 现状

| 维度 | 实情 |
|---|---|
| 状态 | **Chrome 138+ 已转正稳定**（2025 年中），桌面端 |
| 运行位置 | **设备端（on-device）**，首次使用时下载该语言对模型，不走云 |
| 调用环境 | **只能在浏览器/扩展页面内**（`window.Translator`）；**不是 Node/HTTP 接口，curl 不到**；不支持 Web Worker |
| 平台 | 仅桌面 Chrome；移动端不支持；`create()` 需用户手势激活 |
| 语言 | 40+ 语言对，含 en↔zh |
| 性能 | 顺序处理（前一篇没译完后续阻塞）；长文（如 8 万字 PPO）会慢 |

API 形态：

```js
if ('Translator' in self) { /* 支持 */ }

const ok = await Translator.availability({ sourceLanguage: 'en', targetLanguage: 'zh' });

const translator = await Translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'zh',
  monitor(m){ m.addEventListener('downloadprogress', e => console.log(e.loaded)); }
});

await translator.translate('Hello world');                         // 短文本
for await (const chunk of translator.translateStreaming(longText)) { /* … */ }  // 长文流式
```

## 与 material-pipeline 的契合度

两个硬伤，决定它**替代不了**当前的 LLM rewrite：

1. **它是直译 MT，不是改写。** pipeline 上 rewrite 模式的核心目的就是**消灭翻译腔**（见 translate skill 的「最高规则 ⓪」）。设备端 Translator 干的恰恰是逐句直译，会把翻译腔原样请回来——质量/风格上是降级。
2. **它是浏览器 API，Node 调不到。** 不过 `medium-fetch` 已用 Playwright 驱动真实 Chrome（`channel:'chrome'`），理论上可在抓取后 `page.evaluate(() => Translator.create(...).then(t => t.translate(...)))` 顺手产一版直译稿。坑：`create()` 要用户手势，自动化里需 workaround；且仍是 MT 质量。

## 备选方案（若要服务端可直接调的「谷歌翻译」）

- **官方**：Google Cloud Translation API（`translation.googleapis.com`，REST，需 GCP key + 计费）。Node 可直调，但同样直译 MT，且收费。
- **非官方**：`translate.googleapis.com/translate_a/single?client=gtx...` 免 key 端点——能用但不稳、限流、踩 ToS，**不建议**放进日更管线。

## 结论与建议

- **最终发布稿继续走 LLM rewrite**：这是目前唯一能达到「像中文媒体原创、无翻译腔」的路径，Translator API / Cloud Translation 都达不到。
- **可选的轻量用法**（非必须）：把 Chrome Translator 当作「免费、离线的初译底稿」来源，用于 A/B 对照或低优先级内容快速过稿——可在 `translation-compare` 页里加一栏对照（直译 vs rewrite），直观验证 rewrite 的增量价值。
- 若将来真要做：在 `medium-fetch` 的 Playwright 流程里加一个**可选的 `--draft-mt` 开关**，抓取后调 `window.Translator` 产出 `<slug>.mt.md` 作为参考稿，不进发布主链路。

## 参考来源

- Translator API — Chrome for Developers: https://developer.chrome.com/docs/ai/translator-api
- Translator — MDN: https://developer.mozilla.org/en-US/docs/Web/API/Translator
- Translator API — Chrome Platform Status: https://chromestatus.com/feature/5172811302961152
