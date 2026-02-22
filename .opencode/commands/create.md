---
name: create
description: 一键创建新文档——MaeDoc 最核心的用户入口。与用户简短对话，通过 doc-planner 生成规划方案，确认后由 doc-writer 在独立上下文中完成内容创作，最后经质量门验证。
---

# /create 命令

> **命令**：`/create`
> **版本**：3.0.0
> **用途**：从用户的一句话描述，自由创建结构化文档——通过三层 SubAgent 协作（规划 → 写作 → 质量验证）实现高质量输出

---

## 用法

```
/create <文档想法描述>
```

**示例**：

```
/create 我想整理一下对分布式系统 CAP 理论的理解
/create 记录今天关于微服务拆分的架构决策
/create 写一篇介绍 Rust 所有权机制的文章
```

---

## 交互原则

> **重要**：所有需要向用户提问或确认的步骤，**必须使用 `question` 工具**进行交互，而非直接输出文本等待用户回复。`question` 工具能在不退出当轮对话的情况下收集用户输入，保持流程连续性。

---

## 任务意识框架

在本命令执行**全程**，同时运行两种意识模式：

**主线模式**：专注高质量完成每个阶段的核心任务。

**后台扫描模式**：以"文档生态守护者"的视角，持续留意以下改进信号。每次信号出现时，**即时在心智便签中标记**（不打断主流程，供末尾"TODO 录入"阶段处理）：

- 写了 `[待确认]`/`[TBD]`/`[假设]` 的位置——**每处标注就是一个潜在 TODO**
- 因"超出范围"、"信息不足"、"时机不对"而跳过或简化的步骤
- 注意到某个关联文档/章节也需要更新，但不在本次任务范围内
- 用户在对话中顺带提到了后续意图，但本次不会处理

> **发现并记录改进机会，与完成核心任务同等重要。** 末尾"TODO 录入"阶段会处理这些心智便签。

---

## 文件优先原则

> **核心设计**：从大纲阶段开始，**每一步的输出都直接写入磁盘文件**。各阶段 Skill 对同一个文件进行修改，而非在上下文中积累内容最后一次性落盘。这样用户可以在创建过程中随时查看文件的当前状态。

---

## 执行流程

### 阶段 0：准备

1. 从 `/create` 命令参数中提取用户的想法描述（即 `<文档想法描述>`）
2. 若用户未提供描述（即直接输入 `/create` 无参数），使用 `question` 工具提问：
   - **问题**：你想写什么文档？
   - **选项**：用户自由输入（可提示示例：对某个概念的理解整理、架构决策记录、技术调研笔记等）

   收到回答后继续后续步骤。

---

### 阶段 0.5：深化需求探询

> **目标**：在生成大纲之前，通过简短对话充分了解用户需求，积累的问答记录将作为 `enriched_context` 传入后续阶段。

**执行规则**：

1. 基于用户的初始描述，推断出最有价值的第一个追问（例如：目标读者是谁、核心诉求是什么、有哪些已知限制等）。
2. 使用 `question` 工具提出问题，**选项列表的最后一项始终保留**：
   - `已经足够了，开始生成大纲`（终止选项）
3. 若用户**未选择**终止选项：
   - 记录本轮问答（`Q: {问题} / A: {回答}`）
   - 根据已有回答推断下一个最有价值的追问，再次调用 `question` 工具（仍保留终止选项）
   - 如此循环，**无次数上限**，直到用户主动终止
4. 若用户**选择**终止选项：
   - 将本轮所有问答汇总为 `enriched_context`，格式如下：

     ```
     原始描述：{用户最初的想法}

     补充信息：
     - Q: {问题1} → A: {回答1}
     - Q: {问题2} → A: {回答2}
     …
     ```

   - 继续阶段 1，后续所有阶段使用 `enriched_context` 替代单纯的原始描述

**追问方向参考**（根据内容和已有信息灵活选择，不必按顺序）：

