# YanCe Policy Agent - 微信小程序原型

YanCe Policy Agent 微信小程序，帮助园区工作人员在移动端高效完成政策分析与企业服务。

> 官网：[yance.ai](https://yance.ai)

## 功能概述

### 首页（index）
- 品牌展示：YanCe Policy Agent + yance.ai 标识
- 快捷操作入口：生成政策服务建议、政策匹配、服务报告、政策库（改进为横向列表卡片设计）
- 园区选择器（支持切换园区）
- 园区概览统计（入驻企业数、服务记录数、匹配进度）
- 最近服务记录列表

### 园区工作台（park）
- 骨架屏加载动画（Skeleton Screen）
- 园区概览面板（企业数、服务记录、匹配进度、待处理数）
- 快捷操作：企业录入、政策匹配、服务工单、运营报告
- 服务工单列表（含紧急度标记和状态标签）
- 最近动态时间线

### 企业录入（company）
- 骨架屏加载动画
- 完整的企业信息录入表单
- 基本信息：企业名称、联系人、电话、区域、行业、类型
- 需求多选：创业补贴、场地补贴、算力券、模型券、高企认定等12项
- 已有资质认定：高新技术企业、专精特新、科技型中小企业等
- 经营数据：知识产权数量、研发投入占比、年度营收
- 企业简介文本
- 支持一键填入示例数据（便于演示）
- 表单验证与提交

### 政策匹配（match）
- 改进的匹配进度动画（脉冲环 + 分步进度显示）
- 匹配结果概览（综合评分、高/中/低匹配分布）
- 匹配政策列表（可展开查看详情）
  - 匹配分数
  - 政策级别（国家级/市级/区级/园区级）
  - 申报窗口和当前状态
  - 申报条件符合度（已满足/待核实）
  - 缺少的材料
- 材料缺口清单（含优先级和建议）
- 一键生成完整服务报告

### 服务报告（report）
- 完整的14个板块政策服务报告
- yance.ai 品牌标识在报告头部
- 报告目录导航
- 分享按钮（分享）
- 导出选项（Markdown / 分享 / 打印）
- yance.ai 品牌标识在报告底部

### 我的（mine）
- 用户信息展示与登录
- 使用统计（报告数、企业数、匹配数、服务天数）
- 快捷设置（自动同步、推送通知）
- 菜单分组：数据管理、设置、关于
- 关于对话框显示版本 v1.0.0 和 yance.ai 链接
- 页脚显示 yance.ai 品牌信息

## 开发环境

### 前置要求

- 微信开发者工具（[下载地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)）
- 微信小程序 AppID（可在 [mp.weixin.qq.com](https://mp.weixin.qq.com/) 申请，也可使用测试号）

### 开发步骤

1. 下载并安装微信开发者工具
2. 打开开发者工具，选择「导入项目」
3. 选择 `miniapp-prototype` 目录作为项目目录
4. 填写 AppID（可使用测试号或自己的 AppID）
5. 点击「确定」导入项目

### 预览与调试

- **模拟器预览**：导入后自动在模拟器中显示
- **真机预览**：点击工具栏「预览」按钮，用微信扫码查看
- **调试**：使用开发者工具内置的调试器和 Console

### 项目结构

```
miniapp-prototype/
├── app.json                  # 小程序全局配置
├── app.js                    # 小程序全局逻辑
├── app.wxss                  # 全局样式
├── sitemap.json              # 搜索配置
├── assets/                   # 静态资源（图标等）
│   ├── tab-home.png
│   ├── tab-home-active.png
│   ├── tab-park.png
│   ├── tab-park-active.png
│   ├── tab-mine.png
│   └── tab-mine-active.png
├── pages/
│   ├── index/                # 首页
│   │   ├── index.js
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   └── index.json
│   ├── park/                 # 园区工作台
│   │   ├── park.js
│   │   ├── park.wxml
│   │   ├── park.wxss
│   │   └── park.json
│   ├── company/              # 企业录入
│   │   ├── company.js
│   │   ├── company.wxml
│   │   ├── company.wxss
│   │   └── company.json
│   ├── match/                # 政策匹配
│   │   ├── match.js
│   │   ├── match.wxml
│   │   ├── match.wxss
│   │   └── match.json
│   ├── report/               # 服务报告
│   │   ├── report.js
│   │   ├── report.wxml
│   │   ├── report.wxss
│   │   └── report.json
│   └── mine/                 # 我的
│       ├── mine.js
│       ├── mine.wxml
│       ├── mine.wxss
│       └── mine.json
└── README.md                 # 本文件
```

## 技术说明

- **纯前端原型**：当前版本使用 Mock 数据，无需后端服务
- **全局状态管理**：通过 `app.globalData` 管理园区、企业、服务记录等状态
- **本地缓存**：使用 `wx.setStorageSync` 持久化关键数据
- **组件化样式**：全局样式 (`app.wxss`) 定义通用组件类，各页面按需使用
- **TabBar**：底部导航包含首页、园区、我的三个标签页
- **骨架屏**：园区工作台和企业录入页面使用骨架屏加载效果
- **匹配动画**：政策匹配页面使用脉冲环 + 分步进度动画

## 设计规范

- **配色**：Navy (#0d1b2a) + Teal (#0ea5e9) + Coral (#f97316) + 白色背景
- **字体**：PingFang SC / Helvetica Neue / Microsoft YaHei
- **圆角**：卡片 16rpx，按钮 12rpx，标签 20rpx
- **阴影**：轻微投影 `0 2rpx 12rpx rgba(0,0,0,0.04)`
- **品牌色**：Teal 为主强调色，Coral 为次强调色（分享按钮、品牌标识等）

## 开发计划

- [ ] 接入 AI 大模型 API 实现真实政策分析
- [ ] 后端服务与数据库集成
- [ ] 用户登录与权限管理
- [ ] 报告云端存储与历史管理
- [ ] 政策库在线更新
- [ ] 团队协作功能
- [ ] 数据可视化图表
- [ ] 消息推送与订阅

## 免责声明

本工具生成的分析内容仅供参考，具体政策信息以官方发布为准。请结合实际情况进行核实确认。

---

&copy; 2025 YanCe Policy Agent | [yance.ai](https://yance.ai)
