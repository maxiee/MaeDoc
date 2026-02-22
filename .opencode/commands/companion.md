---
name: companion
description: MaeDoc 高自治写作伴侣入口。以“Plan → Build → Crystallize”闭环管理整个 docs 文档库，支持跨主题探索、焦点切换和真知沉淀。
---

# /companion 命令

> **命令**：`/companion`
> **版本**：1.0.0
> **用途**：你只给方向，MaeDoc 负责全库编排与写作落地

---

## 用法

```bash
/companion <你当前想探索或推进的方向>
/companion
```

**示例**：

```bash
/companion 我想从微服务迁移转向“可靠消息投递与一致性”
/companion 这周我想把文档库变成“AI Agent 写作体系”的完整方法论
```

---

## 设计原则

- **Plan → Build**：先规划变更，再执行落地
- **全库视角**：不是改一篇文档，而是治理整个 `docs/`
- **低打断自治**：默认自动执行低/中风险操作，只在高风险决策时提问
- **真知沉淀**：每轮结束都要把“可复用认知”写入知识晶体
- **会话可恢复**：任何中断后可基于 `docs/companion/session-brief.md` 继续

---

## 交互策略

> 所有交互通过 `question` 工具完成。

### 风险分级

| 风险级别 | 典型操作 | 是否必须确认 |
|---------|---------|------------|
| 低 | 新建文档、补充章节、更新导航、修复断链 | 否（自动执行） |
| 中 | 跨文档术语同步、目录重排、多文件拆分 | 默认否（批量摘要确认可选） |
| 高 | 归档/删除、合并大量文档、外发 `.docforge/outbox/` | 是（必须确认） |

> 若本轮包含高风险操作，先展示执行计划并等待确认。

---

## 控制平面文件

`/companion` 将以下文件视为长期状态（若不存在则自动初始化）：

- `docs/companion/current-focus.md`：当前焦点、目标与非目标
- `docs/companion/theme-map.md`：主题图谱与活跃度
- `docs/companion/knowledge-crystals.md`：真知沉淀（证据链 + 置信度）
- `docs/companion/session-brief.md`：会话续航摘要

---

## 执行流程

### 阶段 0：接收意图 + 续航恢复

1. 读取命令参数作为 `intent`。
2. 若参数为空：读取 `docs/companion/current-focus.md` 的“当前焦点”作为默认意图。
3. 读取 `docs/companion/session-brief.md`，恢复上次中断点与未完成事项。

---

### 阶段 1（Plan）：探索与编排

#### 1.1 调用 `doc-explorer`（task）

输入：`intent` + `docs/` 全库 + 伴侣状态文件。
输出：主题图谱、焦点建议、候选操作（CREATE/UPDATE/SYNTHESIZE/ARCHIVE）。

#### 1.2 调用 `doc-companion-planner`（task）

基于探索结果生成执行计划：
- 操作清单（含风险等级）
- 可自动执行标记（`AUTO_EXECUTE: true/false`）
- 完成标准（`DONE_CRITERIA`）

#### 1.3 高风险拦截

若计划中存在高风险操作，使用 `question` 工具请求用户确认：
- 确认全部
- 跳过高风险，仅执行低/中风险
- 取消本轮

---

### 阶段 2（Build）：执行文档库操作

按计划顺序执行，允许并行执行互不依赖的低风险操作。

**建议执行策略**：

- 新主题或覆盖缺口：按 `/create` 的“规划 → 写作 → 质量门”链路创建
- 现有文档增强：按 `/iterate` 的“需求映射 → 修改 → 质量门”链路更新
- 结构重整：按 `/evolve` 的“全库分析 → 结构/内容变更 → 索引更新”链路执行

每完成一项操作，记录到 `operation_log`。

---

### 阶段 3（Crystallize）：真知沉淀

调用 `knowledge-synthesizer`（task），基于本轮变更与全库上下文输出：

- 可沉淀知识晶体（Claim / Confidence / Evidence）
- 冲突定义与待验证假设
- 下一轮探索问题清单

---

### 阶段 4：状态同步

加载 `companion-state-sync` Skill：

- 更新 `current-focus.md`
- 更新 `theme-map.md`
- 追加 `knowledge-crystals.md`
- 更新 `session-brief.md`
- 校验新文档是否注册到 `docs/index.md`

---

### 阶段 5：输出回合报告

输出结构：

```markdown
---

Companion 回合完成

- 当前焦点：{focus}
- 已执行操作：{N} 项（低 {n1} / 中 {n2} / 高 {n3}）
- 新增/更新文档：{文件列表}
- 新增知识晶体：{N} 条
- 待确认问题：{N} 条

下一轮建议：{1-3 条}

---
```

---

### 阶段 6：TODO 录入（必做）

执行 `todo-append` Skill 检查：

1. 本轮跳过的中/高价值操作
2. 新产生的 `[待确认]` / `[假设]` 标注
3. 关联文档待同步但未处理项
4. 需要跨回合跟进的验证任务

命令结束时必须输出：

- `已记录 TODO：T-NNN`（有新增）
- 或 `TODO 扫描：无项`

---

## 错误处理

| 场景 | 处理方式 |
|------|---------|
| 伴侣状态文件缺失 | 自动创建模板后继续 |
| 计划结果为空 | 输出“本轮无必要变更”，仅同步 session-brief |
| 执行阶段出现冲突 | 自动降级为“最小安全改动”，并记录 TODO |
| 高风险操作未获确认 | 跳过高风险操作，继续低/中风险任务 |

---

## 注意事项

1. 这是“高自治入口”，不等同于 `/create` 的逐步交互模式。
2. 高风险操作必须确认；低/中风险默认自动执行。
3. 任何回合结束都必须更新伴侣控制平面文件。
4. 若 `intent` 与当前焦点冲突，应优先支持“主题切换”，而非强行延续旧方向。
