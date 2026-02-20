# .docforge 远程桥接工作区

当本地模型能力遇到瓶颈时，通过文件中继将任务桥接到更强大的外部 AI（Claude.ai、ChatGPT 等）。整个流程基于 markdown 文件，不依赖任何 API 调用。

## 工作流

```
本地文档
    │
    ▼
/escalate                          ← 打包文档上下文 + 问题
    │
    ▼
outbox/{timestamp}-{slug}.md       ← 生成中继文件
    │
    │  手动步骤：打开文件 → 复制全文 → 粘贴到外部 AI
    │
    ▼
inbox/{timestamp}-{slug}.md        ← 将外部 AI 的回答保存到此处
    │
    ▼
/ingest-remote {slug}              ← 读取回答，引导应用到文档
    │
    ▼
文档更新完成
```

## 目录说明

| 目录 | 用途 |
|------|------|
| `outbox/` | 存放 `/escalate` 生成的中继文件（待发给外部 AI 的提示词包） |
| `inbox/` | 存放用户从外部 AI 获取的回答（供 `/ingest-remote` 读取） |

## 文件命名规范

```
{YYYYMMDD-HHMMSS}-{slug}.md
```

示例：
- `20250220-143022-cap-theorem.md`
- `20250221-091500-security-section-review.md`

**规则**：
- `{YYYYMMDD-HHMMSS}`：文件创建时间（本地时间，24小时制）
- `{slug}`：主题的短标识，仅含小写字母、数字、连字符，不超过 40 字符
- outbox 和 inbox 中对应同一次交互的文件应使用**相同文件名**

## gitignore 规则

outbox 和 inbox 中的 `.md` 文件为运行时数据，**不纳入版本控制**：

```
.docforge/outbox/*.md
.docforge/inbox/*.md
```

`.gitkeep` 占位文件会保留，确保目录结构进入 git 仓库。

## 快速上手

1. 对某篇文档有疑难问题时，运行：
   ```
   /escalate docs/my-doc.md 你的问题描述
   ```

2. 打开 `outbox/` 中生成的 `.md` 文件，复制全部内容

3. 粘贴到外部 AI（Claude.ai / ChatGPT / Gemini 等），获取回答

4. 将回答保存为 `inbox/{相同文件名}.md`

5. 运行：
   ```
   /ingest-remote {slug}
   ```
   根据引导将外部 AI 的建议应用到文档中
