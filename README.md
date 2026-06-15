# YanCe Policy Agent

> **This project is not an investment advisory, trading, or financial market analysis tool.**
> **It only focuses on industrial policy matching and park enterprise service workflows.**

**YanCe Policy Agent** (衍策政策 Agent) 是面向园区公司的政策服务 Agent，为产业园区、孵化器、众创空间和产业服务机构提供政策问答、企业画像、资源匹配、材料清单、申报进度和企业服务工作台。

**官网**: yance.ai
**公司**: 上海衍策引擎人工智能科技有限公司

---

## 核心定位

**一句话**: 为园区公司提供政策问答、企业画像、资源匹配、材料清单和企业服务工作台。

**核心品牌句**: 政策复杂，但园区服务可以更清楚。

**主要客户**: 园区公司、产业园区运营方、科创园区、孵化器、众创空间、招商运营公司、政企服务公司、创业服务平台、产业服务机构。

---

## 产品模块

| 模块 | 名称 | 功能 |
|------|------|------|
| PolicyCopilot | 政策问答与引用溯源 | 政策检索、智能问答、来源引用、有效期提醒 |
| CompanyProfile | 园区企业画像 | 企业信息录入、分层管理、需求分析 |
| SubsidyMatch | 政策资源匹配 | 多维度匹配、优先级排序、风险提示 |
| BriefMaker | 材料清单与简报生成 | 材料缺口识别、清单生成、服务简报 |
| ParkOps | 园区服务运营工作台 | 服务工单、运营报告、服务商协同 |

---

## 项目结构

```
yance-policy-agent/
├── README.md                          # 本文件
├── docs/                              # 项目文档（14份）
│   ├── 00-project-overview.md         # 项目概览
│   ├── 01-roadshow-pitch-outline.md   # 路演PPT大纲
│   ├── 02-one-pager.md               # 一页纸概要
│   ├── 03-judge-qa.md                # 评委问答（35题）
│   ├── 04-product-manual.md          # 产品说明书
│   ├── 05-business-model.md          # 商业模式
│   ├── 06-pricing.md                 # 定价方案
│   ├── 07-demo-script.md             # 演示脚本
│   ├── 08-video-script.md            # 视频脚本
│   ├── 09-poster-copy.md             # 海报文案
│   ├── 10-music-prompts.md           # 音乐提示词
│   ├── 11-roadshow-day-runbook.md    # 路演当天流程
│   ├── 12-xuhui-pilot-plan.md        # 徐汇试点计划
│   └── 13-non-financial-boundary.md  # 非金融边界说明
├── website/                           # Next.js 官网
├── saas-demo/                         # Streamlit SaaS Demo
├── ai-policy-demo/                    # GitHub 开源 Demo
├── chrome-extension/                  # Chrome 浏览器插件
├── miniapp-prototype/                 # 微信小程序原型
├── mac-app-prototype/                 # Mac 桌面端原型
└── asset-prompts/                     # 设计素材提示词
```

---

## 快速开始

### 官网 (Next.js)

```bash
cd website
npm install
npm run dev
# 访问 http://localhost:3000
```

### SaaS Demo (Streamlit)

```bash
cd saas-demo
pip install -r requirements.txt
streamlit run app.py
# 访问 http://localhost:8501
```

### GitHub Demo (Python CLI)

```bash
cd ai-policy-demo
pip install -r requirements.txt
python main.py
```

### 运行测试

```bash
cd ai-policy-demo
python -m pytest tests/ -v
```

### Mac 桌面端原型

```bash
cd mac-app-prototype
pip install -r requirements.txt
python main.py
```

### Chrome 插件

1. 打开 Chrome 浏览器
2. 地址栏输入 `chrome://extensions`
3. 打开右上角 Developer Mode
4. 点击 "Load unpacked"
5. 选择 `chrome-extension` 文件夹

### 小程序原型

小程序原型位于 `miniapp-prototype/` 目录，需要在微信开发者工具中打开预览。

---

## 技术栈

| 子项目 | 技术 |
|--------|------|
| 官网 | Next.js 14, TypeScript, CSS Modules |
| SaaS Demo | Python, Streamlit, Pandas |
| GitHub Demo | Python, pytest |
| Chrome 插件 | JavaScript, Manifest V3 |
| 桌面端 | Python, Tkinter |
| 小程序 | 微信小程序原生框架 |

---

## 非金融边界

本项目严格限定在产业政策、园区企业服务领域：

- **不做**: 股票、基金、ETF、期货、期权、加密资产、二级市场交易、量化投资、金融投研
- **只做**: 政策问答、企业画像、政策匹配、材料清单、服务工单、园区运营报告
- **融资相关内容**: 仅限于园区企业融资服务、创业贷款、科技信贷、担保服务、政策性金融资源对接
- **所有政策建议必须人工复核，不构成申报成功承诺**

详见 [docs/13-non-financial-boundary.md](docs/13-non-financial-boundary.md)

---

## 路线图

| 阶段 | 时间 | 目标 |
|------|------|------|
| MVP | 2025 Q3 | 政策库 + 企业画像 + 基础匹配 |
| 试点 | 2025 Q4 | 徐汇/漕河泾 3 个月样板验证 |
| V1.0 | 2026 Q1 | 完整 5 模块 + SaaS 订阅 |
| 规模化 | 2026 Q2+ | 多城市扩展 + 服务商网络 |

---

## 许可证

Copyright (c) 2025 上海衍策引擎人工智能科技有限公司. All rights reserved.

---

## 联系

- 邮箱: contact@yance.ai
- 官网: yance.ai
- 地址: 上海市徐汇区
