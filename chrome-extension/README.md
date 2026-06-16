# YanCe Policy Agent - Chrome Extension

yance.ai 园区政策分析助手 Chrome 浏览器扩展 v1.0.0 -- 帮助园区工作人员在浏览政策网页时，一键提取政策要点并生成 ParkOps 服务工单。

## 功能特性

- **政策页面自动分析** -- 打开任意政策网页，点击按钮即可自动检测并提取结构化政策信息
- **政府网站识别** -- 自动识别政府官网页面（gov.cn 等），智能判断政策类内容
- **结构化 6 字段提取** -- 政策名称、发文机构、适用行业、补贴金额/范围、申报期限、材料要求
- **ParkOps 服务工单** -- 一键将分析结果格式化为 ParkOps 服务工单，复制到剪贴板粘贴
- **Dashboard 跳转** -- 一键打开 yance.ai 管理平台
- **Navy/Teal/Coral 主题** -- 深色主题设计，与 yance.ai 品牌一致

## 安装方法

### 开发者模式加载

1. 下载或克隆本仓库到本地
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的「开发者模式」开关
4. 点击「加载已解压的扩展程序」
5. 选择 `chrome-extension` 目录
6. 扩展图标将出现在浏览器工具栏

> 需要 `icons/` 目录下的图标文件（icon16.png、icon48.png、icon128.png）。

## 使用方法

1. 在浏览器中打开任意政策网页（如政府官网政策文件、通知公告等）
2. 点击浏览器工具栏中的 YanCe Policy Agent 图标
3. 在弹出窗口中点击「分析当前页面政策」按钮
4. 等待分析完成，查看结构化分析结果
5. 点击「复制到 ParkOps」将分析结果复制为服务工单格式，粘贴到 ParkOps 系统
6. 点击「打开 Dashboard」跳转到 yance.ai 管理平台

## 技术说明

- **Manifest V3** -- 使用最新的 Chrome 扩展标准
- **纯前端实现** -- 无需后端服务，本地运行
- **最小权限** -- 仅请求 `activeTab` 和 `scripting` 权限
- **智能检测** -- 自动识别政府网站 URL 模式和政策关键词
- **结构化提取** -- 返回 6 个标准字段：policy_name, issuing_authority, target_industry, subsidy_amount, application_deadline, material_requirements

## 目录结构

```
chrome-extension/
  manifest.json       # 扩展配置文件 (Manifest V3, v1.0.0)
  popup.html          # 弹出窗口页面
  popup.js            # 弹出窗口逻辑（分析、渲染、ParkOps 工单）
  styles.css          # 样式文件（Navy/Teal/Coral 主题）
  icons/              # 扩展图标目录
    icon16.png
    icon48.png
    icon128.png
  README.md           # 本文件
```

## 配色方案

| 色彩 | 色值 | 用途 |
|------|------|------|
| Navy | `#0d1b2a` | 主背景 |
| Navy Light | `#1b2d45` | 卡片/面板背景 |
| Teal | `#0ea5e9` | 主强调色（按钮、标签） |
| Coral | `#f97316` | CTA / ParkOps 按钮 |
| Green | `#34d399` | 高亮（补贴金额） |

## 免责声明

本插件为辅助工具，政策建议需经人工复核。生成的分析内容仅供参考，具体政策信息以官方原文为准。

---

&copy; 2025 YanCe Policy Agent | [yance.ai](https://yance.ai)
