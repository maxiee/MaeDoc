# SKILL.md 开发规范

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22

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

*本文档从 [Skills 配置](./skills-configuration.md) 拆分而来，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》*
