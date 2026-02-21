# Skills 权限配置

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22

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

*本文档从 [Skills 配置](./skills-configuration.md) 拆分而来，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》*
