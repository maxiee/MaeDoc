# OpenCode Server/SDK 远程集成

> **所属系列**：[OpenCode 使用指南](../index.md) → [扩展能力](./index.md)
> **最后更新**：2026-02-22

---

## 概述

OpenCode 可以作为**本地 Server**运行，通过 **OpenAPI 3.1** 规范暴露接口，支持 **SSE（Server-Sent Events）** 事件流。这让你能用 SDK 或自建客户端把 OpenCode 当做"可编程代理后端"来调度。

```
┌──────────────┐     HTTP/SSE      ┌──────────────┐
│   客户端      │ ◄───────────────► │ OpenCode     │
│  (SDK/App)   │                   │   Server     │
└──────────────┘                   └──────────────┘
                                         │
                                         ▼
                                   ┌──────────────┐
                                   │  AI Models   │
                                   │  (Claude/...)│
                                   └──────────────┘
```

**适用场景**：
- 构建自定义 IDE 插件
- 集成到现有应用中
- 多端协同（Web、桌面、移动端）
- 批量自动化任务

---

## 启动 Server

### 命令行启动

```bash
# 启动 OpenCode Server（默认端口 3000）
opencode server

# 指定端口
opencode server --port 8080

# 指定监听地址
opencode server --host 0.0.0.0
```

### 配置文件

```jsonc
// opencode.jsonc
{
  "server": {
    "enabled": true,
    "port": 3000,
    "host": "127.0.0.1",
    "cors": {
      "origins": ["http://localhost:5173"]
    }
  }
}
```

---

## OpenAPI 3.1 规范

OpenCode Server 提供符合 OpenAPI 3.1 的 REST API。

### 核心端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/v1/chat` | POST | 发送消息，获取响应 |
| `/v1/chat/stream` | POST | 发送消息，SSE 流式响应 |
| `/v1/models` | GET | 列出可用模型 |
| `/v1/skills` | GET | 列出已加载 Skills |
| `/v1/tools` | GET | 列出可用工具 |
| `/v1/sessions` | GET/POST | 管理会话 |

### 请求示例

```bash
# 发送消息
curl -X POST http://localhost:3000/v1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "解释一下什么是 MCP 协议"}
    ],
    "model": "claude-sonnet-4-20250514"
  }'
```

### 响应格式

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "model": "claude-sonnet-4-20250514",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "MCP（Model Context Protocol）是..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 150,
    "total_tokens": 170
  }
}
```

---

## SSE 事件流

对于长时间响应，使用 SSE 获取实时流式输出：

### 请求

```bash
curl -X POST http://localhost:3000/v1/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "写一个快速排序算法"}]
  }'
```

### SSE 事件

```
event: content_block_start
data: {"type": "content_block_start", "index": 0}

event: content_block_delta
data: {"type": "content_block_delta", "delta": {"text": "def"}}

event: content_block_delta
data: {"type": "content_block_delta", "delta": {"text": " quicksort"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

### 客户端处理

```typescript
const eventSource = new EventSource('/v1/chat/stream');

eventSource.addEventListener('content_block_delta', (event) => {
  const data = JSON.parse(event.data);
  process.stdout.write(data.delta.text);
});

eventSource.addEventListener('message_stop', () => {
  eventSource.close();
});
```

---

## SDK 使用

### TypeScript SDK

```typescript
import { OpenCode } from '@opencode/sdk';

const client = new OpenCode({
  baseUrl: 'http://localhost:3000'
});

// 发送消息
const response = await client.chat({
  messages: [
    { role: 'user', content: '帮我分析这段代码的问题' }
  ],
  skills: ['code-reviewer']
});

console.log(response.content);
```

### 流式响应

```typescript
const stream = await client.chat.stream({
  messages: [{ role: 'user', content: '生成 README' }]
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}
```

### 调用工具

```typescript
const result = await client.tools.execute('read_file', {
  path: './src/index.ts'
});

console.log(result.content);
```

---

## 安全配置

### CORS 设置

```jsonc
{
  "server": {
    "cors": {
      "origins": [
        "http://localhost:5173",
        "https://myapp.example.com"
      ],
      "methods": ["GET", "POST"],
      "headers": ["Content-Type", "Authorization"]
    }
  }
}
```

### 认证

```jsonc
{
  "server": {
    "auth": {
      "type": "bearer",
      "tokens": ["my-secret-token"]
    }
  }
}
```

### 请求验证

```bash
curl -X POST http://localhost:3000/v1/chat \
  -H "Authorization: Bearer my-secret-token" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 网络暴露注意事项

### ⚠️ 安全警告

**切勿在公网直接暴露 OpenCode Server！**

OpenCode Server 具有完整的文件系统访问权限，错误暴露会导致严重安全风险。

### 安全实践

1. **仅监听 localhost**

```jsonc
{
  "server": {
    "host": "127.0.0.1"  // 不是 0.0.0.0
  }
}
```

2. **使用反向代理**

```
# nginx 配置示例
server {
    listen 443 ssl;
    
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        
        # 认证
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

3. **使用 VPN/Tunnel**

```bash
# 使用 ngrok（仅开发环境）
ngrok http 3000

# 使用 tailscale
tailscale serve 3000
```

---

## 第三方客户端集成

### VS Code 扩展

```typescript
// extension.ts
import { OpenCode } from '@opencode/sdk';

const client = new OpenCode({ baseUrl: 'http://localhost:3000' });

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'opencode.explain',
    async () => {
      const editor = vscode.window.activeTextEditor;
      const code = editor.document.getText();
      
      const response = await client.chat({
        messages: [{
          role: 'user',
          content: `解释这段代码：\n\`\`\`\n${code}\n\`\`\``
        }]
      });
      
      vscode.window.showInformationMessage(response.content);
    }
  );
  
  context.subscriptions.push(disposable);
}
```

### Web 应用

```typescript
// React 组件
function ChatComponent() {
  const [messages, setMessages] = useState([]);
  
  const sendMessage = async (content: string) => {
    const response = await fetch('http://localhost:3000/v1/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...messages, { role: 'user', content }]
      })
    });
    
    // 处理 SSE 流...
  };
  
  return <ChatUI messages={messages} onSend={sendMessage} />;
}
```

---

## 相关文档

- [MCP Servers](./mcp-servers.md) — 外部工具协议
- [Custom Tools](./custom-tools.md) — 内嵌工具开发
- [安全边界](./security-boundary.md) — Server 暴露的安全考量

---

*本文档基于 OpenCode Server API 规范整理，最后更新：2026-02-22*
