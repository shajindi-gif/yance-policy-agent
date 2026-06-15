---
name: policy-matcher
description: AI政策匹配引擎 - 将企业画像与政策条件进行8维度加权匹配，输出匹配报告。用于园区企业服务、政策申报辅助。触发词：匹配政策、政策匹配、能申请什么政策、政策推荐。
version: 1.0.0
---

# AI 政策匹配引擎 (Policy Matcher)

将企业画像与政策库进行 8 维度加权匹配，输出带评分、理由、材料缺口和风险预警的匹配报告。

> **非金融声明 (Non-Financial Boundary)**
> 本技能仅提供政策信息匹配与结构化分析，**不构成任何投资建议、融资建议或财务咨询**。
> 如涉及资金规划、税务筹划等专业领域，请提示用户咨询持牌专业机构。

## 触发条件

当用户输入包含以下意图时激活本技能：
- "帮我匹配政策"、"政策匹配"、"能申请什么政策"、"政策推荐"
- "哪些政策适合"、"申报什么项目"、"有没有补贴"

## 输入参数 (Input Schema)

收集以下企业画像字段（缺失字段需主动追问）：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| company_name | string | 是 | 企业名称 |
| industry | string | 是 | 所属行业（国标 GB/T 4754） |
| stage | enum | 是 | 发展阶段：种子期/初创期/成长期/成熟期/衰退期 |
| region | string | 是 | 注册地（省-市-区） |
| employee_count | int | 是 | 员工人数 |
| revenue_scale | string | 否 | 营收规模区间 |
| ip_status | object | 否 | 知识产权：patents / trademarks / copyrights 数量 |
| certifications | list | 否 | 已有资质认定（如高新技术企业、专精特新等） |
| rd_investment | float | 否 | 研发投入占比（%） |

## 8 维度加权匹配算法 (8-Dimension Weighted Scoring)

对每条候选政策，按以下 8 个维度打分（0-100），再加权求和：

| # | 维度 | 权重 | 评分依据 |
|---|------|------|----------|
| 1 | 行业匹配 (Industry Fit) | 20% | 企业行业与政策鼓励行业重合度 |
| 2 | 地域匹配 (Region Fit) | 15% | 注册地是否在政策覆盖范围内 |
| 3 | 规模匹配 (Scale Fit) | 10% | 员工/营收是否满足门槛 |
| 4 | 阶段匹配 (Stage Fit) | 15% | 发展阶段与政策扶持对象一致 |
| 5 | 资质匹配 (Certification Fit) | 15% | 已有资质是否满足前置条件 |
| 6 | 知识产权 (IP Fit) | 10% | 专利/软著数量是否达标 |
| 7 | 研发投入 (R&D Fit) | 10% | 研发占比是否满足要求 |
| 8 | 时效匹配 (Timing Fit) | 5% | 申报窗口是否开放 |

**综合分 = sum(维度分 x 权重)**

匹配等级：
- 90-100: 高度匹配 (Highly Matched)
- 70-89: 较好匹配 (Well Matched)
- 50-69: 基本匹配 (Partially Matched)
- <50: 不推荐 (Not Recommended)

## 执行步骤 (Steps)

1. **收集企业画像** — 逐项确认输入参数，缺失必填字段时向用户追问
2. **检索政策库** — 按 region + industry 初筛候选政策列表
3. **逐条评分** — 对每条候选政策执行 8 维度打分，计算综合分
4. **排序输出** — 按综合分降序排列，取 Top N（默认 5 条）
5. **生成匹配报告** — 输出结构化报告（见输出格式）
6. **风险与缺口提示** — 标注材料缺口、时效风险、互斥政策

## 输出格式 (Output Schema)

```yaml
match_report:
  company: "XX科技有限公司"
  match_date: "2025-01-15"
  matched_policies:
    - policy_name: "XX省高新技术企业认定奖励"
      score: 87.5
      match_level: "较好匹配"
      dimensions:
        industry_fit: { score: 95, reason: "电子信息行业完全覆盖" }
        region_fit: { score: 100, reason: "注册地在政策范围内" }
        # ... 其余维度
      reasons:
        - "企业属于电子信息行业，符合重点扶持方向"
        - "拥有12项发明专利，超过要求"
      gaps:
        - field: "研发投入占比"
          current: "4.2%"
          required: ">=5%"
          suggestion: "建议归集研发费用，争取达到5%"
      risk_warnings:
        - "申报窗口剩余15天，需尽快准备"
      traceability:
        source: "XX省科技厅官网"
        policy_doc_number: "X科发[2025]12号"
        publish_date: "2025-01-01"
        valid_until: "2025-12-31"
        region: "XX省"
        human_review_point: "建议由园区服务专员复核研发投入数据"
  disclaimers:
    - "本匹配结果仅供参考，不代表申报成功保证"
    - "具体政策以官方最新发布为准"
    - "本服务不构成任何财务或投资建议"
```

## 边界与异常处理 (Edge Cases)

- **必填字段缺失**: 不猜测，主动追问用户，等待回复后继续
- **无匹配政策**: 输出 "当前画像暂无高匹配政策"，给出优化建议（如调整区域、补充资质）
- **政策库为空**: 提示 "政策库尚未录入该区域数据"，建议联系管理员
- **互斥政策**: 若两条政策不可同时申报，在 risk_warnings 中标注
- **过期政策**: 自动过滤已过期政策，在末尾备注中说明
- **用户询问投资建议**: 礼貌拒绝，输出非金融声明

## 跨平台兼容性 (Cross-Platform Compatibility)

本技能设计为平台无关，可在以下平台运行：
- **WorkBuddy (工作搭档)**: 直接调用，支持园区服务场景
- **CodeBuddy (代码搭档)**: 可作为开发辅助，调试政策匹配 API
- **千问 (Qianwen)**: 通过 prompt 触发，支持自然语言交互
