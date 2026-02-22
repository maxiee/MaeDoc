# OpenCode 扩展开发学习路径

> **所属系列**：[OpenCode 使用指南](../index.md) → [扩展能力](./index.md)
> **最后更新**：2026-02-22

---

## 概述

本文档为**想实现自定义扩展（插件/工具/MCP/客户端集成）的人**提供一条最硬核、信息密度最高的学习路线。

```
官方扩展体系理解 ──► 社区案例学习 ──► 安全设计 ──► 实战开发
```

---

## 目标读者

- 想开发 OpenCode 插件/工具的开发者
- 需要集成 OpenCode 到自有应用的架构师
- 希望深入理解 OpenCode 扩展机制的高级用户

---

## 学习路径

### Phase 1：理解扩展点与接口（1-2 天）

**目标**：掌握 OpenCode 的六大扩展能力及其边界。

| 顺序 | 文档 | 核心问题 | 产出 |
|:----:|------|---------|------|
| 1 | [Plugins](./plugins.md) | 如何在事件总线前后挂钩？ | 理解 Hook 机制 |
| 2 | [Custom Tools](./custom-tools.md) | 如何定义 LLM 可调用的函数？ | 能写简单 Tool |
| 3 | [MCP Servers](./mcp-servers.md) | 如何接入外部工具集？ | 理解 MCP 协议 |
| 4 | [Agents/Rules/Skills](./agents-rules-skills.md) | 如何组合工作流？ | 理解三要素协同 |
| 5 | [Server/SDK](./server-sdk.md) | 如何远程调用 OpenCode？ | 理解 API 规范 |
| 6 | [安全边界](./security-boundary.md) | 安全校验点在哪里？ | 安全意识建立 |

**检验点**：能用自己的话解释六大扩展点的区别和适用场景。

---

### Phase 2：学习社区高质量案例（2-3 天）

**目标**：通过分析成熟实现，掌握最佳实践。

#### 2.1 必读社区插件

| 插件 | 学习重点 | 难度 |
|------|---------|:----:|
| **PTY 增强** | `after:tool` 改写 Bash 执行结果 | ⭐⭐ |
| **上下文裁剪** | `before:llm` 实现 token 计数与压缩 | ⭐⭐⭐ |
| **记忆管理** | `on:session:end` 持久化状态 | ⭐⭐ |
| **Web Search** | MCP 协议实现网络搜索 | ⭐⭐⭐ |

#### 2.2 分析方法

```bash
# 克隆官方 Skills 仓库
git clone https://github.com/anthropics/skills

# 阅读高质量 Skill 的 SKILL.md
cat skills/pty/SKILL.md
cat skills/context-pruning/SKILL.md
```

**分析要点**：
1. Frontmatter 如何定义触发条件？
2. Skill 如何组织提示词结构？
3. 如何处理边界情况和错误？

#### 2.3 MCP Server 案例

```bash
# 查看 MCP 官方实现
npx @anthropic/mcp-server-filesystem --help
npx @anthropic/mcp-server-github --help
```

**学习重点**：
- 工具 Schema 设计
- 错误处理模式
- 权限控制实现

---

### Phase 3：安全设计（1 天）

**目标**：将安全作为扩展设计的一部分，而非事后补救。

**必修内容**：

