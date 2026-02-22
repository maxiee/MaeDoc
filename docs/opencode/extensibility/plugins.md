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

在 `opencode.jsonc` 中配置插件：

```jsonc
{
  "plugins": {
    "enabled": ["my-plugin", "another-plugin"],
    "disabled": ["experimental-*"]
  }
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

*本文档基于 OpenCode 官方文档和社区最佳实践整理，最后更新：2026-02-22*