| 维度 | 示例问题 |
|------|---------|
| 目标读者 | 这篇文档主要写给谁看？（自己备忘 / 团队内部 / 外部读者） |
| 核心目标 | 你最希望读者读完后能得到什么？ |
| 内容边界 | 有哪些内容**一定要包含**？有哪些**不需要覆盖**？ |
| 已有素材 | 你有现成的草稿、参考资料或要点可以提供吗？ |
| 风格偏好 | 偏好正式严谨的技术风格，还是轻松易读的风格？ |
| 长度预期 | 期望文档大概多长？（简短摘要 / 中等篇幅 / 详尽全面） |
| 特殊约束 | 有没有格式、语言或发布平台方面的限制？ |

> **注意**：每次追问应优先选择在当前上下文中信息增益最大的维度，避免重复提问已明确的内容。

---

### 阶段 1：确定输出文件路径

> **重要**：在生成大纲之前先确定文件路径，后续所有阶段都对同一文件进行读写操作。

**步骤 1.1：生成文件名**

基于以下规则生成文件名：

1. 根据用户描述中的关键词，生成语义化英文文件名（kebab-case）
   - 中文描述：提取核心主题词，转为英文或拼音缩写
   - 示例：「分布式系统 CAP 理论」→ `cap-theorem-notes.md`
2. 若无法提取有效关键词：使用 `doc-{当前日期 YYYYMMDD}.md`
   - 示例：`doc-20240115.md`
3. 若文件名已存在：追加序号后缀，如 `cap-theorem-notes-2.md`

**步骤 1.2：确认 docs/ 目录**

> **docs 结构标准**：遵循 `maedoc/docs-structure-standard.md` 的定义。

检查 `docs/` 目录是否存在：
- 若不存在：使用 `question` 工具询问用户是否创建该目录，确认后创建
- 若已存在：直接使用

**步骤 1.3：路径深度判断**

基于 `enriched_context`，判断新文档是否属于某个已有分类：

1. 读取 `docs/index.md` 的文档地图，获取现有分类列表
2. 若能识别出文档属于某个已有分类（如该分类已有对应子目录），路径使用子目录：
   - 示例：文档关于 CAP 理论，已有 `docs/distributed-systems/` 目录 → `docs/distributed-systems/cap-theorem.md`
3. 若无法归入已有分类，放在 `docs/` 根目录

**步骤 1.4：记录输出路径**

将 `output_file = docs/{文件名}` 作为变量，在后续所有阶段中引用。输出告知用户：

```
📁 文档将保存至：docs/{文件名}
```

同时，根据 `output_file` 推导 `base_dir` 候选路径（供多文件模式使用）：
- 若 `output_file` 在 `docs/` 根目录（如 `docs/my-topic.md`）：`base_dir = docs/my-topic/`
- 若 `output_file` 已在子目录（如 `docs/cross-platform-setup/my-topic.md`）：`base_dir = docs/cross-platform-setup/`（使用其父目录）

`base_dir` 此时仅作候选记录，实际创建形式由阶段 2.2 的用户确认决定。

---

### 阶段 2：规划方案生成（doc-planner）

**步骤 2.1：调用 `doc-planner` SubAgent**

使用 `task` 工具调用 `doc-planner` SubAgent：

- **description**：文档规划
- **subagent_type**：`doc-planner`
- **prompt**：
  ```
  请基于以下信息生成文档创建方案：

  enriched_context:
  {阶段 0.5 汇总的 enriched_context（含原始描述 + 所有追问结论）}

  existing_docs_summary:
  {docs/index.md 的文档地图部分（读取 docs/index.md 并提取相关内容）}

  target_path: {output_file（阶段 1 确定的路径）}

  constraints: {用户指定的额外约束，若无则写"无"}

  请读取 docs/index.md 了解现有文档结构，然后按你的执行流程生成规划报告。
  ```

等待 `doc-planner` 返回结构化规划报告（含 OUTLINE、CREATION_MODE、ESTIMATED_LINES、SCALE_EVALUATION 等字段）。

**步骤 2.2：写入大纲文件**

基于 `doc-planner` 输出的 `OUTLINE` 字段内容，将大纲写入 `output_file`：
- 大纲格式：使用 doc-planner 输出的 Markdown 层级结构（含每章节的简短说明）
- 记录 `estimated_lines = ESTIMATED_LINES`
- 记录 `creation_mode_recommendation = CREATION_MODE`（来自 doc-planner 建议）

**步骤 2.3：大纲交互确认**

