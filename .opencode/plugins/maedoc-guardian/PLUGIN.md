---
name: maedoc-guardian
version: 1.0.0
description: MaeDoc 文档库守护插件。检测 docs/ 变更后在 session idle 阶段触发治理提醒，确保控制平面与索引一致。
hooks:
  - tool.execute.after
  - session.idle
---

# maedoc-guardian

在检测到 `docs/` 写操作后，回合结束自动提醒执行：

1. 伴侣状态同步（focus/theme/crystals/session）
2. `docs/index.md` 注册校验
3. TODO 扫描完成声明

> 该插件只发送提醒，不直接修改文件。
