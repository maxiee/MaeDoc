---
name: quality-gate
description: 可复用的质量门循环——调用 doc-analyst SubAgent 评估文档质量，若未通过（<70 分）则引导自动改进或用户手动干预，最多循环 3 次。由 /create 和 /iterate 共享调用。
mode: read-only
---

# quality-gate

> **Skill ID**：`quality-gate`
> **版本**：1.0.0
> **类型**：instruction（嵌入 Command 流程的可复用逻辑）
> **用途**：在文档写作或迭代后执行质量门检查，确保输出达到基准质量

---

## 输入

调用方 Command 在流程中提供：
- `target_file`：待评估的文档绝对路径（单文件模式用 `output_file`，多文件模式用 `base_dir/index.md`）

---

## 执行步骤

### 步骤 1：调用 doc-analyst 进行质量评估

使用 `task` 工具调用 `doc-analyst` SubAgent：

- **description**：文档质量分析
- **subagent_type**：`doc-analyst`
- **prompt**：
  ```
  请对以下文档进行质量分析：{target_file 的绝对路径}
  读取文档，按你的执行流程完成评分，输出你的标准格式报告。
  ```

等待返回结构化质量报告。

### 步骤 2：解析结果并决定下一步

解析报告中的 `PASS` 字段：

**若 `PASS: true`（总分 >= 70）**：
- 质量门通过，继续后续流程，附注质量得分

**若 `PASS: false`（总分 < 70）**：

使用 `question` 工具：

- **标题**：文档质量未达标
- **问题**：文档质量评分为 {QUALITY_SCORE}（及格线 70 分）。主要问题：{TOP_ISSUES}。请选择：
- **选项**：
  1. 自动改进后继续（Recommended）
  2. 接受当前版本
  3. 手动告诉我改进方向

根据选择：
- **选择 1（自动改进）**：将 TOP_ISSUES 组合为反馈，加载 `.opencode/skills/doc-iterate/SKILL.md` 执行改进，回到步骤 1 重新评分（**最多循环 3 次**，超过后自动进入"接受"路径）
- **选择 2（接受）**：继续后续流程，注明"质量得分 {N}/100（低于推荐标准 70 分）"
- **选择 3（手动）**：收集用户方向，加载 doc-iterate Skill 改进，回到步骤 1 重新评分
