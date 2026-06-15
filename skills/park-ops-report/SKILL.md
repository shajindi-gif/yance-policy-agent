---
name: park-ops-report
description: 园区服务运营报告 - 生成包含14个章节的结构化园区服务报告，含KPI、服务工单、30天计划。触发词：园区报告、运营报告、服务报告、园区周报。
version: 1.0.0
---

# 园区服务运营报告 (Park Operations Report)

生成包含 14 个章节的结构化园区服务运营报告，覆盖 KPI 追踪、服务工单分析、趋势洞察和 30 天行动计划。

> **非金融声明 (Non-Financial Boundary)**
> 本技能仅生成运营服务报告，**不涉及园区投资回报分析、资产估值或财务预测**。
> 如涉及园区经济效益评估，请提示用户咨询专业财务机构。

## 触发条件

当用户输入包含以下意图时激活本技能：
- "生成园区服务报告"、"园区运营周报"、"运营报告"
- "服务报告"、"园区周报"、"园区月报"

## 输入参数 (Input Schema)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| park_name | string | 是 | 园区名称 |
| report_period | string | 是 | 报告周期（如：2025-W03、2025-01） |
| report_type | enum | 否 | weekly / monthly / quarterly（默认 monthly） |
| service_data | object | 是 | 服务数据（见下方结构） |
| kpi_targets | object | 否 | KPI 目标值（无则使用默认基准） |

### service_data 结构

```yaml
service_data:
  total_companies: 120        # 入驻企业总数
  new_companies: 5            # 本期新增企业
  service_tickets:            # 服务工单
    total: 45
    completed: 38
    in_progress: 5
    pending: 2
  policy_matches: 28          # 政策匹配次数
  successful_applications: 8  # 成功申报数
  training_sessions: 3        # 培训活动场次
  training_participants: 85   # 培训参与人次
  satisfaction_score: 4.2     # 满意度评分（5分制）
  complaints: 2               # 投诉数
  revenue_from_services: 0    # 服务收入（如有）
```

## 14 章节报告结构 (Report Structure)

执行步骤按以下 14 个章节依次生成：

1. **报告概要 (Executive Summary)** — 3-5 句话概括本期运营亮点与关键数据
2. **KPI 仪表盘 (KPI Dashboard)** — 核心指标达成情况，含环比变化
3. **企业服务概览 (Service Overview)** — 服务工单统计、分类、响应时效
4. **政策匹配与申报 (Policy Matching)** — 匹配次数、成功率、热门政策
5. **培训活动 (Training & Events)** — 活动场次、参与人数、反馈
6. **新入驻企业 (New Tenants)** — 本期新入驻企业画像摘要
7. **企业流失预警 (Churn Warning)** — 迁出/注销企业分析、预警信号
8. **满意度分析 (Satisfaction)** — NPS/满意度趋势、投诉分析
9. **重点服务案例 (Case Studies)** — 2-3 个典型服务案例
10. **资源使用情况 (Resource Usage)** — 会议室、共享空间、设备使用率
11. **合作生态 (Partnerships)** — 政府/高校/机构合作动态
12. **问题与风险 (Issues & Risks)** — 当前未解决问题、潜在风险
13. **下期重点计划 (Next Period Plan)** — 30 天行动计划
14. **附录 (Appendix)** — 数据明细、计算方法说明

## 输出格式 (Output Schema)

```yaml
park_ops_report:
  park_name: "XX科技园"
  report_period: "2025年1月"
  report_type: "monthly"
  generated_at: "2025-02-01T09:00:00+08:00"

  sections:
    executive_summary: |
      本月园区服务整体稳中向好，服务工单完成率84.4%，
      政策匹配28次、成功申报8项，满意度4.2/5.0。
      重点关注2起投诉跟进及3家企业流失预警。

    kpi_dashboard:
      - metric: "服务工单完成率"
        actual: "84.4%"
        target: "90%"
        status: "WARN"
        trend: "-2.1% vs 上月"
      - metric: "政策申报成功率"
        actual: "28.6%"
        target: "25%"
        status: "PASS"
        trend: "+5.2% vs 上月"
      # ... 更多 KPI

    service_overview:
      ticket_breakdown:
        政策咨询: 18
        资质申报: 12
        融资对接: 5
        人才服务: 6
        其他: 4
      avg_response_time: "4.2小时"

    # ... 其余章节

    next_period_plan:
      - week: "W1"
        action: "跟进5个未完成工单，确保闭环"
        owner: "服务团队"
      - week: "W2"
        action: "组织专精特新申报辅导培训"
        owner: "政策服务组"
      - week: "W3"
        action: "走访3家流失预警企业"
        owner: "客户经理"
      - week: "W4"
        action: "月度满意度回访"
        owner: "运营部"

  disclaimers:
    - "本报告数据来源于园区服务管理系统，仅供内部运营参考"
    - "报告不包含任何投资建议或财务预测"
```

## 边界与异常处理 (Edge Cases)

- **数据不完整**: 标注"数据缺失"章节，建议补充后重新生成
- **KPI 目标未设定**: 使用行业默认基准值，在附录中说明基准来源
- **零数据章节**: 不省略章节，标注"本期无数据"并分析可能原因
- **异常数据波动**: 自动标注环比变化 >20% 的指标，提示关注
- **报告过长**: 默认输出完整 14 章节，用户可指定仅输出部分章节
- **用户要求投资分析**: 礼貌拒绝，输出非金融声明

## 跨平台兼容性 (Cross-Platform Compatibility)

- **WorkBuddy**: 支持导出为 Markdown/PDF，适合汇报场景
- **CodeBuddy**: 输出 JSON 格式，便于与 BI 系统集成
- **千问 (Qianwen)**: 支持对话式查看，可按章节展开细节
