import assetsRepos from '../config/assetsRepos.json';
import assetsPin from '../config/assetsPin.json';

const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh';
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)(\?.*)?$/i;

// All routable assets live under /docs/; a route's `match` only selects which
// repo a given path goes to. The subpath inside every repo is always the
// pathname with this root stripped, so all repos mirror the source structure.
const ASSETS_ROOT = '/docs/';

function extractPathname(input) {
  if (typeof input !== 'string' || !input) return null;
  try {
    return new URL(input, 'https://_local_').pathname;
  } catch {
    return null;
  }
}

function stripPublicBase(pathname) {
  const publicBase = process.env.PUBLIC_URL || '';
  if (publicBase && pathname.startsWith(publicBase)) {
    return pathname.slice(publicBase.length) || '/';
  }
  return pathname;
}

function findRoute(pathname) {
  for (const route of assetsRepos.routes || []) {
    if (route.match && pathname.startsWith(route.match)) {
      return route;
    }
  }
  return null;
}

// Rewrite an in-site image URL/path to its jsDelivr-hosted equivalent on the
// configured assets repo, when a SHA pin is set for that repo. Returns null
// when no rewrite applies (non-image, not under a routed prefix, or SHA unset),
// signalling callers to use the original URL.
export function rewriteContentAssetToCdn(input) {
  const rawPath = extractPathname(input);
  if (!rawPath) return null;

  const pathname = stripPublicBase(rawPath);
  if (!pathname.startsWith(ASSETS_ROOT)) return null;
  if (!IMAGE_EXT_RE.test(pathname)) return null;

  const route = findRoute(pathname);
  if (!route) return null;

  const repo = assetsRepos.repos?.[route.repo];
  const sha = assetsPin?.[route.repo];
  if (!repo || !sha) return null;

  const subpath = pathname.slice(ASSETS_ROOT.length);
  return `${JSDELIVR_BASE}/${repo.owner}/${repo.name}@${sha}/${subpath}`;
}
