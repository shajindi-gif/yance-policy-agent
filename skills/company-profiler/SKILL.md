---
name: company-profiler
description: 园区企业画像 - 结构化录入企业信息，自动构建画像卡片，支持标签分层。触发词：企业画像、企业录入、企业信息、公司档案。
version: 1.0.0
---

# 园区企业画像 (Company Profiler)

结构化录入企业信息，自动构建画像卡片，支持多维度标签分层，并推荐关联政策。

> **非金融声明 (Non-Financial Boundary)**
> 本技能仅用于企业信息结构化录入与画像构建，**不提供企业估值、投资建议或融资方案**。
> 如涉及资产评估、信用评级等专业领域，请提示用户咨询持牌专业机构。

## 触发条件

当用户输入包含以下意图时激活本技能：
- "帮我做企业画像"、"录入企业信息"、"企业画像"
- "企业录入"、"公司信息"、"公司档案"、"建立企业档案"

## 输入参数 (Input Schema)

### 基础信息 (Basic Info)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| company_name | string | 是 | 企业全称 |
| unified_credit_code | string | 是 | 统一社会信用代码（18位） |
| industry | string | 是 | 行业分类（GB/T 4754） |
| registered_capital | string | 否 | 注册资本 |
| established_date | date | 否 | 成立日期 |
| region | string | 是 | 注册地（省-市-区） |
| address | string | 否 | 详细经营地址 |
| legal_representative | string | 否 | 法定代表人 |

### 经营信息 (Business Info)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| employee_count | int | 是 | 在职员工数 |
| revenue_last_year | float | 否 | 上年度营收（万元） |
| profit_last_year | float | 否 | 上年度净利润（万元） |
| stage | enum | 是 | 发展阶段 |
| main_products | list[string] | 否 | 主要产品/服务 |

### 创新信息 (Innovation Info)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| patents | int | 否 | 发明专利数 |
| utility_models | int | 否 | 实用新型专利数 |
| copyrights | int | 否 | 软件著作权数 |
| trademarks | int | 否 | 注册商标数 |
| rd_investment_ratio | float | 否 | 研发投入占比（%） |
| certifications | list[string] | 否 | 已获资质（如：高新技术企业、专精特新等） |

## 执行步骤 (Steps)

1. **信息收集** — 按上述 Schema 逐项收集，必填字段缺失时主动追问
2. **数据校验** — 校验统一社会信用代码格式、日期合法性、数值范围
3. **标签分层** — 自动为企业打标签（见标签体系）
4. **画像卡片生成** — 输出结构化画像卡片
5. **政策初推荐** — 根据画像标签，推荐 2-3 条可能匹配的政策方向
6. **归档确认** — 向用户确认画像信息，提示可修改字段

## 标签体系 (Tag System)

自动根据企业数据生成分层标签：

- **行业标签**: 电子信息 / 生物医药 / 高端装备 / 新材料 / 新能源 / 现代服务 / ...
- **规模标签**: 微型(< 20人) / 小型(20-99) / 中型(100-499) / 大型(500+)
- **阶段标签**: 种子期 / 初创期 / 成长期 / 成熟期
- **创新标签**: 无IP / 基础IP / 高IP(p>=5) / 高研发(rd>=5%)
- **资质标签**: 无资质 / 科技型中小 / 高新技术企业 / 专精特新 / 小巨人
- **园区标签**: 园区入驻 / 非园区

## 输出格式 (Output Schema)

```yaml
company_profile:
  basic:
    company_name: "XX科技有限公司"
    unified_credit_code: "91310000XXXXXXXXXX"
    industry: "软件和信息技术服务业"
    region: "上海市-浦东新区"
    established_date: "2018-03-15"
  business:
    employee_count: 85
    stage: "成长期"
    revenue_last_year: "3200万"
  innovation:
    patents: 8
    copyrights: 15
    rd_investment_ratio: "6.8%"
    certifications: ["高新技术企业", "科技型中小企业"]
  tags:
    industry_tag: "电子信息"
    scale_tag: "小型"
    stage_tag: "成长期"
    innovation_tag: "高IP"
    cert_tag: "高新技术企业"
    park_tag: "园区入驻"
  suggested_policy_directions:
    - "专精特新认定申报（条件接近）"
    - "研发费用加计扣除（已有研发基础）"
    - "知识产权贯标（IP数量充足）"
  profile_created_at: "2025-01-15T10:30:00+08:00"
  data_completeness: "85%"
```

## 边界与异常处理 (Edge Cases)

- **信用代码格式错误**: 提示正确格式（18位，含校验位），要求重新输入
- **企业已存在**: 检测到重复时提示"该企业已有画像，是否更新？"
- **字段信息过期**: 标注信息录入日期，提示用户定期更新
- **企业已注销/吊销**: 如用户提供此信息，在画像中标注状态
- **用户只愿提供部分信息**: 接受非必填字段留空，降低 data_completeness 分数
- **用户询问企业估值**: 礼貌拒绝，输出非金融声明

## 跨平台兼容性 (Cross-Platform Compatibility)

- **WorkBuddy**: 支持表单式录入，适合园区服务专员操作
- **CodeBuddy**: 可作为 API 接口文档，辅助开发企业画像模块
- **千问 (Qianwen)**: 支持自然语言对话式录入，逐步引导用户填写
