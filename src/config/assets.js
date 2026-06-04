// 资产图片的 CDN 配置。
//
// 站内所有图片（正文图 + 封面）在 markdown / _meta.json 里都以绝对 jsDelivr URL
// 存储（cdn.jsdelivr.net/gh/beatai-org/beatai-assets@<sha>/...），这是耐久的真相源。
//
// 但部分广告/隐私拦截器（uBlock / AdGuard / Brave Shields 等）会拦截页面发往
// cdn.jsdelivr.net 的第三方子资源请求，导致图片在站内不显示（单独打开链接却正常）。
// pic.gitlab.cx 是 jsDelivr 的 1:1 反向代理镜像（路径完全一致），换成自有域名即可绕开。
//
// 这里只配置 host；运行时改写在 src/utils/markdown.js 的 resolveContentAssetUrl 收口完成，
// 不改动存储数据。万一代理失效，把 ASSET_PROXY_ORIGIN 改回 ASSET_CDN_ORIGIN 即可回滚。
export const ASSET_CDN_ORIGIN = 'https://cdn.jsdelivr.net';
export const ASSET_PROXY_ORIGIN = 'https://pic.gitlab.cx';
