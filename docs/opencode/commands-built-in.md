# OpenCode 内置命令参考

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22

---

## 模式切换

OpenCode 有两种工作模式，使用 **Tab 键** 切换：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| `plan` | AI 只规划，不执行 | 探索性任务、不确定的方案 |
| `build` | AI 会实际执行操作 | 确定的任务、批量操作 |

**建议**：
- 不确定时用 plan 模式先看规划
- 确定要做时切换到 build 模式执行

---

## 核心命令

### /models — 选择模型

查看和切换可用的 AI 模型。

```bash
/models
```

OpenCode 默认提供 3 个免费模型（可能不稳定）：
- 基础模型 A
- 基础模型 B
- 基础模型 C

**注意**：免费模型可能出现连接失败，建议配置自己的 API。

---

### /connect — 添加 API

连接你自己的 AI 模型 API。

```bash
/connect
```

支持的服务商：
- Anthropic Claude
- OpenAI
- Google Gemini
- 本地 Ollama
- 其他兼容 OpenAI API 的服务

**交互流程**：
1. 选择服务商
2. 输入 API Key
3. 选择模型
4. 保存配置

---

### /init — 初始化项目

加载项目配置和 Skills。

```bash
/init
```

**执行内容**：
- 读取 `opencode.json` / `opencode.jsonc` 配置
- 加载 `.opencode/skills/` 下的所有 Skills
- 加载 `.opencode/commands/` 下的所有命令
- 理解项目结构

**前置条件**：必须切换到 build 模式。

---

### /undo / /redo — 撤销与重做

撤销或重做最近的操作。

```bash
/undo    # 撤销上一步操作
/redo    # 重做被撤销的操作
```

---

### /share — 分享会话

导出当前会话内容，便于分享或备份。

```bash
/share
```

---

### /help — 帮助

查看帮助信息。

```bash
/help
```

---

## @ 引用

### @ 引用 Skills

手动指定要使用的 Skills。

```bash
@skill-name 你好，这个 Skills 怎么用？
```

**使用场景**：
- 明确指定使用某个 Skill
- 了解某个 Skill 的用法
- 强制触发某个 Skill

### @ 引用文件

在对话中引用文件内容。

```bash
@src/index.ts 这个文件有什么问题？
```

---

## 命令汇总表

| 命令 | 功能 | 示例 |
|------|------|------|
| `/models` | 查看和切换模型 | `/models` |
| `/connect` | 连接 API | `/connect` |
| `/init` | 初始化项目 | `/init` |
| `/undo` | 撤销操作 | `/undo` |
| `/redo` | 重做操作 | `/redo` |
| `/share` | 分享会话 | `/share` |
| `/help` | 查看帮助 | `/help` |
| `@skill` | 引用 Skills | `@my-skill 如何使用？` |
| `@file` | 引用文件 | `@src/index.ts 分析这个文件` |
| Tab | 切换 plan/build 模式 | — |
| ↑/↓ | 浏览历史命令 | — |

---

## 交互技巧

### 直接提问

遇到不会的操作，直接问 OpenCode：

```
我如何在当前项目创建项目级配置？
```

OpenCode 会给出详细指导。

### 查询 Skills 用法

```
@skill-name 这个 Skills 如何使用？
```

### 批量操作

在 build 模式下，OpenCode 可以执行批量操作（如批量创建文件、批量修改）。

---

## 桌面端操作

桌面端提供图形化界面，操作更直观：

- 模式切换：点击界面上的模式按钮
- 模型选择：点击模型名称，从列表选择
- Skills 引用：输入 `@` 后从下拉列表选择

---

## 相关文档

- [自定义命令开发](./commands-custom.md)：创建你自己的命令
- [Skills 使用入门](./skills-basics.md)：了解 Skills 生态
- [SKILL.md 开发规范](./skill-md-spec.md)：开发自己的 Skills

---

*本文档整合自 `/evolve` 命令，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》及官方文档，最后更新：2026-02-22*
