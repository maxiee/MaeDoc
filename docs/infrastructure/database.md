# 数据库系统

> **文档类型**：技术方案设计
> **日期**：2026-02-20

---

数据库系统采用 **SQLite + EAV 架构**，在保证轻量化的同时提供灵活的数据建模能力。所有数据存储在本地，无需网络连接，隐私完全可控。

---

## 4.1 为什么选择 SQLite

SQLite 是嵌入式关系数据库的事实标准，本系统选择它基于以下考量：

- **零配置**：无需安装、无需服务器进程、无需管理员权限
- **跨平台一致**：数据库文件格式在所有平台上完全相同，可直接复制迁移
- **性能足够**：对于个人数据量（百万级记录以内），读写性能远超需求
- **事务支持**：完整的 ACID 特性，确保数据一致性
- **生态成熟**：几乎所有编程语言都有高质量的 SQLite 绑定

**限制与应对**：

- **并发写入**：SQLite 不支持高并发写入，但个人使用场景下写入频率有限，WAL 模式足以应对
- **单文件限制**：理论上单文件最大 140 TB，实际使用不会触及

---

## 4.2 EAV 架构设计

实体-属性-值（Entity-Attribute-Value，EAV）架构允许动态扩展实体属性，适应个人数据的多样性。

**核心表结构**：

```sql
-- 实体表：所有实体的基表
CREATE TABLE entities (
    id TEXT PRIMARY KEY,              -- UUID
    type TEXT NOT NULL,               -- 实体类型：file、note、task、project 等
    created_at TEXT NOT NULL,         -- ISO 8601 时间戳
    updated_at TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0      -- 软删除标记
);

-- 属性定义表：所有可用的属性
CREATE TABLE attributes (
    id TEXT PRIMARY KEY,              -- UUID
    name TEXT NOT NULL UNIQUE,        -- 属性名：priority、due_date、tags 等
    data_type TEXT NOT NULL,          -- 数据类型：string、number、boolean、datetime、json
    applies_to TEXT,                  -- 适用的实体类型（NULL 表示通用）
    validation_rules TEXT             -- JSON 格式的校验规则
);

-- 值表：存储实体的属性值
CREATE TABLE values (
    entity_id TEXT NOT NULL,          -- 关联实体
    attribute_id TEXT NOT NULL,       -- 关联属性
    value_text TEXT,                  -- 字符串值
    value_number REAL,                -- 数值
    value_boolean INTEGER,            -- 布尔值
    value_datetime TEXT,              -- 日期时间
    value_json TEXT,                  -- JSON 复杂值
    PRIMARY KEY (entity_id, attribute_id),
    FOREIGN KEY (entity_id) REFERENCES entities(id),
    FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);
```

**查询优化**：

EAV 架构的痛点是复杂查询性能差。本系统通过以下策略优化：

- **物化视图**：对高频查询模式，自动生成物化视图
- **全文索引**：集成 SQLite FTS5 扩展，支持全文搜索
- **缓存层**：热点数据缓存在内存中，减少数据库访问

---

## 4.3 与文件系统的联动

数据库是文件元信息的镜像和扩展，两者保持双向同步：

**Sidecar → 数据库**：

1. 文件创建或 Sidecar 更新时，触发同步任务
2. 解析 frontmatter 中的结构化字段
3. 写入 `entities` 表（类型为 `file`）和 `values` 表

**数据库 → Sidecar**：

1. 用户通过 UI 或 API 修改元信息时，更新数据库
2. 异步任务将变更写回 Sidecar 文件的 frontmatter
3. 保留用户在 Sidecar 正文中编辑的自由格式内容

**冲突处理**：

- 以 Sidecar 为准：当检测到冲突时，优先采用 Sidecar 中的值
- 记录审计日志：所有变更操作记录时间戳和来源，便于追溯

---

## 4.4 数据迁移与版本控制

**Schema 版本控制**：

数据库包含 `schema_version` 表，记录每次 Schema 变更：

```sql
CREATE TABLE schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL,
    description TEXT
);
```

迁移脚本存放在 `migrations/` 目录，按版本号命名（如 `001_initial.sql`、`002_add_tags.sql`）。启动时自动检测并执行未应用的迁移。

**备份策略**：

- **自动备份**：每次关闭时创建增量备份，保留最近 7 天
- **手动导出**：支持导出为 SQL 脚本或 JSON 格式
- **云同步可选**：用户可选择将数据库文件放入云同步目录（如 iCloud、Dropbox）

---

## 4.5 隐私与安全

- **本地优先**：所有数据存储在本地，无需联网即可使用
- **无遥测**：系统不收集任何使用数据
- **加密可选**：支持对敏感属性值进行加密存储（使用用户提供的密钥）
- **访问日志**：所有数据访问操作记录审计日志，用户可查看

---

*本文档是个人数据与能力总线设计系列的一部分。其他相关文档：[文件存储系统](./file-storage.md)、[基础设施概述](./overview.md)*
