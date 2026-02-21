# OpenCode 环境变量配置

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22

---

## 配置层级

OpenCode 支持**两层配置**：全局配置和项目配置。

```
项目配置（优先级高）
    ↓ 覆盖
全局配置（优先级低）
    ↓ 覆盖
默认配置
```

---

## 全局配置

全局配置适用于所有项目，存储在用户目录下。

| 平台 | 配置路径 |
|------|---------|
| Windows | `C:\Users\<用户名>\.config\opencode\opencode.json` |
| macOS | `~/.config/opencode/opencode.json` |
| Linux | `~/.config/opencode/opencode.json` |

**用途**：
- 存储个人偏好的模型选择
- 配置通用的 API Key
- 设置全局权限策略

---

## 项目配置

项目配置仅对当前项目生效，存储在项目根目录下。

**路径**：`<项目根目录>/opencode.json` 或 `<项目根目录>/opencode.jsonc`

**用途**：
- 为特定项目定制 Skills
- 覆盖全局权限设置
- 配置项目专属的模型选择

---

## 配置文件格式

OpenCode 使用 JSON 或 JSONC（带注释的 JSON）格式。

**示例**：

```jsonc
{
  "model": {
    "provider": "anthropic",
    "name": "claude-sonnet-4-20250514"
  },
  "permissions": {
    "edit": "ask",     // 编辑文件前询问
    "bash": "ask",     // 执行命令前询问
    "share": "disabled" // 禁用会话分享
  },
  "instructions": [
    "./AGENTS.md"      // 加载 AI 行为准则
  ]
}
```

---

## 配置优先级示例

假设你有以下配置：

**全局配置**（`~/.config/opencode/opencode.json`）：
```json
{
  "model": { "provider": "openai", "name": "gpt-4" }
}
```

**项目配置**（`my-project/opencode.json`）：
```json
{
  "model": { "provider": "anthropic", "name": "claude-sonnet-4-20250514" }
}
```

**结果**：在 `my-project` 中使用 Claude，在其他项目中使用 GPT-4。

---

## 常用环境变量

OpenCode 也支持通过环境变量配置：

| 变量名 | 说明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key |
| `OPENAI_API_KEY` | OpenAI API Key |
| `OPENCODE_CONFIG` | 指定配置文件路径 |

---

## 创建项目级配置

1. 进入项目目录
2. 在 OpenCode 中执行 `/init`
3. OpenCode 会自动生成 `opencode.jsonc` 配置文件

或者手动创建：

```bash
# 在项目根目录
touch opencode.jsonc
```

---

## 最佳实践

1. **API Key 放全局**：敏感信息放在全局配置，避免误提交到 Git
2. **项目配置覆盖**：只在需要时在项目配置中覆盖全局设置
3. **使用 .gitignore**：将 `opencode.json` 添加到 `.gitignore`（如果包含敏感信息）

```gitignore
# .gitignore
opencode.json
.opencode/
```

---

*本文档由 `/evolve` 命令生成，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》，最后更新：2026-02-22*
