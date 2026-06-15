# YanCe Policy Agent Desktop

园区政策分析助手 Mac 桌面应用原型，基于 Python tkinter 构建，无需额外依赖。

> 官网：[yance.ai](https://yance.ai)

## 功能特性

- **企业信息录入** — 填写园区名称、企业名称、区域、行业等基本信息
- **需求多选** — 支持勾选企业当前需求（创业补贴、场地补贴、算力券、高企认定等）
- **政策文件导入** — 支持导入本地政策文件（.txt / .pdf / .docx / .md）
- **报告生成** — 自动生成包含14个板块的完整政策服务报告，含 yance.ai 品牌标识
- **报告导出** — 一键保存为 Markdown 文件，支持 PDF 导出（需安装 reportlab）
- **启动画面** — 现代化 Splash 启动屏，展示品牌 Logo 与 yance.ai 标识
- **暗色主题** — 深蓝 (#0d1b2a) + 青色 (#0ea5e9) + 珊瑚色 (#f97316) 专业配色
- **菜单栏** — 完整的文件、编辑、帮助菜单，含「打开 yance.ai」快捷入口
- **关于对话框** — 版本信息 (v1.0.0) 与 yance.ai 链接

## 截图

![截图占位](screenshot.png)

> 截图待补充

## 系统要求

- macOS 10.15+ (Catalina 或更高)
- Python 3.8+
- tkinter（Python 标准库自带）
- reportlab（可选，用于 PDF 导出）

## macOS 安装与运行

### 1. 安装 Python 环境

macOS 自带 Python 3，也可通过 Homebrew 安装最新版本：

```bash
# 使用 Homebrew 安装（推荐）
brew install python@3.12

# 确认版本
python3 --version
# 确保版本 >= 3.8
```

### 2. 安装可选依赖（PDF 导出）

```bash
pip3 install reportlab
```

### 3. 运行应用

```bash
cd mac-app-prototype
python3 main.py
```

应用将先显示启动画面（约 2 秒），然后自动打开主窗口。

### 4. 使用流程

1. 在左侧面板填写园区和企业信息
2. 选择区域和行业
3. 勾选企业当前需求
4. （可选）导入政策文件
5. 点击「生成报告」
6. 在右侧预览报告内容
7. 点击「保存报告」导出为 Markdown，或「导出 PDF」生成 PDF 文件

## 打包为 .app

使用 PyInstaller 将应用打包为独立 Mac 应用：

### 安装 PyInstaller

```bash
pip3 install pyinstaller
```

### 打包命令

```bash
pyinstaller --windowed --name "YanCe Policy Agent Desktop" --icon icon.icns main.py
```

详细打包步骤参见 `build_mac_app.md`。

## 目录结构

```
mac-app-prototype/
├── main.py              # 主应用文件
├── requirements.txt     # 依赖说明
├── README.md            # 本文件
├── build_mac_app.md     # 详细打包指南
├── installer-notes.md   # 分发与安装说明
└── screenshot.png       # 应用截图（待补充）
```

## 技术栈

- Python 3.8+
- tkinter / ttk（标准库 GUI 框架）
- reportlab（PDF 导出，可选）
- PyInstaller（打包工具，可选）

## 开发计划

- [ ] 接入 AI 大模型 API 实现真实政策分析
- [ ] 支持 PDF 文件解析
- [ ] 报告模板自定义
- [ ] 历史报告管理
- [ ] 政策数据库本地缓存
- [ ] 多园区切换
- [ ] 数据导入/导出（CSV / Excel）
- [ ] 自动更新功能

## 免责声明

本工具生成的分析报告仅供参考，具体政策信息以官方发布为准。请结合实际情况进行核实确认。

---

&copy; 2025 YanCe Policy Agent | [yance.ai](https://yance.ai)
