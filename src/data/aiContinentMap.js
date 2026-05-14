export const AI_CONTINENT_WORLD = {
  width: 1200,
  height: 760
};

export const AI_CONTINENT_INITIAL_COMPLETED_NODE_IDS = ['math', 'python'];

export const AI_CONTINENT_NODE_MAP = {
  math: {
    id: 'math',
    title: '数学基础港',
    subtitle: '线代 / 概率 / 微积分',
    zone: '新手海岸',
    difficulty: 1,
    duration: '2-4 周',
    x: 28,
    y: 74
  },
  python: {
    id: 'python',
    title: 'Python 工坊',
    subtitle: '语法 / 数据处理 / 工程习惯',
    zone: '新手海岸',
    difficulty: 1,
    duration: '1-2 周',
    x: 43,
    y: 80
  },
  data: {
    id: 'data',
    title: '数据营地',
    subtitle: '特征工程 / 数据质量',
    zone: '风暴平原',
    difficulty: 2,
    duration: '2 周',
    x: 30,
    y: 61
  },
  ml: {
    id: 'ml',
    title: '机器学习峡谷',
    subtitle: '回归 / 分类 / 评估',
    zone: '风暴平原',
    difficulty: 2,
    duration: '2-3 周',
    x: 47,
    y: 55
  },
  dl: {
    id: 'dl',
    title: '深度学习火山',
    subtitle: 'CNN / RNN / Transformer 基础',
    zone: '熔岩高地',
    difficulty: 3,
    duration: '3-4 周',
    x: 53,
    y: 43
  },
  llm: {
    id: 'llm',
    title: 'LLM 城',
    subtitle: 'Prompt / RAG / 对齐',
    zone: '星陨城邦',
    difficulty: 3,
    duration: '2-4 周',
    x: 67,
    y: 38
  },
  agent: {
    id: 'agent',
    title: 'Agent 要塞',
    subtitle: 'Tool Use / Planner / Workflows',
    zone: '星陨城邦',
    difficulty: 4,
    duration: '2-3 周',
    x: 66,
    y: 58
  },
  eval: {
    id: 'eval',
    title: '评测塔',
    subtitle: '离线评测 / 在线观测 / A/B',
    zone: '观测群岛',
    difficulty: 4,
    duration: '2 周',
    x: 55,
    y: 70
  }
};

export const AI_CONTINENT_NODES = Object.values(AI_CONTINENT_NODE_MAP);

export const AI_CONTINENT_NODE_ORDER = ['math', 'python', 'data', 'ml', 'dl', 'llm', 'agent', 'eval'];

export const AI_CONTINENT_CONTINENT = {
  topPath: 'M140 445 C126 285 265 158 450 122 C618 89 800 122 943 221 C1065 306 1100 471 994 604 C905 715 716 742 512 708 C335 679 165 603 140 445 Z',
  sidePath: 'M140 492 C126 332 265 205 450 169 C618 136 800 169 943 268 C1065 353 1100 518 994 651 C905 762 716 789 512 755 C335 726 165 650 140 492 L140 560 C168 718 325 774 510 744 C725 778 914 751 1014 644 C1128 520 1093 343 968 252 C820 152 622 118 445 151 C248 187 119 330 128 500 Z',
  rimPath: 'M159 432 C162 298 282 184 450 151 C602 121 779 152 905 239 C1016 313 1052 451 978 565 C886 686 713 717 529 688 C360 662 192 591 159 432 Z'
};

