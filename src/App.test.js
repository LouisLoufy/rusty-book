import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./utils/lazyWithMinLoadTime', () => ({
  lazyWithMinLoadTime: (importFunc) => importFunc()
}));

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn((input) => {
    const url = String(input);

    if (url.endsWith('/docs/_meta.json')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          title: 'BeatAI Documentation',
          books: [
            {
              id: 'ai-insights',
              title: 'AI每日视点',
              description: 'AI 领域最新动态、技术分享与深度解析',
              metaFile: '/docs/ai-insights/_meta.json'
            },
            {
              id: 'rust-course',
              title: 'Rust语言圣经',
              description: 'Rust 编程语言完整学习指南',
              metaFile: '/docs/rust-course/_meta.json'
            }
          ]
        })
      });
    }

    if (url.endsWith('/docs/ai-insights/_meta.json')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'ai-insights',
          title: 'AI每日视点',
          description: 'AI 领域最新动态、技术分享与深度解析',
          sections: []
        })
      });
    }

    if (url.endsWith('/docs/rust-course/_meta.json')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'rust-course',
          title: 'Rust语言圣经',
          description: 'Rust 编程语言完整学习指南',
          sections: []
        })
      });
    }

    return Promise.reject(new Error(`Unhandled fetch in test: ${url}`));
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});

test('renders square page entry content', async () => {
  render(<App />);
  expect(await screen.findByText('探索内容')).toBeInTheDocument();
});
