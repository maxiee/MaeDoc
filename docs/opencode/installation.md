# OpenCode 安装指南

> **所属系列**：[OpenCode 使用指南](./index.md)
> **最后更新**：2026-02-22

---

## 下载地址

官方下载页面：**[https://opencode.ai/download](https://opencode.ai/download)**

支持平台：
- Windows
- macOS
- Linux

---

## 安装方式

### 方式一：桌面端（推荐新手）

桌面端提供图形化界面，操作直观简单。

**Windows**：
1. 下载 `.exe` 安装包
2. 双击运行安装程序
3. 安装完成后，目录下会有 3 个程序：
   - `OpenCode.exe` — 桌面端程序（带界面）
   - `OpenCode-cli.exe` — 命令行模式（TUI）
   - `uninstall.exe` — 卸载程序

**界面特点**：
- 清爽简洁的图形界面
- 支持所有命令行功能
- 图形化模式切换和模型选择

### 方式二：命令行（推荐进阶用户）

**macOS / Linux**：

```bash
# 官方安装脚本
curl -fsSL https://opencode.ai/install.sh | sh

# 或通过 npm
npm install -g opencode
```

**命令行优势**：
- 更轻量，启动更快
- 适合服务器/远程开发环境
- 可集成到脚本和自动化流程

---

## 启动 OpenCode

### 桌面端启动

双击 `OpenCode.exe`（Windows）或应用程序图标（macOS）。

### 命令行启动

在终端中进入你的项目目录，运行：

```bash
opencode
```

或直接运行 CLI 程序：

```bash
# Windows
OpenCode-cli.exe

# macOS/Linux
opencode
```

---

## 首次配置

启动后，OpenCode 会引导你完成基本配置：

1. **选择模型**：使用 `/models` 查看可用模型
2. **连接 API**：使用 `/connect` 添加你的 API Key
3. **加载 Skills**（可选）：将 Skills 放入 `.opencode/skills/` 目录

---

## 目录结构

安装完成后，OpenCode 会在以下位置创建配置文件：

| 平台 | 全局配置路径 |
|------|-------------|
| Windows | `C:\Users\<用户名>\.config\opencode\` |
| macOS | `~/.config/opencode/` |
| Linux | `~/.config/opencode/` |

详见 [环境变量配置](./environment-variables.md)。

---

*本文档由 `/evolve` 命令生成，知识来源：技术文章《全网都在刷的 AI Skills 怎么用》，最后更新：2026-02-22*
