# Skills 使用入门

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

在项目根目录下创建 `.opencode` 目录（注意：以 `.` 开头）。

### 搜索路径

OpenCode 会按以下顺序搜索 Skills：

| 优先级 | 路径 | 说明 |
|--------|------|------|
| 1 | `.opencode/skills/<name>/SKILL.md` | 项目配置（推荐） |
| 2 | `~/.config/opencode/skills/<name>/SKILL.md` | 全局配置 |
| 3 | `.claude/skills/<name>/SKILL.md` | Claude 兼容 |
| 4 | `~/.claude/skills/<name>/SKILL.md` | 全局 Claude 兼容 |
| 5 | `.agents/skills/<name>/SKILL.md` | 代理兼容 |
| 6 | `~/.agents/skills/<name>/SKILL.md` | 全局代理兼容 |

```
your-project/
├── .opencode/
│   ├── skills/          # Skills 存放目录（项目级）
│   │   ├── skill-1/
│   │   │   └── SKILL.md
│   │   └── skill-2/
│   │       └── SKILL.md
│   └── commands/        # 命令存放目录（可选）
│       └── my-command.md
└── ...（其他项目文件）
```

### 发现机制

对于项目本地路径，OpenCode 会从当前工作目录**向上遍历**，直到到达 git 工作树根目录。在此过程中，它会加载所有匹配的 `skills/*/SKILL.md` 文件。

全局定义从用户主目录下的配置路径加载，与项目路径合并。

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

*本文档从 [Skills 配置](./skills-configuration.md) 拆分而来，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》*