读取 `doc-planner` 输出中的 `SCALE_EVALUATION` 字段，获取建议创建形式：

**若"建议形式"为"多文件文档树"**，使用 `question` 工具：

- **标题**：确认文档大纲与创建形式
- **问题**：大纲已生成并保存至 `{output_file}`，规模评估建议以多文件文档树形式创建（预估 ~{estimated_lines} 行，超出单文档 300 行上限）。请选择创建形式：
- **选项**：
  1. 以多文件文档树形式创建（Recommended）
  2. 改为单文件创建（不拆分）
  3. 修改大纲（请在选择后说明需要调整的内容）
  4. 重新规划（请在选择后补充更多背景信息，重新调用 doc-planner）
  5. 放弃

根据用户回应：

- **选择 1（多文件）**：记录 `creation_mode = multi_file`，记录 `tree_plan = SCALE_EVALUATION 中的多文件结构`，继续阶段 3
- **选择 2（单文件）**：记录 `creation_mode = single_file`，继续阶段 3
- **选择 3（修改）**：收集用户修改意见，更新大纲（手动编辑 output_file），重新执行步骤 2.3
- **选择 4（重新规划）**：使用 `question` 工具收集更多背景信息，重新调用 `doc-planner`（更新 enriched_context），重新执行步骤 2.2-2.3
- **选择 5（放弃）**：输出 `已取消文档创建流程。` 并终止

**若"建议形式"为"单文件"**，使用 `question` 工具：

- **标题**：确认文档大纲
- **问题**：大纲已生成并保存至 `{output_file}`（见上方输出），请选择下一步操作：
- **选项**：
  1. 确认大纲，开始填充内容（Recommended）
  2. 修改大纲（请在选择后说明需要调整的内容）
  3. 重新规划（请在选择后补充更多背景信息）
  4. 放弃

根据用户回应：

- **选择 1（确认）**：记录 `creation_mode = single_file`，继续阶段 3
- **选择 2（修改）**：收集用户修改意见，更新大纲，重新执行步骤 2.3
- **选择 3（重新规划）**：使用 `question` 工具收集更多背景信息，重新调用 `doc-planner`，重新执行步骤 2.2-2.3
- **选择 4（放弃）**：输出 `已取消文档创建流程。` 并终止

---

### 阶段 3：内容创作（doc-writer）

> **设计原理**：`doc-writer` 拥有独立的上下文窗口，专注于内容创作，不受对话历史干扰。它完成内容填充 + 格式规范化的全部工作，主 Agent 接收完成报告后继续流程。

**步骤 3.1：处理多文件模式的文件路径**

若 `creation_mode = multi_file`：
- 将 `base_dir` 作为写作目录传给 `doc-writer`
- 删除 `output_file`（该文件仅用于存储草稿大纲，多文件模式下由 `doc-writer` 在 `base_dir` 内创建正式文件）

**步骤 3.2：调用 `doc-writer` SubAgent**

使用 `task` 工具调用 `doc-writer` SubAgent：

- **description**：文档内容创作
- **subagent_type**：`doc-writer`
- **prompt**：
  ```
  请根据以下参数完成文档内容创作：

  output_file: {单文件模式下的大纲文件路径，多文件模式下写 null}
  creation_mode: {single_file | multi_file}
  base_dir: {多文件模式下的根目录，单文件模式下写 null}
  tree_plan: {多文件模式下来自 doc-planner 的 SCALE_EVALUATION 中的多文件结构，单文件模式下写 null}
  max_lines: 300

  materials:
  {用户在对话中提供的素材，若无则写"无"}

  constraints:
  {用户指定的约束，含 doc-planner 输出的 CONSTRAINTS_APPLIED 和 DOC_TYPE 信息}

  请按照你的执行流程（逐章节填充 → 格式规范化）完成写作，并输出标准格式报告。
  ```

等待 `doc-writer` 返回结构化完成报告（含 WRITE_COMPLETE、FILES_CREATED、CONFIDENCE_TABLE、PENDING_ITEMS）。

**步骤 3.3：解析完成报告**

