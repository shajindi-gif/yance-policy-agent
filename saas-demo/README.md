> **声明 / Disclaimer**
> 本系统仅服务于产业园区政策申报与企业服务场景，**不涉及任何金融投资、股票、基金、ETF、证券交易内容**。
> This system is exclusively for industrial park policy matching and enterprise services. **No financial investment, stocks, ETFs, trading, or securities content is included.**

---

# 研策政策智能体 · 园区服务 SaaS 演示

## YanCe Policy Agent — Park Service SaaS Demo

面向产业园区服务人员的政策匹配与企业服务辅助平台。帮助园区服务团队完成：**选园区 → 录入企业 → 匹配政策 → 生成材料清单 → 创建服务工单 → 输出园区服务报告** 全流程。

A policy matching and enterprise service platform for industrial park service staff. Supports the full workflow: **Select Park → Enter Company → Match Policies → Generate Material List → Create Service Ticket → Output Park Service Report**.

---

## 适用场景 / Use Cases

| 场景 | 说明 |
|------|------|
| 园区日常服务 | 服务人员快速了解园区企业政策申报机会 |
| 政策精准匹配 | 根据企业画像自动匹配适用政策 |
| 材料预审 | 生成申报材料清单与缺口分析 |
| 工单派发 | 将服务任务分派给第三方服务商 |
| 园区报告 | 生成完整的园区政策服务报告 |

---

## 功能列表 / Features

- 🏢 **园区工作台** — 园区总览、关键指标卡片、本周服务推荐
- 📝 **企业录入** — 结构化录入企业画像，支持预填示例数据
- 🔍 **政策匹配** — 规则引擎匹配，颜色标注匹配度（高/中/低）
- 📋 **材料清单** — 申报材料生成与缺口分析
- 🎫 **服务工单** — 按优先级生成工单，支持分配服务商
- 📊 **服务报告** — 完整14节园区服务报告，支持 Markdown 导出

---

## 快速开始 / Quick Start

```bash
# 1. 进入项目目录
cd ~/QoderProjects/yance-policy-agent/saas-demo

# 2. 创建虚拟环境（可选）
python -m venv venv
source venv/bin/activate  # macOS/Linux

# 3. 安装依赖
pip install -r requirements.txt

# 4. 启动应用
streamlit run app.py
```

---

## 示例输入 / Sample Input

**企业画像示例：**
- 企业名称：上海星辰人工智能科技有限公司
- 所在园区：漕河泾新兴技术开发区
- 行业：人工智能
- 成立年份：2021年
- 员工数：45人
- 营收阶段：初创期（<500万）
- 知识产权：已申请专利3项

**匹配结果示例：**
- 高新技术企业认定（匹配度 92%）
- 科技型中小企业评价（匹配度 88%）
- 上海市人工智能算力券（匹配度 85%）

---

## 示例输出 / Sample Output

完整的园区服务报告示例见：[outputs/sample_park_policy_report.md](outputs/sample_park_policy_report.md)

---

## 技术栈 / Tech Stack

| 组件 | 技术 |
|------|------|
| 前端框架 | Streamlit |
| 数据处理 | Pandas |
| AI 接口（预留）| OpenAI API |
| 数据存储 | CSV 本地文件（演示用）|

---

## 数据说明 / Data Notes

- `data/parks_sample.csv` — 园区基础数据（3-5个园区）
- `data/companies_sample.csv` — 企业画像数据（5-8家企业）
- `data/policies_sample.csv` — 政策库（10-15条政策）
- `data/service_providers_sample.csv` — 服务商数据（5-8家）

---

## 非金融边界声明 / Non-Financial Boundary Statement

本系统 **严格限定** 于产业园区政策申报与企业服务领域：

- ✅ 产业政策匹配
- ✅ 园区企业服务
- ✅ 申报材料管理
- ✅ 服务工单派发
- ❌ **不涉及** 金融投资建议
- ❌ **不涉及** 股票、基金、ETF、证券分析
- ❌ **不涉及** 任何交易决策支持
