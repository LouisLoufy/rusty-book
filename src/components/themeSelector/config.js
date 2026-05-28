export const DEFAULT_THEME_MODE = 'light';
export const THEME_MODE_STORAGE_KEY = 'theme-mode';
export const DEFAULT_THEME_ID = 'kindle-paper';
export const DEFAULT_FONT_SIZE_ID = '18';

export const THEMES = [
  {
    id: 'kindle-paper',
    name: 'Kindle Paper',
    gradient: 'linear-gradient(135deg, #f2f1ed 0%, #d8d7d1 58%, #3a3a37 100%)',
    gradientDark: 'linear-gradient(135deg, #141413 0%, #252522 58%, #d9d7cf 100%)',
    colors: ['#f2f1ed', '#d8d7d1', '#3a3a37']
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    gradient: '#3b82f6',
    gradientDark: '#60a5fa',
    colors: ['#3b82f6'],
    isSolid: true
  },
  {
    id: 'classic-green',
    name: 'Classic Green',
    gradient: '#16a34a',
    gradientDark: '#22c55e',
    colors: ['#16a34a'],
    isSolid: true
  },
  {
    id: 'orange-red',
    name: 'Orange Red',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    gradientDark: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
    colors: ['#f97316', '#ef4444']
  },
  {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
    gradientDark: 'linear-gradient(135deg, #22d3ee 0%, #34d399 100%)',
    colors: ['#06b6d4', '#10b981']
  },
  {
    id: 'sailor-moon',
    name: 'Sailor Moon',
    gradient: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 100%)',
    gradientDark: 'linear-gradient(135deg, #ff69b4 0%, #ffd700 100%)',
    colors: ['#ff69b4', '#ffd700'],
    backgroundImage: '/images/themes/sailor-moon-bg.svg',
    isImageTheme: true
  }
];

export const FONT_SIZES = Array.from({ length: 9 }, (_, index) => {
  const size = 14 + index;

  return {
    id: String(size),
    name: `${size}px`,
    value: `${size}px`
  };
});