解析 `doc-writer` 输出：
- 提取 `FILES_CREATED`：用于阶段 5 完成摘要和阶段 6 index 更新
- 提取 `CONFIDENCE_TABLE`：用于阶段 5 完成摘要
- 提取 `PENDING_ITEMS`：用于阶段 5 完成摘要和阶段 7 TODO 录入

> 💡 **后台扫描触发点**：从 `PENDING_ITEMS` 和 `WRITER_NOTES` 中识别可能的 TODO 候选项，立即在心智便签中标记，供阶段 7 处理。

---

### 阶段 4：质量门检查（必做，不可跳过）

> **设计原理**：基于"写→诊断→调整"反馈循环。`doc-writer` 完成写作后，主 Agent 使用 `task` 工具调用只读 `doc-analyst` SubAgent 进行质量评估，在独立上下文中完成分析，结果决定是否需要继续迭代。

**步骤 4.1：调用 doc-analyst 进行质量评估**

使用 `task` 工具调用 `doc-analyst` 子代理：

- **description**：文档质量分析
- **subagent_type**：`doc-analyst`
- **prompt**：
  ```
  请对以下文档进行质量分析：{output_file 的绝对路径}
  读取文档，按你的执行流程完成评分，输出你的标准格式报告。
  ```

等待 doc-analyst 返回结构化质量报告。

**步骤 4.2：解析结果并决定下一步**

解析报告中的 `PASS` 字段：

**若 `PASS: true`（总分 ≥ 70）**：
- 继续阶段 5（输出完成摘要），在摘要中附注质量得分

**若 `PASS: false`（总分 < 70）**：

使用 `question` 工具：

- **标题**：文档质量未达标，需要处理
- **问题**：文档质量评分为 {QUALITY_SCORE}（及格线 70 分）。主要问题：{TOP_ISSUES 列表}。请选择下一步：
- **选项**：
  1. 自动改进后继续（AI 根据上述建议优化文档，Recommended）
  2. 接受当前版本（质量不达标，直接完成）
  3. 手动告诉我改进方向

根据选择：
- **选择 1（自动改进）**：将 TOP_ISSUES 组合为反馈，加载 `.opencode/skills/doc-iterate/SKILL.md`，按 Skill 步骤执行改进，完成后回到步骤 4.1 重新评分（最多循环 3 次，超过后自动进入"接受"路径）
- **选择 2（接受）**：继续阶段 5，在摘要中注明"质量得分 {N}/100（低于推荐标准 70 分）"
- **选择 3（手动）**：收集用户指定方向，加载 `.opencode/skills/doc-iterate/SKILL.md`，按 Skill 步骤执行改进，完成后回到步骤 4.1 重新评分

---

### 阶段 5：输出完成摘要

> 此时文档已就绪：单文件模式下 `output_file` 包含完整文档；多文件模式下 `base_dir/` 包含所有子文档和导航入口。

**步骤 5.1：输出完成摘要**

**单文件模式（`creation_mode = single_file`）**：

```
---

文档创建完成！

📄 **文件路径**：`{output_file}`
📊 **文档概况**：共 {N} 个章节，约 {N} 行（来自 doc-writer FILES_CREATED）
🎯 **质量评分**：{QUALITY_SCORE}/100（来自 doc-analyst）

**各章节信心等级**：
{来自 doc-writer CONFIDENCE_TABLE}

**遗留待确认项**（共 {N} 项）：
{来自 doc-writer PENDING_ITEMS，若无则显示"无"}

---

📌 **建议后续操作**：
- 使用 `/iterate {output_file} <反馈>` 进行定向优化
```

**多文件模式（`creation_mode = multi_file`）**：

```
---

文档树创建完成！

📁 **文档目录**：`{base_dir}`
📄 **文件清单**：（来自 doc-tree-fill 完成摘要）

---

📌 **建议后续操作**：
- 查看 `{base_dir}/index.md` 确认导航结构
- 使用 `/evolve` 对文档树进行后续结构调整
```

---

### 阶段 6：更新 docs/index.md

> 将新创建的文档登记到入口文档的文档地图中。
> **docs 结构标准**：`docs/index.md` 是全库导航枢纽，所有新文档必须在此注册（`maedoc/docs-structure-standard.md §2`）。

**步骤 6.1：读取当前 index.md**

