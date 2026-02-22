# 演进路线图

> **本文档定位**：将前面章节的思考转化为具体的版本规划
> **所属分组**：[方向与规划](./index.md)
> **相关文档**：[AI 能力深化方向](./ai-capability-deepening.md)、[痛点与不足](../retrospect/pain-points.md)

---

## 1. 路线图概述

> **最近完成**：渐进式求助（hardness-classify MEDIUM 等级改进）+ 基础跨文档上下文感知（doc-outline-generate / doc-content-fill 读取 docs/index.md）

基于前面的分析，MaeDoc 的演进分为三个阶段：

| 阶段 | 主题 | 版本范围 | 核心目标 |
|------|------|---------|---------|
| 收尾 | Phase 6 完成 | v0029-v0030 | 补齐 Quickstart 和 README |
| 深化 | AI 能力强化 | v0031-v0040 | 提示优化、交互改进 |
| 演进 | 架构调整 | v0041-v0050 | Skills 重组、协作模式优化 |

---

## 2. Phase 6 收尾（v0029-v0030）

### v0029: Quickstart 指南

**目标**：让新用户（包括未来的自己）能快速上手。

**产出文件**：
- `docs/guides/quickstart.md`

**内容要点**：
- 前置条件：Open Code 安装、模型配置
- 克隆仓库并启动
- 用 `/create` 创建第一个文档
- 用 `/review` 审阅
- 用 `/iterate` 修改
- （可选）用 `/escalate` 发起远程增强

**验收标准**：
- 按照指南，新用户能在 10 分钟内完成第一个文档
- 覆盖核心工作流

**预计工作量**：1-2 小时

**Commit**: `docs: add quickstart guide`

---

### v0030: README 更新

**目标**：让 README 真实反映项目当前状态。

**产出文件**：
- `README.md`（更新）

**更新内容**：
- 简化定位描述：个人文档写作 AI Agent
- 更新功能列表（标注实际可用 vs 计划中）
- 更新架构图（反映当前设计）
- 移除过时内容
- 添加到这份反思文档的链接

**验收标准**：
- README 与实际代码状态一致
- 无误导性描述

**预计工作量**：1 小时

**Commit**: `docs: update README to reflect current state`

---

## 3. AI 能力深化（v0031-v0040）

> **核心主题**：在不改变架构的前提下，通过优化提升 AI 能力

### v0031: 交互优化 —— 批量提问

**目标**：减少 `/create` 的交互轮次。

**改动点**：
- 将阶段 0.5 的多个 question 合并为一次显示
- 用户可以批量选择或跳过

**产出文件**：
- `.opencode/commands/create.md`（更新）

**验收标准**：
- `/create` 的交互轮次从平均 5 次减少到 2 次
- 用户可以选择「跳过所有追问」

**预计工作量**：2-3 小时

**Commit**: `feat: batch questions in /create command`

---

### v0032: 提示词优化 —— 大纲生成

**目标**：提升 `doc-outline-generate` 的输出质量。

**改动点**：
- 优化大纲生成的提示词结构
- 添加更多「写作方向建议」的示例
- 引入「参考结构」的概念（软约束）

**产出文件**：
- `.opencode/skills/doc-outline-generate/SKILL.md`（更新）

**验收标准**：
- 大纲的一次通过率提升（减少「修改大纲」的情况）
- 用户满意度提升（主观评估）

**预计工作量**：3-4 小时

**Commit**: `feat: optimize outline generation prompts`

---

### v0033: 提示词优化 —— 内容填充

**目标**：提升 `doc-content-fill` 的输出质量。

**改动点**：
- 为不同类型的内容添加更具体的写作指导
- 引入「写作风格」参数（正式 vs 轻松）
- 优化「未指定信息」的处理

**产出文件**：
- `.opencode/skills/doc-content-fill/SKILL.md`（更新）

**验收标准**：
- 生成内容的「可用性」提升（减少大幅修改）
- 信心等级的准确度提升

**预计工作量**：3-4 小时

**Commit**: `feat: optimize content filling prompts`

---

### v0034: 置信度标注

**目标**：在关键输出中显式标注置信度。

**改动点**：
- 在大纲中添加「整体置信度」字段
- 在内容中为关键论点标注置信度
- 建立置信度标注的规范

**产出文件**：
- `.opencode/skills/doc-outline-generate/SKILL.md`（更新）
- `.opencode/skills/doc-content-fill/SKILL.md`（更新）
- `maedoc/writing-guidelines.md`（新增置信度规范）

**验收标准**：
- 所有大纲和关键内容都有置信度标注
- 用户反馈置信度有帮助

**预计工作量**：2-3 小时

**Commit**: `feat: add confidence level annotations`

---

### v0038-v0040: 命令层改进

**v0038: `/review` 增强**

**目标**：让 `/review` 命令更实用。

**改动点**：
- ~~整合 `doc-quality-score` 和 `doc-structure-audit`~~ ✅ 已在 v0008 完成（三者合并为 `doc-evaluate`）
- 输出更结构化的审阅报告
- 提供「修复建议」而非只是「问题列表」

**Commit**: `feat: enhance /review command`

---

**v0039: `/iterate` 改进**

**目标**：降低迭代修改的成本。

**改动点**：
- 支持「预览模式」：显示 diff 预览
- 支持「多方案」：一次生成多个修改方案
- 改进对「修改意图」的理解

**Commit**: `feat: improve /iterate command`

---

**v0040: 快速模式**

**目标**：为有经验的用户提供「跳过交互」的选项。

**改动点**：
- `/create --quick` 跳过所有追问
- `/create --style=xxx` 指定参考结构
- 记住用户的历史偏好

**Commit**: `feat: add quick mode to /create`

---

## 4. 架构调整（v0041-v0050）

> **核心主题**：根据深化阶段的经验，调整架构设计

### v0041-v0043: Skills 重组

**目标**：重新审视 Skills 的划分逻辑。

**可能的变化**：
- ~~合并 `doc-review` + `doc-quality-score` + `doc-structure-audit`~~ ✅ 已在 v0008 完成（合并为 `doc-evaluate`）
- 按使用场景重新分层
- 引入「能力组合」概念

**验收标准**：
- Skills 数量减少但覆盖能力不变
- 用户对 Skills 的理解成本降低

---

### v0044-v0046: 远程协作优化

**目标**：改进 `.docforge` 的使用体验。

**可能的变化**：
- 支持可选的 API 集成
- 优化上报包格式
- 改进建议应用流程

---

### v0047-v0050: 用户体验打磨

**目标**：整体体验优化。

**可能的变化**：
- 命令别名和快捷方式
- 进度反馈优化
- 错误提示改进

---

## 5. 版本规划总览

| 版本 | 主题 | 优先级 | 预计时间 |
|------|------|:------:|---------|
| v0029 | Quickstart | 中 | 1-2 小时 |
| v0030 | README 更新 | 中 | 1 小时 |
| v0031 | 交互优化 | 高 | 2-3 小时 |
| v0032 | 大纲提示优化 | 高 | 3-4 小时 |
| v0033 | 内容提示优化 | 高 | 3-4 小时 |
| v0034 | 置信度标注 | 中 | 2-3 小时 |
| v0038-40 | 命令改进 | 中 | 1 周 |
| v0041-50 | 架构调整 | 低 | 待定 |


---

## 6. 执行原则

1. **小步快跑**：每个版本尽量小，快速验证
2. **可回滚**：每个版本都能独立回滚
3. **用户反馈**：重要改动后收集反馈
4. **文档同步**：代码变化，文档同步更新

---

*本章最后更新：2026-02-21*
