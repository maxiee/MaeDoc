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

## SKILL.md 结构规范

每个 Skill 是一个目录，核心文件是 `SKILL.md`（必须全大写）：

```
.opencode/skills/my-skill/
└── SKILL.md        # 唯一必需文件，全大写
```

### Frontmatter 字段

`SKILL.md` 必须以 YAML frontmatter 开头：

```markdown
---
name: skill-name
description: 功能描述（1-1024 字符）
license: MIT              # 可选
compatibility: opencode   # 可选
metadata:                 # 可选
  audience: developers
  workflow: github
---
```

字段说明：

| 字段 | 必填 | 说明 |
|------|:----:|------|
| `name` | ✓ | 技能名称，必须与目录名一致 |
| `description` | ✓ | 功能描述，1-1024 字符 |
| `license` | | 许可证（如 MIT、Apache-2.0） |
| `compatibility` | | 兼容性标识（如 `opencode`） |
| `metadata` | | 自定义键值对映射 |

未知字段会被忽略。

### 名称验证规则

`name` 必须满足：

- 长度为 1–64 个字符
- 仅包含小写字母和数字，可用单个连字符分隔
- 不以 `-` 开头或结尾
- 不包含连续的 `--`
- 与包含 `SKILL.md` 的目录名称一致

等效正则表达式：

```text
^[a-z0-9]+(-[a-z0-9]+)*$
```

**示例**：
- ✅ `git-release`、`doc-translate`、`pr-review`
- ❌ `Git-Release`（大写）、`git--release`（连续连字符）、`-git`（开头连字符）

### 完整示例

创建 `.opencode/skills/git-release/SKILL.md`：

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do

- Draft release notes from merged PRs
- Propose a version bump
- Provide a copy-pasteable `gh release create` command

## When to use me

Use this when you are preparing a tagged release.
Ask clarifying questions if the target versioning scheme is unclear.
```

---

## 工具描述机制

OpenCode 会在 `skill` 工具描述中列出可用技能：

```xml
<available_skills>
  <skill>
    <name>git-release</name>
    <description>Create consistent releases and changelogs</description>
  </skill>
</available_skills>
```

代理通过调用工具来加载技能：

```plaintext
skill({ name: "git-release" })
```

这就是为什么 `description` 需要足够具体——它直接影响代理是否能正确选择技能。

---

## 权限配置

在 `opencode.json` 中控制代理可以访问哪些技能：

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

### 权限模式

| 模式 | 行为 |
|------|------|
| `allow` | 技能立即加载 |
| `deny` | 对代理隐藏技能，拒绝访问 |
| `ask` | 加载前提示用户确认 |

### 通配符支持

模式支持通配符：
- `*` 匹配所有技能
- `internal-*` 匹配 `internal-docs`、`internal-tools` 等
- `*-experimental` 匹配以 `-experimental` 结尾的技能

### 按代理覆盖权限

可以为特定代理设置不同的权限。

**自定义代理**（在代理 frontmatter 中）：

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**内置代理**（在 `opencode.json` 中）：

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

---

## 禁用技能工具

为不需要使用技能的代理完全禁用技能功能：

**自定义代理**（在代理 frontmatter 中）：

```yaml
---
tools:
  skill: false
---
```

**内置代理**（在 `opencode.json` 中）：

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

禁用后，`<available_skills>` 部分将被完全省略，代理无法访问任何技能。

---

## 常见问题

**Q：Skills 不生效怎么办？**

A：按以下顺序排查：

1. 确认 `SKILL.md` 文件名全部为大写字母
2. 检查 frontmatter 是否包含 `name` 和 `description`
3. 确保技能名称在所有位置中唯一
4. 检查权限设置——设为 `deny` 的技能会对代理隐藏
5. 确认 `.opencode` 目录在项目根目录下（或在 git 工作树内）
6. 确认执行 `/init` 前已切换到 build 模式
7. 尝试重启 OpenCode

**Q：如何知道一个 Skill 的触发条件？**

A：直接问 OpenCode：`@skill-name 这个 Skills 如何使用？`

**Q：全局 Skills 和项目 Skills 有什么区别？**

A：
- **项目 Skills**（`.opencode/skills/`）：仅当前项目可用，跟随项目版本控制
- **全局 Skills**（`~/.config/opencode/skills/`）：所有项目可用，适合个人常用技能
- 两者可共存，项目 Skills 优先级更高

**Q：技能名称可以用中文吗？**

A：不可以。`name` 只能包含小写字母、数字和单个连字符，必须匹配正则 `^[a-z0-9]+(-[a-z0-9]+)*$`。

---

*本文档由 `/evolve` 命令生成，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》，最后更新：2026-02-22*
