---
name: brief-maker
description: 材料清单与政策简报生成 - 根据企业画像和匹配政策，自动生成申报材料清单和服务简报。触发词：材料清单、政策简报、申报材料、服务报告。
version: 1.0.0
---

# 材料清单与政策简报生成器 (Brief Maker)

根据企业画像与已匹配的政策，自动生成申报材料清单（含状态追踪）和服务简报（含优先级建议）。

> **非金融声明 (Non-Financial Boundary)**
> 本技能仅生成材料清单与政策简报，**不涉及资金规划、税务筹划或投资建议**。
> 材料准备中的财务数据、审计报告等请由持牌会计/审计机构出具。

## 触发条件

当用户输入包含以下意图时激活本技能：
- "帮我生成材料清单"、"材料清单"、"申报材料"
- "写一份政策简报"、"政策简报"、"服务报告"
- "需要准备什么材料"、"申报要哪些文件"

## 输入参数 (Input Schema)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| company_profile | object | 是 | 企业画像（来自 company-profiler 技能输出） |
| matched_policies | list | 是 | 已匹配政策列表（来自 policy-matcher 技能输出） |
| brief_type | enum | 否 | 输出类型：material_list / service_brief / both（默认 both） |
| priority_sort | enum | 否 | 排序方式：by_score / by_deadline / by_gap（默认 by_score） |

若用户未提供企业画像或匹配政策，引导用户先运行对应技能。

## 执行步骤 (Steps)

### 步骤 1：前置检查
- 确认企业画像和匹配政策数据已就绪
- 若缺失，引导用户先执行 `company-profiler` 和 `policy-matcher`

### 步骤 2：材料缺口分析 (Gap Analysis)
对每条匹配政策，比对材料要求与企业现状：
- **已具备**: 企业已有或可快速提供的材料
- **待准备**: 需要时间准备但条件满足的材料
- **缺口项**: 当前不满足条件、需要先达标的材料
- **建议补充**: 非必须但有助于加分的材料

### 步骤 3：生成材料清单
按政策分组，列出每项材料的状态、预计准备时间、负责方。

### 步骤 4：生成服务简报
包含执行摘要、政策匹配概览、行动计划、风险提示。

### 步骤 5：优先级排序
根据排序方式（匹配分 / 截止日期 / 缺口难度）对政策申报进行优先级排序。

## 输出格式 (Output Schema)

### 材料清单 (Material List)

```yaml
material_list:
  company: "XX科技有限公司"
  generated_at: "2025-01-15"
  policies:
    - policy_name: "高新技术企业认定"
      deadline: "2025-06-30"
      priority: 1
      materials:
        - name: "企业营业执照副本"
          status: "已具备"
          prep_time: "即时"
          owner: "企业"
        - name: "知识产权证书（>=6项）"
          status: "已具备"
          prep_time: "即时"
          owner: "企业"
          note: "已有8项发明专利"
        - name: "研发费用专项审计报告"
          status: "待准备"
          prep_time: "15-20个工作日"
          owner: "会计师事务所"
          note: "需近三年数据"
        - name: "科技成果转化说明"
          status: "待准备"
          prep_time: "7-10个工作日"
          owner: "企业+服务机构"
        - name: "高新技术产品收入证明"
          status: "缺口项"
          prep_time: "需先完成产品认定"
          owner: "企业"
          gap_note: "目前未单独核算高新产品收入"
      summary:
        total_items: 12
        ready: 5
        pending: 5
        gap: 2
```

### 服务简报 (Service Brief)

```yaml
service_brief:
  executive_summary: |
    XX科技有限公司当前画像匹配度最高的是高新技术企业认定（87.5分）
    和专精特新培育（72分）。建议优先启动高企认定，预计准备周期45天。
  recommended_actions:
    - priority: 1
      action: "启动高新技术企业认定申报"
      reason: "匹配度最高，窗口期充足"
      estimated_effort: "45天"
    - priority: 2
      action: "归集研发费用，补齐高新产品收入核算"
      reason: "当前最大材料缺口"
      estimated_effort: "20天"
    - priority: 3
      action: "启动专精特新培育计划"
      reason: "条件接近，可作为下一批次目标"
      estimated_effort: "60天"
  risk_warnings:
    - "高企认定申报窗口剩余90天，建议30天内启动"
    - "研发费用归集需与会计师事务所协调，预留审计时间"
  disclaimers:
    - "本简报仅供参考，不构成申报成功保证"
    - "材料清单以官方最新要求为准"
    - "本服务不构成任何财务或投资建议"
```

## 边界与异常处理 (Edge Cases)

- **无匹配政策**: 输出"当前暂无匹配政策，建议先完善企业画像或等待新政策发布"
- **企业画像不完整**: 标注缺失字段，提示可能影响材料清单准确性
- **材料要求不明确**: 对模糊材料需求标注"以官方指南为准"，建议人工确认
- **多项政策材料重叠**: 合并同类材料，标注"一次准备，多政策复用"
- **申报窗口已过**: 标注为"已过期"，建议关注下一批次
- **用户询问融资建议**: 礼貌拒绝，输出非金融声明

## 跨平台兼容性 (Cross-Platform Compatibility)

- **WorkBuddy**: 支持导出为 Excel/PDF，可直接发送给企业客户
- **CodeBuddy**: 输出结构化 JSON/YAML，便于系统集成
- **千问 (Qianwen)**: 支持对话式查看，用户可追问单项材料细节