export const AI_CONTINENT_REGIONS = [
  {
    id: 'novice-coast',
    name: '新手海岸',
    label: { x: 266, y: 562, width: 112 },
    fillId: 'meadowTexture',
    elevation: 'coast',
    path: 'M166 504 C192 541 238 563 292 571 C338 577 388 600 410 639 C359 676 263 670 193 623 C165 587 155 551 166 504 Z'
  },
  {
    id: 'storm-plains',
    name: '风暴平原',
    label: { x: 487, y: 520, width: 118 },
    fillId: 'grassTexture',
    elevation: 'mid',
    path: 'M307 512 C336 421 429 365 527 356 C594 359 646 387 683 439 C653 548 568 632 450 650 C384 623 334 579 307 512 Z'
  },
  {
    id: 'lava-highlands',
    name: '熔岩高地',
    label: { x: 620, y: 281, width: 120 },
    fillId: 'basaltTexture',
    elevation: 'high',
    path: 'M405 328 C462 222 597 161 735 188 C725 282 672 354 574 394 C512 394 454 372 405 328 Z'
  },
  {
    id: 'starfall-citadel',
    name: '星陨城邦',
    label: { x: 881, y: 338, width: 120 },
    fillId: 'cityTexture',
    elevation: 'plateau',
    path: 'M736 243 C808 210 906 220 994 291 C1016 361 994 446 935 508 C860 501 785 475 736 414 C721 356 719 292 736 243 Z'
  },
  {
    id: 'watcher-shore',
    name: '观测群岛',
    label: { x: 848, y: 603, width: 120 },
    fillId: 'sandTexture',
    elevation: 'coast',
    path: 'M734 520 C790 488 863 486 928 520 C949 580 931 636 893 666 C829 668 774 650 735 610 C723 578 724 546 734 520 Z'
  }
];

export const AI_CONTINENT_ROUTE_MAP = [
  {
    id: 'math-ml',
    from: 'math',
    to: 'ml',
    kind: 'road',
    path: 'M 28 74 C 34 67 39 61 47 55'
  },
  {
    id: 'python-ml',
    from: 'python',
    to: 'ml',
    kind: 'road',
    path: 'M 43 80 C 44 72 45 63 47 55'
  },
  {
    id: 'python-data',
    from: 'python',
    to: 'data',
    kind: 'road',
    path: 'M 43 80 C 39 72 34 67 30 61'
  },
  {
    id: 'data-ml',
    from: 'data',
    to: 'ml',
    kind: 'road',
    path: 'M 30 61 C 35 58 41 56 47 55'
  },
  {
    id: 'ml-dl',
    from: 'ml',
    to: 'dl',
    kind: 'ridge',
    path: 'M 47 55 C 49 51 51 47 53 43'
  },
  {
    id: 'dl-llm',
    from: 'dl',
    to: 'llm',
    kind: 'ridge',
    path: 'M 53 43 C 58 40 62 38 67 38'
  },
  {
    id: 'llm-agent',
    from: 'llm',
    to: 'agent',
    kind: 'road',
    path: 'M 67 38 C 69 45 68 51 66 58'
  },
  {
    id: 'llm-eval',
    from: 'llm',
    to: 'eval',
    kind: 'sea',
    path: 'M 67 38 C 67 51 63 61 55 70'
  },
  {
    id: 'agent-eval',
    from: 'agent',
    to: 'eval',
    kind: 'sea',
    path: 'M 66 58 C 64 63 61 67 55 70'
  }
];

