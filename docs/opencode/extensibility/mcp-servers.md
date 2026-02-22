# OpenCode MCP Servers 接入

> **所属系列**：[OpenCode 使用指南](../index.md) → [扩展能力](./index.md)
> **最后更新**：2026-02-22

---

## 概述

**MCP（Model Context Protocol）** 是 OpenCode 接入外部工具集的标准协议。通过 MCP，可以将本地或远程的工具服务与 OpenCode 内置工具并列暴露给模型。

```
OpenCode 内置工具 ─┐
                   ├─► 统一工具接口 ─► LLM 调用
MCP Server 工具 ───┘
```

**适用场景**：
- 接入企业内部工具和 API
- 使用社区成熟的 MCP 服务
- 远程工具服务集成
- 跨语言工具实现（Python、Go 等）

---

## MCP 协议简介

MCP 是一个开放协议，定义了：

1. **工具发现** — 列出可用工具及其 Schema
2. **工具调用** — 执行工具并返回结果
3. **资源访问** — 访问外部资源（文件、数据库等）
4. **提示词模板** — 提供可复用的提示词片段

```
┌─────────────┐     MCP Protocol     ┌─────────────┐
│  OpenCode   │ ◄───────────────────► │ MCP Server  │
│   Client    │                      │  (any lang) │
└─────────────┘                      └─────────────┘
```

---

## MCP Server 类型

### 本地 MCP Server

通过 stdio 通信，运行在本地进程：

```jsonc
// opencode.jsonc
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/path/to/allowed"]
    }
  }
}
```

### 远程 MCP Server

通过 HTTP/SSE 通信：

```jsonc
{
  "mcpServers": {
    "remote-api": {
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

---

## 配置 MCP Server

### 基础配置

```jsonc
// opencode.jsonc
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost/mydb"
      }
    }
  }
}
```

### 环境变量注入

```jsonc
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./mcp-servers/my-server/index.js"],
      "env": {
        "API_KEY": "${MY_API_KEY}",
        "DEBUG": "true"
      }
    }
  }
}
```

---

## 社区 MCP Server 推荐

| Server | 功能 | 安装 |
|--------|------|------|
| **filesystem** | 文件系统操作 | `@anthropic/mcp-server-filesystem` |
| **github** | GitHub API 集成 | `@anthropic/mcp-server-github` |
| **postgres** | PostgreSQL 数据库 | `@anthropic/mcp-server-postgres` |
| **slack** | Slack 消息发送 | `@anthropic/mcp-server-slack` |
| **web-search** | 网页搜索 | 社区实现 |

---

## 自定义 MCP Server

### Node.js 实现

```typescript
// mcp-servers/my-server/index.ts
import { Server } from '@anthropic/mcp';

const server = new Server({
  name: 'my-server',
  version: '1.0.0'
});

// 定义工具
server.tool('echo', {
  description: '返回输入的消息',
  parameters: {
    type: 'object',
    properties: {
      message: { type: 'string' }
    },
    required: ['message']
  }
}, async (params) => {
  return {
    content: [{ type: 'text', text: `Echo: ${params.message}` }]
  };
});

// 定义资源
server.resource('config', 'config://settings', async () => {
  return {
    contents: [{
      uri: 'config://settings',
      text: JSON.stringify({ theme: 'dark' })
    }]
  };
});

server.start();
```

### Python 实现

```python
# mcp-servers/my-server/main.py
from mcp import Server

server = Server("my-server")

@server.tool("calculate")
async def calculate(expression: str) -> str:
    """安全地计算数学表达式"""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:
        return f"Error: {e}"

server.run()
```

---

## MCP Server 权限控制

```jsonc
{
  "permission": {
    "mcp": {
      "*": "ask",
      "github": "allow",
      "postgres": "ask"
    }
  }
}
```

### 工具级权限

```jsonc
{
  "permission": {
    "mcp": {
      "github": {
        "create_issue": "allow",
        "delete_repo": "deny"
      }
    }
  }
}
```

---

## 调试 MCP Server

### 查看可用工具

在 OpenCode 中输入：

```
列出所有可用的 MCP 工具
```

### 测试工具调用

```
使用 github search_repositories 工具搜索 "mcp server"
```

### 日志查看

```bash
# 启用 MCP 调试日志
OPENCODE_DEBUG=mcp opencode
```

---

## 最佳实践

1. **最小权限原则**：只授予必要的 MCP 工具权限
2. **使用环境变量**：敏感信息通过环境变量传递
3. **限制文件访问**：filesystem MCP 应限定允许访问的目录
4. **远程 Server 认证**：始终使用 HTTPS 和认证头

---

## 与 Custom Tools 的区别

| 维度 | Custom Tools | MCP Servers |
|------|-------------|-------------|
| 运行方式 | 内嵌于 OpenCode | 独立进程/服务 |
| 语言支持 | TypeScript/JS | 任意语言 |
| 部署复杂度 | 低 | 中（需启动服务） |
| 可复用性 | 项目级 | 跨项目共享 |
| 远程能力 | 不支持 | 原生支持 |

---

## 相关文档

- [Plugins 扩展机制](./plugins.md) — 事件钩子与行为改写
- [Custom Tools](./custom-tools.md) — 内嵌工具开发
- [Server/SDK](./server-sdk.md) — 远程服务集成
- [安全边界](./security-boundary.md) — MCP 接入的安全考量

---

*本文档基于 MCP 协议规范和社区最佳实践整理，最后更新：2026-02-22*