| 主题 | 文档章节 | 关键问题 |
|------|---------|---------|
| 权限最小化 | [安全边界 §权限](./security-boundary.md#权限最小化) | 默认 deny 还是 allow？ |
| CORS 与端口 | [安全边界 §CORS](./security-boundary.md#cors-与端口暴露) | 何时可以暴露到公网？ |
| 工作区信任 | [安全边界 §信任](./security-boundary.md#工作区信任) | 如何处理不信任的代码？ |
| 审计日志 | [安全边界 §审计](./security-boundary.md#审计日志) | 如何追踪可疑操作？ |

**安全检查清单**：

- [ ] 敏感文件（.env、*.key）禁止访问
- [ ] 网络请求有域名白名单
- [ ] Server 仅监听 localhost
- [ ] 高危操作（删除、覆盖）需要确认
- [ ] 启用审计日志

---

### Phase 4：实战开发（3-5 天）

**目标**：完成一个完整的扩展实现。

#### 4.1 入门项目：简单 Tool

```typescript
// .opencode/tools/hello.ts
export const definition = {
  name: 'hello',
  description: '打招呼',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    },
    required: ['name']
  }
};

export async function execute(params: { name: string }) {
  return { message: `Hello, ${params.name}!` };
}
```

#### 4.2 进阶项目：Plugin 实现

```typescript
// .opencode/plugins/logger/index.ts
export default {
  name: 'audit-logger',
  
  async beforeTool(context) {
    console.log(`[AUDIT] Tool: ${context.toolName}`);
    return context;
  },
  
  async afterTool(result, context) {
    console.log(`[AUDIT] Result: ${result.status}`);
    return result;
  }
};
```

#### 4.3 高级项目：MCP Server

```typescript
// mcp-servers/custom/index.ts
import { Server } from '@anthropic/mcp';

const server = new Server({ name: 'custom-tools' });

server.tool('analyze_code', {
  description: '分析代码质量',
  parameters: {
    type: 'object',
    properties: {
      code: { type: 'string' }
    },
    required: ['code']
  }
}, async (params) => {
  // 实现代码分析逻辑
  return {
    content: [{ type: 'text', text: '分析结果...' }]
  };
});

server.start();
```

#### 4.4 终极项目：SDK 客户端

```typescript
// 自定义客户端
import { OpenCode } from '@opencode/sdk';

const client = new OpenCode({ baseUrl: 'http://localhost:3000' });

async function analyzeProject(path: string) {
  const files = await readProjectFiles(path);
  
  for (const file of files) {
    const result = await client.chat({
      messages: [{
        role: 'user',
        content: `分析这个文件的代码质量：\n${file.content}`
      }],
      skills: ['code-reviewer']
    });
    
    console.log(`${file.path}: ${result.score}`);
  }
}
```

---

## 学习资源

### 官方资源

| 资源 | 链接 | 说明 |
|------|------|------|
| OpenCode 官网 | https://opencode.ai | 下载和基础文档 |
| 官方 Skills 仓库 | https://github.com/anthropics/skills | 高质量 Skill 参考 |
| MCP 协议规范 | https://modelcontextprotocol.io | MCP 详细文档 |

### 社区资源

| 资源 | 说明 |
|------|------|
| GitHub Discussions | 社区问答和经验分享 |
| Discord / Slack | 实时交流 |

---

## 常见问题

### Q：我应该从哪个扩展点开始？

A：推荐顺序：
1. **Skills** — 最简单，纯文本定义
2. **Custom Tools** — 有编程基础可直接上手
3. **Plugins** — 理解事件机制后尝试
4. **MCP Servers** — 需要外部集成时学习
5. **Server/SDK** — 需要远程调用时学习

### Q：如何调试扩展？

A：
1. 启用调试日志：`OPENCODE_DEBUG=* opencode`
2. 查看审计日志：`~/.config/opencode/audit.log`
3. 使用 `console.log` 在 Tool/Plugin 中输出调试信息

### Q：扩展如何分发？

A：
- **Skills** — 直接放入 `.opencode/skills/`，可提交到 Git
- **Plugins/Tools** — 打包发布到 npm 或直接复制
- **MCP Servers** — 发布到 npm，用户通过 npx 安装

---

## 相关文档

- [Plugins 扩展机制](./plugins.md)
- [Custom Tools](./custom-tools.md)
- [MCP Servers](./mcp-servers.md)
- [Agents/Rules/Skills](./agents-rules-skills.md)
- [Server/SDK](./server-sdk.md)
- [安全边界](./security-boundary.md)

---

*本文档是 OpenCode 扩展开发的学习路线图，最后更新：2026-02-22*
