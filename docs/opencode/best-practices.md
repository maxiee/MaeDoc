# OpenCode 最佳实践

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22
> **知识来源**：[The definitive guide to OpenCode](https://reading.sh/the-definitive-guide-to-opencode-from-first-install-to-production-workflows-aae1e95855fb)

---

## 概述

本节总结 OpenCode 日常使用的最佳实践，包括 Prompt 技巧、上下文管理和成本控制策略。

---

## Prompt 工程技巧

### 明确约束

告诉 AI 你的具体要求，避免猜测。

**反例**：
```
给注册表单添加输入验证
```

**正例**：
```
给注册表单添加输入验证。
使用 Zod 定义 schema。
显示内联错误消息。
不要修改提交按钮的样式。
```

### 显式引用文件

用 `@` 明确指定相关文件。

**反例**：
```
把日期工具重构一下
```

**正例**：
```
重构 @src/utils/date.ts，使用 date-fns 替代 moment。
保持所有函数签名不变。
```

### 请求解释

当你不确定问题时，让 AI 解释推理过程。

```
为什么这个 API 路由返回 500 错误？
带我过一遍请求流程。
```

### 指定输出格式

告诉 AI 你期望的输出结构。

```
列出所有使用 deprecated API 的地方，格式：
- 文件路径:行号
- 使用方式
- 替代方案
```

---

## 上下文管理

### 问题：上下文过载

长会话会累积大量上下文，导致：
- 响应变慢
- AI "忘记"早期内容
- 输出质量下降

### 解决方案

**方案 1：启动新会话**

```
ctrl+n
```
或
```
:new
```

**方案 2：使用 /compact**

如果可用，压缩当前上下文：
```
/compact
```

**方案 3：精确指定文件**

减少 AI 需要读取的范围：
```
只关注 @src/auth/ 目录，忽略其他文件
```

---

## 成本控制

### 分层使用模型

不同任务使用不同价位的模型。

| 任务类型 | 推荐模型 | 原因 |
|---------|---------|------|
| 复杂架构设计 | GPT-5.2-Codex-xhigh | 需要最强推理能力 |
| 日常工作 | Kimi K2.5 / GPT-5.2-Codex-medium | 性价比高 |
| 简单问题 | GPT-5.2-Codex-mini | 成本最低 |

### Per-Agent 配置

不同 Agent 使用不同模型：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "plan": {
      "model": "synthetic/hf:moonshotai/Kimi-K2.5"
    },
    "build": {
      "model": "synthetic/hf:MiniMaxAI/MiniMax-M2.1"
    }
  }
}
```

**策略**：
- Plan Agent 用强模型（需要理解需求）
- Build Agent 用中档模型（执行明确指令）

### 选择固定费率提供商

如果你是高频用户，考虑 Synthetic 等固定费率提供商：
- 消除 token 计费焦虑
- 高限额适合 agentic 工作流

详见 [提供商选择指南](./providers-guide.md)。

---

## 调试技巧

### 检查认证状态

```bash
opencode auth list
```

### 列出可用模型

```bash
opencode models
```

### 验证 MCP 服务器

启动时查看 TUI 中的错误信息。

### Skill 未加载？

检查以下问题：
- SKILL.md 拼写是否正确（全大写）
- Frontmatter 是否包含 `name` 和 `description`
- Skill 名称是否唯一
- 权限是否被设为 `deny`

---

## 常见问题

### Q：如何让 AI 遵循特定编码风格？

编辑项目根目录的 `AGENTS.md`：

```markdown
## 编码规范

- 使用 2 空格缩进
- 优先使用 const，其次 let，避免 var
- 组件使用 PascalCase
- 工具函数使用 camelCase
```

### Q：如何避免 AI 修改不该改的文件？

使用权限配置：

```json
{
  "permission": {
    "edit": {
      "*": "ask",
      "src/**": "allow",
      "*.env": "deny"
    }
  }
}
```

### Q：AI 总是忘记之前的指令？

考虑将指令写入 `AGENTS.md` 或 Skill 中，而非每次对话中重复。

---

## 自定义指令

### 在配置中指定指令文件

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "CONTRIBUTING.md",
    "docs/coding-guidelines.md",
    ".cursor/rules/*.md"
  ]
}
```

### 加载远程指令

```json
{
  "instructions": [
    "https://raw.githubusercontent.com/my-org/shared-rules/main/style.md"
  ]
}
```

---

## 撤销与恢复

### /undo

撤销上一个 AI 响应的所有更改：

```
/undo
```

会回滚文件并重新显示原始 prompt，方便你重新措辞。

### /redo

恢复被撤销的操作：

```
/redo
```

---

## Formatters

### 内置格式化器

OpenCode 可在写入代码后自动格式化：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "extensions": [".js", ".ts", ".jsx", ".tsx", ".json"]
    }
  }
}
```

### 自定义格式化器

```json
{
  "formatter": {
    "black": {
      "command": ["black", "$FILE"],
      "extensions": [".py"]
    }
  }
}
```

`$FILE` 会被替换为实际文件路径。

---

## 权限配置

### 级别

| 级别 | 行为 |
|------|------|
| `allow` | 无需确认直接执行 |
| `ask` | 每次操作前询问 |
| `deny` | 完全禁止 |

### 示例

```json
{
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git status": "allow",
      "git diff": "allow",
      "npm test": "allow",
      "rm -rf *": "deny"
    }
  }
}
```

> 通配符 `*` 放在最前面，后面的规则会覆盖

---

## 检查清单

开始使用 OpenCode 前确认：

- [ ] 已安装支持的终端模拟器（WezTerm / Alacritty / Ghostty / Kitty）
- [ ] 已通过 `/connect` 配置至少一个提供商
- [ ] 已在项目根目录运行 `/init` 生成 AGENTS.md
- [ ] 已编辑 AGENTS.md 添加项目特定规范
- [ ] 已配置 formatters（如使用 Prettier）
- [ ] 已设置合理的权限（生产项目建议 `ask`）

---

## 相关文档

- [提供商选择指南](./providers-guide.md) — LLM 提供商对比
- [生产级工作流](./production-workflows.md) — 实战工作流模式
- [内置命令参考](./commands-built-in.md) — /undo、/connect 等
- [环境变量](./environment-variables.md) — 配置管理

---

*本文档整合自 OpenCode 实战指南，最后更新：2026-02-22*