export const AI_CONTINENT_SCENE = {
  currents: [
    'M44 130 C186 96 364 112 501 151 C656 194 820 196 970 164 C1084 141 1142 150 1200 178',
    'M0 575 C148 525 330 545 470 593 C598 634 718 637 845 612 C990 584 1106 596 1200 630'
  ],
  cloudShadows: [
    { cx: 312, cy: 210, rx: 144, ry: 48, rotate: -8, opacity: 0.08 },
    { cx: 804, cy: 182, rx: 162, ry: 44, rotate: 4, opacity: 0.09 },
    { cx: 618, cy: 552, rx: 182, ry: 58, rotate: 12, opacity: 0.06 }
  ],
  mistBands: [
    { cx: 528, cy: 404, rx: 196, ry: 44, rotate: -10, opacity: 0.22 },
    { cx: 842, cy: 548, rx: 180, ry: 38, rotate: -6, opacity: 0.19 }
  ],
  coastline: [
    'M178 511 C225 529 282 534 328 558',
    'M761 607 C818 624 879 624 927 602'
  ],
  mountainChains: [
    { x: 486, y: 298, width: 118, height: 140 },
    { x: 586, y: 322, width: 126, height: 156 },
    { x: 676, y: 336, width: 134, height: 144 }
  ],
  forestClusters: [
    {
      circles: [
        { x: 252, y: 366, r: 34 },
        { x: 286, y: 348, r: 27 },
        { x: 319, y: 372, r: 25 },
        { x: 289, y: 395, r: 32 }
      ]
    },
    {
      circles: [
        { x: 734, y: 554, r: 28 },
        { x: 776, y: 545, r: 24 },
        { x: 804, y: 575, r: 30 }
      ]
    }
  ],
  canyon: {
    outer: { cx: 494, cy: 463, rx: 132, ry: 82 },
    inner: { cx: 494, cy: 463, rx: 94, ry: 58 }
  },
  volcano: {
    basePath: 'M546 330 L628 188 L706 334 Z',
    capPath: 'M584 287 C598 268 616 268 632 287 C622 301 595 302 584 287 Z',
    lavaPath: 'M609 288 C613 320 620 353 629 390'
  },
  cave: {
    shellPath: 'M812 557 C852 513 912 511 949 550 C931 595 864 607 812 584 Z',
    hole: { cx: 882, cy: 559, rx: 52, ry: 29 },
    glow: { cx: 884, cy: 558, rx: 26, ry: 14 }
  },
  castle: {
    base: { x: 864, y: 256, width: 96, height: 74 },
    towers: [
      { x: 842, y: 238, width: 28, height: 96 },
      { x: 956, y: 238, width: 28, height: 96 }
    ],
    roofs: [
      '842,238 856,212 870,238',
      '956,238 970,212 984,238',
      '894,256 912,222 930,256'
    ],
    gate: { x: 901, y: 292, width: 22, height: 39 }
  },
  harbor: {
    pierPath: 'M190 575 C222 579 248 588 270 600',
    beacon: { x: 226, y: 563 }
  },
  regionLabels: [
    { x: 248, y: 563, text: '新手海岸', width: 114 },
    { x: 488, y: 521, text: '风暴平原', width: 116 },
    { x: 620, y: 280, text: '熔岩高地', width: 118 },
    { x: 880, y: 338, text: '星陨城邦', width: 118 },
    { x: 850, y: 602, text: '观测群岛', width: 118 }
  ],
  atmosphere: [
    { x: 18, y: 18, width: 28, height: 10, opacity: 0.24, tone: 'cool' },
    { x: 58, y: 12, width: 24, height: 9, opacity: 0.22, tone: 'warm' },
    { x: 62, y: 68, width: 32, height: 11, opacity: 0.2, tone: 'cool' }
  ]
};

export function getPrerequisites(nodeId) {
  return AI_CONTINENT_ROUTE_MAP
    .filter((route) => route.to === nodeId)
    .map((route) => route.from);
}

export function getDifficultyLabel(level) {
  if (level <= 1) {
    return '入门';
  }
  if (level === 2) {
    return '进阶';
  }
  if (level === 3) {
    return '高阶';
  }
  return '专家';
}

export function getRecommendedPath(completedSet) {
  return AI_CONTINENT_NODE_ORDER
    .map((id) => AI_CONTINENT_NODE_MAP[id])
    .filter(Boolean)
    .filter((node) => !completedSet.has(node.id));
}

export function buildStatusByNodeId(completedSet) {
  const map = {};
  AI_CONTINENT_NODES.forEach((node) => {
    if (completedSet.has(node.id)) {
      map[node.id] = 'done';
      return;
    }

    const ready = getPrerequisites(node.id).every((id) => completedSet.has(id));
    map[node.id] = ready ? 'ready' : 'locked';
  });
  return map;
}

export function findAncestorChain(targetId) {
  const chain = new Set();
  const stack = [targetId];

  while (stack.length > 0) {
    const current = stack.pop();
    getPrerequisites(current).forEach((id) => {
      if (!chain.has(id)) {
        chain.add(id);
        stack.push(id);
      }
    });
  }

  return chain;
}
