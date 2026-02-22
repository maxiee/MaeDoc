# OpenCode Custom Tools 自定义工具

> **所属系列**：[OpenCode 使用指南](../index.md) → [扩展能力](./index.md)
> **最后更新**：2026-02-22

---

## 概述

Custom Tools 允许你用 **TypeScript/JavaScript** 定义 LLM 可调用的函数，并在执行时运行任意脚本。

与 Skills 不同，Tools 是**可执行代码**，而 Skills 是**结构化提示词**。

```
LLM 决策 ──► 调用 tool_name ──► 执行 TypeScript 函数 ──► 返回结果
```

**适用场景**：
- 执行需要逻辑判断的操作（如条件分支）
- 调用外部 API 或服务
- 处理结构化数据（JSON 解析、格式转换）
- 实现复杂的工作流编排

---

## 工具定义结构

```
.opencode/
├── tools/
│   ├── my-tool.ts          # TypeScript 工具
│   ├── another-tool.js     # JavaScript 工具
│   └── utils/
│       └── helper.ts       # 辅助模块
└── opencode.jsonc
```

---

## 工具定义格式

### TypeScript 定义

```typescript
// .opencode/tools/fetch-data.ts

interface FetchDataParams {
  url: string;
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
}

interface FetchDataResult {
  status: number;
  data: unknown;
  error?: string;
}

export const definition = {
  name: 'fetch_data',
  description: '从指定 URL 获取数据，支持 GET 和 POST 请求',
  parameters: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: '请求的 URL 地址'
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST'],
        description: 'HTTP 方法，默认 GET'
      },
      body: {
        type: 'object',
        description: 'POST 请求的请求体'
      }
    },
    required: ['url']
  }
};

export async function execute(params: FetchDataParams): Promise<FetchDataResult> {
  try {
    const response = await fetch(params.url, {
      method: params.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: params.body ? JSON.stringify(params.body) : undefined
    });
    
    return {
      status: response.status,
      data: await response.json()
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      error: error.message
    };
  }
}
```

### JavaScript 定义

```javascript
// .opencode/tools/run-script.js

module.exports.definition = {
  name: 'run_script',
  description: '执行 Shell 脚本并返回输出',
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: '要执行的 Shell 命令'
      },
      timeout: {
        type: 'number',
        description: '超时时间（毫秒），默认 30000'
      }
    },
    required: ['command']
  }
};

module.exports.execute = async function(params) {
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    const { stdout, stderr } = await execPromise(params.command, {
      timeout: params.timeout || 30000
    });
    
    return {
      success: true,
      stdout,
      stderr
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
};
```

---

## 参数 Schema 定义

使用 **JSON Schema** 定义参数结构：

```typescript
const definition = {
  name: 'process_file',
  description: '处理文件内容',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: '文件路径'
      },
      operations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['replace', 'append', 'prepend'] },
            search: { type: 'string' },
            replace: { type: 'string' }
          }
        },
        description: '要执行的操作列表'
      },
      options: {
        type: 'object',
        properties: {
          encoding: { type: 'string', default: 'utf-8' },
          backup: { type: 'boolean', default: true }
        }
      }
    },
    required: ['path', 'operations']
  }
};
```

---

## 配置与权限

在 `opencode.jsonc` 中配置工具权限：

```jsonc
{
  "permission": {
    "tool": {
      "*": "ask",              // 默认询问用户
      "fetch_data": "allow",   // 白名单
      "run_script": "ask",     // 高危操作始终询问
      "internal-*": "deny"     // 禁止内部工具
    }
  }
}
```

### 权限模式

| 模式 | 行为 |
|------|------|
| `allow` | 无需确认直接执行 |
| `ask` | 执行前提示用户确认 |
| `deny` | 禁用该工具 |

---

## 最佳实践

### 1. 输入验证

```typescript
export async function execute(params: unknown) {
  // 类型守卫
  if (!isValidParams(params)) {
    return { error: 'Invalid parameters' };
  }
  
  // 继续处理...
}

function isValidParams(params: unknown): params is FetchDataParams {
  return typeof params === 'object' 
    && params !== null 
    && 'url' in params 
    && typeof params.url === 'string';
}
```

### 2. 错误处理

```typescript
export async function execute(params: Params): Promise<Result> {
  try {
    // 业务逻辑
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

### 3. 超时控制

```typescript
export async function execute(params: Params): Promise<Result> {
  const timeout = params.timeout || 30000;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(params.url, {
      signal: controller.signal
    });
    return { success: true, data: await response.json() };
  } finally {
    clearTimeout(timeoutId);
  }
}
```

---

## 与 Skills 的区别

| 维度 | Skills | Custom Tools |
|------|--------|-------------|
| 本质 | 结构化提示词 | 可执行代码 |
| 执行环境 | LLM 推理 | Node.js 运行时 |
| 能力边界 | 受限于 LLM 能力 | 可执行任意操作 |
| 调试难度 | 低（纯文本） | 中（需调试代码） |
| 安全风险 | 低 | 高（可执行系统命令） |

**选择建议**：
- 需要逻辑判断、API 调用 → **Custom Tools**
- 需要指导 LLM 行为模式 → **Skills**
- 两者结合使用效果最佳

---

## 相关文档

- [Plugins 扩展机制](./plugins.md) — 事件钩子与行为改写
- [MCP Servers](./mcp-servers.md) — 外部工具集接入
- [安全边界](./security-boundary.md) — 工具开发的安全考量

---

*本文档基于 OpenCode 官方文档和社区最佳实践整理，最后更新：2026-02-22*
