# 各平台实现策略概览

> **文档类型**：技术方案设计
> **日期**：2026-02-20

---

本系统的跨平台策略是**统一设计理念，因地制宜实现**。各模块在不同平台上使用最适合的技术，通过统一的数据格式和协议实现互通。

---

## 8.1 Windows 平台

**技术栈选择**：

| 模块 | 技术选择 | 理由 |
|------|---------|------|
| 文件系统服务 | Rust | 性能优先，与 Windows API 交互方便 |
| 数据库服务 | Rust + rusqlite | 跨平台一致性 |
| 服务中心 | C# / WinRT | 与 Windows IPC 原生集成 |
| Shell | WinUI 3 | 微软官方推荐，原生体验 |
| 组件容器 | WinUI 3 / WebView2 | 灵活支持多种渲染技术 |

**平台特性利用**：

- **WinRT API**：使用 `Windows.Storage` 管理文件，获取更好的沙箱兼容性
- **COM+**：服务间通信使用 COM 接口，与系统深度集成
- **DirectComposition**：窗口合成使用 DirectComposition，性能最优
- **Notification API**：系统集成通知

**开发环境**：

- Visual Studio 2022 或更高版本
- Windows SDK 10.0.19041 或更高
- Rust MSVC toolchain

---

## 8.2 macOS 平台

**技术栈选择**：

| 模块 | 技术选择 | 理由 |
|------|---------|------|
| 文件系统服务 | Swift | 与 Foundation 框架无缝集成 |
| 数据库服务 | Swift + SQLite.swift | Swift 原生体验 |
| 服务中心 | Swift | XPC 原生支持 |
| Shell | SwiftUI | Apple 官方推荐，声明式 UI |
| 组件容器 | SwiftUI / AppKit | 支持混合渲染 |

**平台特性利用**：

- **XPC**：服务间通信使用 XPC，享受系统级安全隔离
- **Core Animation**：窗口合成使用 CALayer，流畅动画
- **Uniform Type Identifiers (UTI)**：文件类型识别
- **User Notifications**：系统集成通知

**开发环境**：

- Xcode 15 或更高版本
- macOS 14 SDK 或更高
- Swift 5.9 或更高

---

## 8.3 Linux 平台

**技术栈选择**：

| 模块 | 技术选择 | 理由 |
|------|---------|------|
| 文件系统服务 | Rust | 性能优先，inotify 绑定成熟 |
| 数据库服务 | Rust + rusqlite | 与其他平台保持一致 |
| 服务中心 | Rust | D-Bus 绑定质量高 |
| Shell | GTK 4 | Linux 桌面主流选择 |
| 组件容器 | GTK 4 / WebKitGTK | 灵活支持多种渲染技术 |

**平台特性利用**：

- **D-Bus**：服务间通信使用 D-Bus，桌面环境标准
- **inotify**：文件系统监控
- **Wayland / X11**：窗口合成支持两种显示服务器
- **libnotify**：桌面通知

**开发环境**：

- Rust 1.75 或更高
- GTK 4 开发库
- pkg-config

**发行版支持**：

优先支持：Ubuntu 22.04+、Fedora 39+、Arch Linux
理论上支持：所有使用 systemd 和 Wayland/X11 的发行版

---

## 8.4 共享模块

以下模块在所有平台上使用相同实现：

| 模块 | 语言 | 说明 |
|------|------|------|
| UUID 生成 | Rust | 各平台编译相同代码 |
| Sidecar 解析 | Rust | YAML 解析逻辑一致 |
| 数据库 Schema | SQL | SQLite 跨平台兼容 |
| 服务接口定义 | JSON Schema | 协议层统一 |
| MCP Server | Rust | 通过 FFI 被各平台调用 |

---

## 8.5 跨平台测试策略

**单元测试**：

- Rust 模块使用 `cargo test`，在 CI 中跨平台运行
- Swift 模块使用 XCTest
- C# 模块使用 xUnit

**集成测试**：

- 使用共享的测试用例文件（JSON 格式）
- 各平台读取相同测试用例，验证行为一致
- 重点测试：文件路径生成、Sidecar 解析、服务调用

**端到端测试**：

- GUI 自动化测试：Windows 使用 Appium，macOS 使用 XCUITest，Linux 使用 Dogtail
- 测试脚本描述用户操作，验证跨平台行为一致

---

## 8.6 移动端策略 [待确认]

移动端（Android/iOS）的实现策略尚未确定，可能的选项：

1. **仅提供远程访问**：移动端通过 API 访问桌面端数据
2. **轻量级客户端**：移动端实现只读浏览 + 简单编辑
3. **完整移植**：将核心架构移植到移动平台

选择取决于用户需求和技术可行性评估。

---

*本文档是个人数据与能力总线设计系列的一部分。其他相关文档：[核心设计原则](../system-design/core-principles.md)、[组件化 GUI 系统](../infrastructure/component-gui.md)*