读取 `docs/index.md` 的完整内容。若 `docs/index.md` 不存在，使用初始模板创建。

**步骤 6.2：追加到文档地图**

1. 根据文档内容判断应归入哪个分类
2. 若文档地图中已有匹配的分类，在该分类表格末尾追加一行：
   - **单文件模式**：`| [文档标题](./相对路径) | 一句话描述 |`
   - **多文件模式**：`| [文档标题](./{base_dir}/index.md) | 一句话描述（多文档集合，含 N 个子文档）|`
3. 若无匹配分类，创建新的分类标题（H3）并添加条目
4. 更新目录结构树

**步骤 6.3：写回 index.md**

将更新后的内容写回 `docs/index.md`，更新末尾的最后更新时间。

输出：

```
已将 {文档/文档树} 添加到 docs/index.md 文档地图。
```

---

### 阶段 7：TODO 录入（必做）

> 将执行全程心智便签中的改进信号写入全局 TODO 列表，供后续专项处理。**忠实记录真实发现的改进机会，是本次任务执行质量的体现。**

**步骤 1：回顾心智便签，逐条判断以下具体触发线索**

| # | 本次执行的具体线索（对照实际执行回答，而非抽象假设） | 结论 |
|---|---|:---:|
| 1 | 内容填充（阶段 3）中，有无章节因信息不足写了 `[待确认]`/`[假设]`/`[TBD]` 标注？ | 是 / 否 |
| 2 | 某章节的主题在本文档中仅浅覆盖，值得后续单独深化或撰写专题文档？ | 是 / 否 |
| 3 | 注意到现有文档（index.md 外的其他文档）需要更新或同步引用，但本次未处理？ | 是 / 否 |
| 4 | 用户在阶段 0.5 深化探询中提及了本次文档未覆盖的后续意图或关切？ | 是 / 否 |
| 5 | 多文件模式下有子文档内容被简化；或单文件模式下有章节因时间/范围原因降级处理？ | 是 / 否 |

**步骤 2：对每个"是"项执行**（每项单独处理，不可合并省略）

1. 读取 `.opencode/skills/todo-append/SKILL.md`
2. 按 Skill 步骤将事项追加到 `docs/TODO.md`（填写 description/source/priority/background）
3. 在完成摘要中记录编号（如 `已记录 T-005`）

**步骤 3：完成声明（必须出现在完成摘要中，二选一）**

- **有 TODO 记录**：列出所有已记录编号，如 `已记录 T-005, T-006`
- **零 TODO**：对上表 5 条线索，每条用一句话说明本次执行中为何未触发。不可仅写"TODO 扫描：无项"而不解释。

> 提示：多阶段创建任务中，5 条全不触发是少见情况。若某条线索难以简短解释"为何不触发"，往往意味着那里确有值得记录的事项。

---

## 错误处理

| 错误场景 | 处理方式 |
|---------|---------|
| 大纲生成失败（Skill 执行异常） | 提示异常原因，建议补充更多背景信息后重试 |
| `docs/` 目录不存在 | 使用 `question` 工具询问用户是否创建该目录，确认后创建再写入 |
| 文件写入被拒绝（权限） | 提示权限错误，建议检查 `opencode.jsonc` 的 `permission.edit` 配置 |
| 大纲写入文件后用户放弃 | 删除已创建的文件，或保留（由用户选择） |

---

## 流程图

