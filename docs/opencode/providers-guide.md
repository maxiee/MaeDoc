# OpenCode LLM 提供商选择指南

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22
> **知识来源**：[The definitive guide to OpenCode](https://reading.sh/the-definitive-guide-to-opencode-from-first-install-to-production-workflows-aae1e95855fb)

---

## 概述

OpenCode 支持 75+ LLM 提供商，让你能够"**同一界面，任意大脑**"。选择合适的提供商取决于你的预算、使用场景和合规要求。

**核心优势**：
- 不锁定单一提供商
- 随时切换模型，无需改变工作流
- 企业合规场景可指定特定提供商

---

## 推荐提供商

### Synthetic（推荐）

[Synthetic](https://synthetic.new) 提供固定费率订阅制，消除按 token 计费的心理负担。

**优势**：
- **固定费率**：不用担心每次请求的成本累积
- **高限额**：比 Claude 同等价位的限额高 3-6 倍
- **Kimi K2.5**：Moonshot AI 的 MoE 模型（1T 总参数/32B 激活），在编码任务上表现出色
- **多模型访问**：订阅即可使用 19+ 前沿模型（DeepSeek V3.2、Qwen3-Coder-480B 等）
- **隐私保护**：不在用户数据上训练

**定价**：
| 套餐 | 月费 | 限额 | 说明 |
|------|------|------|------|
| Standard | $20 | 135 次/5 小时 | 所有模型可用 |
| Pro | $60 | 1,350 次/5 小时 | 所有模型可用 |

> 小请求（<2048 tokens）计为 0.2 次，工具调用计为 0.1 次（相当于 agentic 工作流的 12 倍限额）

**配置**：

```bash
/connect
# 选择 "Other"
# 输入 provider ID: synthetic
# 粘贴 API Key
```

---

### OpenCode Zen

OpenCode 官方提供的模型网关，经过基准测试和优化。

**优势**：
- **零配置**：模型开箱即用
- **免费模型**：GLM 4.7 Free、Kimi K2.5 Free、Big Pickle
- **竞争定价**：通常比直接使用更便宜
- **团队管理**：支持角色权限和消费限额

**定价示例（每 1M tokens）**：
| 模型 | 输入 | 输出 |
|------|------|------|
| Claude Sonnet 4.5 | $3.00 | $15.00 |
| Qwen3 Coder 480B | $0.45 | $1.50 |
| 免费模型 | $0 | $0（但会用于训练）|

**配置**：

```bash
# 1. 访问 opencode.ai/auth 登录并添加支付方式
# 2. 复制 API Key
/connect
# 选择 "opencode"
# 粘贴 API Key
```

---

### GitHub Copilot（官方支持）

GitHub Copilot 现已官方支持 OpenCode。

**优势**：
- **官方支持**：无滥用检测风险
- **模型花园**：可访问 GPT-5、Claude 等模型
- **现有订阅**：如果你已有 Copilot 订阅，无需额外付费

**配置**：

```bash
/connect
# 选择 "GitHub Copilot"
# 浏览器打开 github.com/login/device
# 输入终端显示的代码
# 授权连接
```

---

### OpenAI（ChatGPT Plus/Pro）

使用 ChatGPT 订阅连接 OpenCode。

**配置**：

```bash
/connect
# 选择 "OpenAI"
# 选择 "ChatGPT Plus/Pro"
# 浏览器 OAuth2 认证
# 授权连接
```

---

### OpenRouter

通过单一 API Key 访问多个提供商的模型。

**优势**：
- **模型聚合**：一个 key 访问多个提供商
- **灵活实验**：适合尝试不同模型

**配置**：

```bash
# 1. 在 openrouter.ai 创建 API Key
/connect
# 选择 "OpenRouter"
# 粘贴 API Key
```

---

### Amazon Bedrock（企业）

适用于有 AWS 合规要求的企业用户。

**配置**（在 `opencode.json` 中）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile"
      }
    }
  }
}
```

或使用环境变量：

```bash
export AWS_PROFILE=my-dev-profile
export AWS_REGION=us-east-1
opencode
```

> 需先在 Bedrock 控制台启用模型访问

---

### 自定义 OpenAI 兼容提供商

任何兼容 OpenAI API 的提供商：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "my-provider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Custom Provider",
      "options": {
        "baseURL": "https://api.my-provider.com/v1"
      },
      "models": {
        "my-model": {
          "name": "My Model"
        }
      }
    }
  }
}
```

---

## 选择决策矩阵

| 场景 | 推荐提供商 | 原因 |
|------|-----------|------|
| 个人开发者，预算有限 | **Synthetic Standard** | 固定费率，无 token 焦虑 |
| 重度用户，高频使用 | **Synthetic Pro** | 高限额，适合 agentic 工作流 |
| 已有 Copilot 订阅 | **GitHub Copilot** | 无额外成本，官方支持 |
| 企业合规要求 | **Amazon Bedrock** | AWS 生态集成 |
| 尝试多种模型 | **OpenRouter** | 单 key 访问多模型 |
| 最简配置 | **OpenCode Zen** | 官方优化，开箱即用 |

---

## 关于 Claude/Anthropic

> **注意**：Anthropic 已限制第三方编码代理通过 OAuth 使用 Claude 订阅。

虽然仍可通过 API 直接使用 Claude，但：
- **成本效率低**：按 token 计费，高频使用成本快速累积
- **订阅限制**：Claude 订阅仅限 Claude 生态系统内使用

如果你使用 Claude Max 订阅，建议仅在 Claude Code 官方客户端内使用，而非通过 OpenCode。

---

## 配置示例

### 多模型配置

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "synthetic/hf:moonshotai/Kimi-K2.5",
  "small_model": "synthetic/hf:MiniMaxAI/MiniMax-M2.1"
}
```

- `model`：主工作模型
- `small_model`：轻量任务（如生成会话标题）

### Per-Agent 模型配置

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

---

## 模型 ID 格式

模型 ID 遵循 `provider/model-id` 格式：

| 模型 | ID |
|------|-----|
| Kimi K2.5 (Synthetic) | `synthetic/hf:moonshotai/Kimi-K2.5` |
| Claude Sonnet 4.5 | `anthropic/claude-sonnet-4-5` |
| Claude Opus 4.5 | `anthropic/claude-opus-4-5` |
| GPT-5.2 | `openai/gpt-5.2` |
| GPT-5.2 Codex | `openai/gpt-5.2-codex` |
| Big Pickle (OpenCode Zen) | `opencode/big-pickle` |

---

## 相关文档

- [内置命令参考](./commands-built-in.md) — /connect、/models 命令
- [最佳实践](./best-practices.md) — 成本控制策略
- [扩展能力总览](./extensibility/index.md) — 六支柱架构

---

*本文档整合自 OpenCode 实战指南，最后更新：2026-02-22*
