# OpenCode Plugins 扩展机制

> **所属系列**：[OpenCode 使用指南](../index.md) → [扩展能力](./index.md)
> **最后更新**：2026-02-22

---

## 概述

Plugins 是 OpenCode 最底层的扩展机制，允许你在**事件总线**与**工具调用**前后挂钩并改写行为。

```
事件总线 ──► Plugin Hook (before) ──► 原始处理 ──► Plugin Hook (after) ──► 响应
```

**适用场景**：
- 在 LLM 调用前后注入/修改上下文
- 拦截和改写工具调用结果
- 实现审计日志、行为监控
- 自定义安全策略拦截

---

## 插件目录结构

```
.opencode/
├── plugins/
│   ├── my-plugin/
│   │   ├── PLUGIN.md        # 插件元数据（必需）
│   │   └── index.ts         # 插件实现（或 index.js）
│   └── another-plugin/
│       └── PLUGIN.md
└── opencode.jsonc           # 全局配置
```

---

## PLUGIN.md 规范

```yaml
---
name: my-plugin
version: 1.0.0
description: 在 LLM 调用前注入系统提示
hooks:
  - before:llm
  - after:tool
---
```

**字段说明**：

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `name` | ✓ | 插件名称（kebab-case） |
| `version` | ✓ | 语义化版本号 |
| `description` | ✓ | 功能描述 |
| `hooks` | ✓ | 监听的事件列表 |

---

## 支持的 Hook 点

| Hook | 触发时机 | 常见用途 |
|------|---------|---------|
| `before:llm` | LLM 调用前 | 注入系统提示、修改消息 |
| `after:llm` | LLM 调用后 | 日志记录、结果缓存 |
| `before:tool` | 工具执行前 | 权限检查、参数校验 |
| `after:tool` | 工具执行后 | 结果改写、错误处理 |
| `on:session:start` | 会话开始 | 初始化状态 |
| `on:session:end` | 会话结束 | 清理资源、导出日志 |

---

## 插件实现示例

### TypeScript 实现

```typescript
// .opencode/plugins/context-injector/index.ts

export default {
  name: 'context-injector',
  
  // before:llm hook
  async beforeLLM(context) {
    // 在消息列表头部注入系统提示
    context.messages.unshift({
      role: 'system',
      content: '当前工作目录: ' + process.cwd()
    });
    
    return context; // 必须返回 context
  },
  
  // after:tool hook
  async afterTool(result, context) {
    // 记录工具调用日志
    console.log(`[Tool] ${context.toolName} -> ${result.status}`);
    return result;
  }
};
```

### 修改 LLM 消息

```typescript
export default {
  name: 'prompt-enhancer',
  
  async beforeLLM(context) {
    const lastMessage = context.messages[context.messages.length - 1];
    
    if (lastMessage.role === 'user') {
      // 自动添加格式化要求
      lastMessage.content += '\n\n请使用 Markdown 格式回复。';
    }
    
    return context;
  }
};
```

---

## 配置与启用

在 `opencode.jsonc` 中配置插件（顶层字段为 `plugin`）：

```jsonc
{
  "plugin": [
    "my-plugin",
    "another-plugin"
  ]
}
```

### 权限控制

```jsonc
{
  "permission": {
    "plugin": {
      "*": "ask",           // 默认询问
      "my-plugin": "allow", // 白名单
      "internal-*": "deny"  // 黑名单
    }
  }
}
```

---

## 高质量社区插件参考

| 插件 | 功能 | 学习要点 |
|------|------|---------|
| **PTY** | 伪终端增强 | 如何在 `after:tool` 中改写 Bash 执行结果 |
| **上下文裁剪** | 自动压缩长上下文 | `before:llm` 中实现 token 计数与裁剪 |
| **记忆** | 跨会话记忆管理 | `on:session:end` 中持久化状态 |

---

## 实战案例：自动 Lint 检查

> **来源**：[The definitive guide to OpenCode](https://reading.sh/the-definitive-guide-to-opencode-from-first-install-to-production-workflows-aae1e95855fb)

以下是一个生产级插件示例：在 Agent 完成编辑后自动运行 Biome lint，并将错误反馈给 Agent 自动修复。

### 插件实现

```typescript
// .opencode/plugins/post-turn-check.ts
import { promises as fs } from "node:fs";
import type { Plugin } from "@opencode-ai/plugin";

let hasEdited = false;
const cooldownMs = 15_000;
let lastRunAt = 0;

export const PostTurnCheck: Plugin = async ({ client, $ }) => {
  return {
    // 追踪编辑操作
    "tool.execute.after": async (input) => {
      const editTools = ["write", "edit", "replace_content", "create_text_file"];
      if (editTools.includes(input.tool)) {
        hasEdited = true;
      }
    },

    // Agent 完成回合后检查
    event: async ({ event }) => {
      if (event.type !== "session.idle") return;
      if (!hasEdited) return;

      const now = Date.now();
      if (now - lastRunAt < cooldownMs) return;

      lastRunAt = now;
      hasEdited = false;

      // 运行 Biome 并捕获输出
      const outputFile = `/tmp/opencode-check-${Date.now()}.log`;
      await $`sh -c ${"pnpm run check > " + outputFile + " 2>&1 || true"}`;

      const output = await fs.readFile(outputFile, "utf8").catch(() => "");
      const message = `
Post-turn lint check completed.

--- BEGIN BIOME OUTPUT ---
${output || "No issues found."}
--- END BIOME OUTPUT ---

If there are errors, fix them. If something's unclear, ask.
`.trim();

      // 将结果发回给 Agent
      const sessionID = event.properties.sessionID;
      if (sessionID) {
        await client.session.prompt({
          path: { id: sessionID },
          body: {
            parts: [{ type: "text", text: message }],
          },
        });
      }
    },
  };
};
```

### 添加依赖

在 `.opencode/package.json` 中添加：

```json
{
  "dependencies": {
    "@opencode-ai/plugin": "^1.1.13"
  }
}
```

OpenCode 启动时会自动安装依赖。

### 工作原理

| 机制 | 说明 |
|------|------|
| **编辑追踪** | 监听 `tool.execute.after`，Agent 使用编辑工具时设置标记 |
| **冷却时间** | 15 秒冷却，避免 Agent 快速连续编辑时频繁检查 |
| **结果反馈** | `client.session.prompt()` 像用户输入一样发送消息给 Agent |
| **自动修复** | Agent 看到 lint 错误后会自动尝试修复 |

### 扩展：其他自动化场景

同样的模式可用于：

| 场景 | 命令 |
|------|------|
| **类型检查** | `tsc --noEmit` |
| **测试运行** | `npm test -- --related` |
| **安全扫描** | `npm audit` |
| **自定义验证** | 任何输出错误到 stdout/stderr 的 CLI 工具 |

---

## 注意事项

1. **性能影响**：每个 Hook 都会增加请求延迟，避免耗时操作
2. **错误处理**：插件抛出异常不会中断主流程，但会记录日志
3. **执行顺序**：多个插件的 Hook 按配置顺序执行
4. **安全边界**：插件运行在 Node.js 环境，可访问文件系统，需谨慎启用

---

## 相关文档

- [Custom Tools 自定义工具](./custom-tools.md) — 定义 LLM 可调用的函数
- [MCP Servers](./mcp-servers.md) — 接入外部工具集
- [安全边界](./security-boundary.md) — 扩展开发的安全考量

---

*本文档基于 OpenCode 官方文档、社区最佳实践和《The definitive guide to OpenCode》整理，最后更新：2026-02-22*
