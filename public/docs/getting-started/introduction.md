---
title: Introduction to LoongBot
description: Learn about LoongBot, the open-source AI bot framework that makes building intelligent agents simple and powerful.
---

# Introduction to LoongBot

Welcome to **LoongBot**, the modern open-source framework for building intelligent AI agents. LoongBot combines simplicity with power, allowing developers to create sophisticated bots without the complexity.

## What is LoongBot?

LoongBot is a flexible, plugin-based framework designed for building AI-powered bots that can:

- 🤖 Integrate with multiple AI models (GPT-4, Claude, Gemini, etc.)
- 🔌 Extend functionality through a rich plugin ecosystem
- 💬 Connect to various messaging platforms (WhatsApp, Telegram, Discord, Slack)
- ⚡ Execute tasks with blazing-fast performance
- 🔒 Maintain enterprise-grade security

## Key Features

### Plugin Architecture

LoongBot's plugin system allows you to extend functionality without modifying core code. Write once, use everywhere.

```javascript
import { Plugin } from 'loongbot';

export class MyPlugin extends Plugin {
  name = 'my-awesome-plugin';

  async onMessage(message) {
    // Your logic here
  }
}
```

### AI Model Integration

Seamlessly switch between different AI providers:

```javascript
const bot = new LoongBot({
  ai: {
    provider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY
  }
});
```

### Multi-Platform Support

Deploy your bot across multiple platforms simultaneously:

- WhatsApp Business API
- Telegram Bot API
- Discord
- Slack
- Custom webhooks

## Why Choose LoongBot?

1. **Developer-First**: Intuitive API designed for productivity
2. **Production-Ready**: Battle-tested in real-world applications
3. **Open Source**: MIT licensed, community-driven
4. **TypeScript Support**: Full type safety out of the box
5. **Active Community**: Join thousands of developers building with LoongBot

## Getting Started

Ready to build your first bot? Check out our [Quick Start Guide](/docs/getting-started/quick-start) to get up and running in minutes.

## Community

- [GitHub](https://github.com/loong-ai/loongbot)
- [Discord](https://discord.gg/loongbot)
- [Twitter](https://twitter.com/loongbot)
