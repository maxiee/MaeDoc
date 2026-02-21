# OpenCode 使用指南

> **所属系列**：[MaeDoc 文档库](../index.md)
> **最后更新**：2026-02-22

---

## 简介

[OpenCode](https://opencode.ai) 是 MaeDoc 的底层 AI 运行时引擎。本系列文档帮助你快速掌握 OpenCode 的安装、配置和使用。

**为什么选择 OpenCode**：
- **国内首选**：相比 Claude Code，访问更稳定，支持国内用户
- **多模式支持**：桌面端（GUI）和命令行（TUI）双模式
- **Skills 生态**：支持加载 GitHub 上的 Skills 扩展能力
- **多模型支持**：可连接 Claude、OpenAI、本地 Ollama 等多种模型

---

## 文档目录

| 文档 | 说明 |
|------|------|
| [安装指南](./installation.md) | 下载地址、桌面端/CLI 安装、文件结构 |
| [Skills 使用入门](./skills-basics.md) | 什么是 Skills、目录结构、安装与验证 |
| [SKILL.md 开发规范](./skill-md-spec.md) | Frontmatter 字段、名称验证规则、完整示例 |
| [Skills 权限配置](./skills-permissions.md) | 权限模式、禁用技能、常见问题 |
| [环境变量](./environment-variables.md) | 全局配置 vs 项目配置 |
| [常用命令](./commands-reference.md) | /models、/connect、@ 引用、命令汇总 |
| [常见问题](./faq.md) | 问题解决与使用技巧 |

---

## 快速上手

1. **安装**：从 [opencode.ai/download](https://opencode.ai/download) 下载对应平台版本
2. **配置模型**：启动后使用 `/connect` 添加你的 API Key
3. **加载 Skills**：将 Skills 放入 `.opencode/skills/` 目录，执行 `/init`
4. **开始使用**：输入问题或命令，与 AI 交互

---

## 与 MaeDoc 的关系

MaeDoc 是运行在 OpenCode 之上的**文档写作 AI Agent**：

```
用户 → /create /iterate /review → OpenCode Runtime
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
               Commands              Skills             Templates
              (MaeDoc 命令)         (MaeDoc 能力)        (文档类型)
```

- OpenCode 提供：AI 运行时、模型连接、Skills 加载机制
- MaeDoc 提供：文档写作命令、AI 写作 Skills、文档类型模板

---

*本导航由 `/evolve` 命令生成，最后更新：2026-02-22*
*结构演进于 2026-02-22：拆分 skills-configuration.md 为 3 个子文档*