```
/create <描述>
    │
    ▼
[阶段 0] 提取用户描述
    │ 若描述为空 → 使用 question 工具提问 → 收到回答后继续
    ▼
[阶段 0.5] 深化需求探询（持续追问循环）
    │ question 工具提问（末尾保留"已经足够了，开始生成大纲"选项）
    │   ├─ 用户未选终止 → 记录问答 → 推断下一追问 → 继续循环
    │   └─ 用户选终止  → 汇总 enriched_context → 继续
    ▼
[阶段 1] 确定输出文件路径 → 创建 docs/ 目录（如需）→ 判断路径深度 → 记录 output_file + base_dir 候选
    │
    ▼
[阶段 2] task 工具调用 doc-planner SubAgent
    │     → doc-planner 读取 docs/index.md，生成规划报告（OUTLINE + CREATION_MODE + SCALE_EVALUATION）
    │     → 主 Agent 解析报告，将 OUTLINE 写入 output_file
    │
    ▼
[阶段 2.3] 读取 SCALE_EVALUATION"建议形式"
    │   ├─ 多文件文档树 → question（5 选项：多文件推荐/单文件/修改/重新规划/放弃）
    │   │     ├─ 选多文件 → creation_mode = multi_file，记录 tree_plan
    │   │     ├─ 选单文件 → creation_mode = single_file
    │   │     ├─ 修改 → 更新 output_file 中的大纲 → 重新执行 2.3
    │   │     ├─ 重新规划 → 重新调用 doc-planner → 重新执行 2.3
    │   │     └─ 放弃 → 终止
    │   └─ 单文件 → question（4 选项：确认/修改/重新规划/放弃）
    │         ├─ 确认 → creation_mode = single_file
    │         ├─ 修改 → 更新大纲 → 重新执行 2.3
    │         ├─ 重新规划 → 重新调用 doc-planner → 重新执行 2.3
    │         └─ 放弃 → 终止
    ▼
[阶段 3] task 工具调用 doc-writer SubAgent
    │   ├─ single_file → doc-writer 读取 output_file 大纲 → 逐章节填充 → 格式规范化 → 完成报告
    │   └─ multi_file  → 删除临时 output_file → doc-writer 在 base_dir 创建子文档树 + index.md → 完成报告
    │     → 主 Agent 解析 CONFIDENCE_TABLE + PENDING_ITEMS
    ▼
[阶段 4] 质量门检查（必做）
    │ task 工具调用 doc-analyst SubAgent → 等待质量报告
    │   ├─ PASS: true（总分 ≥ 70）→ 继续阶段 5（附注质量得分）
    │   └─ PASS: false（总分 < 70）→ question 工具
    │         ├─ 选择 1（自动改进）→ 加载 doc-iterate Skill → 改进 → 重新评分（最多循环 3 次）
    │         ├─ 选择 2（接受）→ 继续阶段 5（注明低于标准）
    │         └─ 选择 3（手动）→ 收集方向 → 加载 doc-iterate Skill → 改进 → 重新评分
    │
    ▼
[阶段 5] 输出完成摘要
    │   单文件：文件路径 + 行数 + 质量得分 + CONFIDENCE_TABLE + PENDING_ITEMS
    │   多文件：目录 + 文件清单 + 质量得分 + PENDING_ITEMS
    ▼
[阶段 6] 主 Agent 更新 docs/index.md → 追加文档地图条目
    │
    ▼
[阶段 7] TODO 录入（必做）→ 回顾心智便签（含 doc-writer PENDING_ITEMS + WRITER_NOTES）
    │   ├─ 有"是" → 读取 .opencode/skills/todo-append/SKILL.md → 按步骤追加 docs/TODO.md → 摘要列出编号
    │   └─ 零 TODO → 摘要逐条说明 5 条线索为何未触发（不可仅写"无项"）
```

---

## 注意事项

1. **SubAgent 协作**：规划（`doc-planner`）、写作（`doc-writer`）、质量验证（`doc-analyst`）均在独立上下文窗口中运行；主 Agent 负责用户交互、路径管理和 `docs/index.md` 更新
2. **交互优先**：大纲确认等关键决策节点必须等待用户响应，不得跳过
3. **不阻塞原则**：大纲和内容中的未知信息用 `[待确认: ...]` 占位，不因信息缺失而暂停整个流程
4. **权限意识**：写入 `docs/` 目录前，遵循 `opencode.jsonc` 中 `edit` 权限配置；若需要询问，先询问再执行
5. **幂等设计**：若目标文件已存在，不直接覆盖，改用带序号的新文件名，并告知用户
6. **自由结构**：`doc-planner` 根据内容自主判断最合适的文档结构，不依赖预设模板
7. **规模优先**：对于预估超出 300 行的主题，`doc-planner` 会优先建议多文件文档树形式；不强迫用户选择，但会说明单文件的超限风险
8. **临时文件清理**：多文件模式下，阶段 3 开始前删除临时大纲文件（`output_file`），确保 `base_dir` 下的文件是唯一的正式版本
