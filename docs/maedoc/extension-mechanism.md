# 扩展机制

> **所属系列**：[MaeDoc 核心架构设计](./index.md)
> **最后更新**：2026-02-22

---

## 新增 Skill

在 `.opencode/skills/` 下创建 Skill 目录，目录中只需一个文件：

```
.opencode/skills/my-skill/
└── SKILL.md        # 全大写，唯一必需文件
```

`SKILL.md` 包含：
- frontmatter：`name` 和 `description`
- 正文：任务描述、输入格式说明、输出格式约定

---

## 新增 Command

在 `.opencode/commands/` 下创建命令文件：

```
.opencode/commands/my-command.md
```

命令文件描述：
- 命令用法和参数
- 执行流程
- 调用的 Skill Chain

---

## 相关文档

- [Skill 契约设计](./skill-contract.md) — 了解 Skill 的结构规范
- [命令分发机制](./command-dispatch.md) — 了解 Command 如何调用 Skill
