# OpenCode Skills 配置

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22

---

## 什么是 Skills

Skills 是 OpenCode 的**能力扩展机制**。通过加载 Skills，可以让 AI：
- 自动写代码
- 生成表格
- 执行特定领域任务
- 遵循特定工作流程

可以把 Skills 理解为给 AI 加的"buff"。

---

## .opencode 目录结构

在项目根目录下创建 `.opencode` 目录（注意：以 `.` 开头）：

```
your-project/
├── .opencode/
│   ├── skills/          # Skills 存放目录
│   │   ├── skill-1/
│   │   │   └── SKILL.md
│   │   └── skill-2/
│   │       └── SKILL.md
│   └── commands/        # 命令存放目录（可选）
│       └── my-command.md
└── ...（其他项目文件）
```

---

## 安装 Skills

### 方法一：从 GitHub 下载

**官方 Skills 仓库**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**步骤**：

1. 在项目根目录创建 `.opencode` 目录
2. 从 GitHub 下载 Skills 压缩包
3. 将压缩包中的 `skills` 目录内容复制到 `.opencode/skills/`

```
下载的压缩包内容：
├── skills/
│   ├── skill-a/
│   │   └── SKILL.md
│   └── skill-b/
│       └── SKILL.md
└── ...

复制到：
.opencode/skills/
├── skill-a/
│   └── SKILL.md
└── skill-b/
    └── SKILL.md
```

### 方法二：从 Skills 网站下载

访问 OpenCode Skills 网站，下载感兴趣的 Skills 压缩包，按上述步骤安装。

---

## 验证 Skills 安装

### 步骤 1：切换到 Build 模式

在 OpenCode 中，按 **Tab 键** 切换模式：

- `plan` 模式：AI 只规划，不执行
- `build` 模式：AI 会实际执行操作

**重要**：在执行 `/init` 前必须切换到 build 模式。

### 步骤 2：执行 /init

```
/init
```

OpenCode 会开始理解项目内容，加载 `.opencode/` 下的所有 Skills。

### 步骤 3：验证加载成功

直接问 OpenCode：

```
我能使用什么 Skills？
```

如果安装成功，OpenCode 会列出所有已加载的 Skills 及其功能描述。

---

## 使用 Skills

### 自动触发

当你的输入包含 Skills 的触发条件时，OpenCode 会自动调用对应的 Skills。

### 手动指定

使用 `@` 符号手动指定 Skills：

```
@skill-name 这个 Skills 如何使用？
```

OpenCode 会加载指定的 Skills 并给出使用说明。

---

## Skills 目录结构

每个 Skill 是一个目录，包含：

```
.opencode/skills/my-skill/
└── SKILL.md        # 唯一必需文件，全大写
```

**SKILL.md 结构**：

```markdown
---
name: "Skill 名称"
description: "功能描述"
---

## 任务说明
（描述这个 Skill 做什么）

## 输入格式
（描述接收什么样的输入）

## 输出格式
（描述产生什么样的输出）

## 示例
（可选，提供使用示例）
```

---

## 常见问题

**Q：Skills 不生效怎么办？**

A：检查以下几点：
1. 确认 `.opencode` 目录在项目根目录下
2. 确认 Skills 目录名和 SKILL.md 文件名正确
3. 确认执行 `/init` 前已切换到 build 模式
4. 尝试重启 OpenCode

**Q：如何知道一个 Skill 的触发条件？**

A：直接问 OpenCode：`@skill-name 这个 Skills 如何使用？`

---

*本文档由 `/evolve` 命令生成，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》，最后更新：2026-02-22*
