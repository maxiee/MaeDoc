# OpenCode 常见问题

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22

---

## 核心原则

> **遇到不会的操作，直接问 OpenCode！**

OpenCode 内置了丰富的使用文档，可以直接用自然语言提问：

```
我该如何创建项目级配置？
```

```
如何加载 Skills？
```

```
/connect 命令怎么用？
```

---

## 安装与启动

### Q：Windows 上安装后找不到程序？

A：检查安装目录，应该有以下文件：
- `OpenCode.exe` — 桌面端
- `OpenCode-cli.exe` — 命令行
- `uninstall.exe` — 卸载程序

如果缺少，重新下载安装包。

### Q：macOS 上提示"无法验证开发者"？

A：在系统偏好设置 → 安全性与隐私 → 通用，点击"仍要打开"。

### Q：免费模型连接失败？

A：免费模型稳定性较差，建议：
1. 使用 `/connect` 配置自己的 API
2. 选择 Anthropic Claude 或 OpenAI 等稳定服务

---

## Skills 相关

### Q：Skills 不生效？

A：按顺序检查：
1. `.opencode` 目录是否在项目根目录？
2. Skills 是否放在 `.opencode/skills/` 下？
3. Skills 目录中是否有 `SKILL.md` 文件（全大写）？
4. 执行 `/init` 前是否切换到 build 模式？
5. 尝试重启 OpenCode

### Q：不知道某个 Skill 怎么用？

A：直接问 OpenCode：

```
@skill-name 这个 Skills 如何使用？
```

### Q：如何创建自己的 Skills？

A：在 `.opencode/skills/` 下创建目录和 `SKILL.md` 文件：

```
.opencode/skills/my-skill/
└── SKILL.md
```

SKILL.md 内容格式：

```markdown
---
name: "我的 Skills"
description: "功能描述"
---

## 任务说明
（描述这个 Skill 做什么）

## 输入格式
（描述接收什么样的输入）

## 输出格式
（描述产生什么样的输出）
```

---

## 配置相关

### Q：全局配置和项目配置有什么区别？

A：详见 [环境变量配置](./environment-variables.md)。

简要说明：
- **全局配置**：适用于所有项目，在 `~/.config/opencode/`
- **项目配置**：仅对当前项目生效，在项目根目录

项目配置会覆盖全局配置。

### Q：API Key 放哪里？

A：推荐放在全局配置的 `opencode.json` 中，并确保不提交到 Git：

```gitignore
# .gitignore
opencode.json
```

或使用环境变量：

```bash
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
```

---

## 使用技巧

### Q：plan 模式和 build 模式有什么区别？

A：
- **plan 模式**：AI 只规划，不执行。适合探索性任务。
- **build 模式**：AI 会实际执行操作。适合确定的任务。

按 Tab 键切换。

### Q：如何快速上手？

A：
1. 安装 OpenCode
2. 使用 `/connect` 配置 API
3. 直接开始提问和使用
4. 遇到不会的，直接问 OpenCode

---

## 故障排除

### Q：OpenCode 响应很慢？

A：可能原因：
1. 模型响应慢（尝试切换模型）
2. 网络问题（检查网络连接）
3. 上下文过长（减少输入内容）

### Q：命令执行失败？

A：
1. 确认已切换到 build 模式
2. 检查权限设置（`opencode.json` 中的 `permissions`）
3. 查看错误信息，根据提示处理

### Q：如何重置配置？

A：删除配置文件重新初始化：

```bash
# 删除全局配置
rm ~/.config/opencode/opencode.json

# 删除项目配置
rm opencode.json
```

然后重新执行 `/init`。

---

*本文档由 `/evolve` 命令生成，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》，最后更新：2026-02-22*
