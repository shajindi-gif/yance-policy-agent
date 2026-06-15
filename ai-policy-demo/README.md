# ai-policy-demo

> This project is not an investment advisory, trading, or financial market analysis tool.
> It only focuses on industrial policy matching and park enterprise service workflows.

## Project Introduction / 项目介绍

AI Policy Demo is a lightweight prototype for policy matching, company profiling, and park service workflow generation.

一个轻量级政策Agent Demo，用于展示政策匹配、企业画像、园区企业服务工单和政策报告生成能力。

This demo showcases how an AI agent can help industrial park managers quickly identify which government policies apply to each tenant company, generate actionable service recommendations, and produce structured reports with full traceability.

## 园区使用场景 / Park Use Cases

1. **新企业入驻政策适配 (New Tenant Policy Onboarding)** — When a company moves into the park, automatically match them with applicable national, municipal, and district-level policies within minutes.

2. **年度政策复核 (Annual Policy Review)** — Batch-review all park tenants against updated policy catalogs each year to identify new eligibility or expired certifications.

3. **企业画像与差距分析 (Company Profiling & Gap Analysis)** — Build a structured profile for each company and identify what materials or qualifications are missing to qualify for key subsidies.

4. **园区服务工单生成 (Service Ticket Generation)** — Automatically generate prioritized service tickets for park staff, so they know which company to contact first and what to prepare.

5. **政策变更追踪 (Policy Change Tracking)** — When a new policy is announced or an existing one is updated, identify which park companies are affected and trigger a notification workflow.

6. **园区年度报告生成 (Annual Park Report)** — Generate a comprehensive report summarizing policy coverage, service activity, and enterprise development across the park for government reporting.

## 功能列表 / Feature List

1. **Rule-based Policy Matching Engine** — Match companies to policies based on industry, stage, region, employee count, and IP status.
2. **Scoring & Ranking** — Each match receives a relevance score (0-100) based on multiple weighted dimensions.
3. **Material Gap Analysis** — Identify what documents or qualifications are missing for each policy application.
4. **Risk Flagging** — Flag potential risks such as approaching deadlines, uncertain eligibility, or pending policy changes.
5. **Traceability** — Every recommendation includes source policy document, publish date, issuing authority, and region.
6. **Human Review Points** — Clearly mark which decisions require human judgment before proceeding.
7. **Structured Report Generation** — Output a 14-section Markdown report covering all aspects of the policy service workflow.
8. **Company Profiling** — Build structured profiles with industry classification, development stage, and qualification status.
9. **Service Ticket Prioritization** — Generate prioritized action items for park service staff.
10. **Multi-policy Comparison** — Compare a single company against multiple policies side by side.
11. **Batch Processing** — Run matching for multiple companies in a single pass.
12. **JSON/Console/File Output** — Flexible output modes for integration with downstream systems.
13. **Extensible Policy Schema** — Easy to add new policies with structured YAML/JSON definitions.
14. **Non-financial Boundary Enforcement** — Explicitly scoped to industrial policy only; no financial or investment advice.

## 快速开始 / Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/ai-policy-demo.git
cd ai-policy-demo

# Create a virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the demo
python main.py

# Run tests
python -m pytest tests/ -v
```

## 示例输入 / Sample Input

```json
{
  "company": {
    "name": "衍策引擎（上海）科技有限公司",
    "industry": "人工智能",
    "stage": "成长期",
    "region": "上海市徐汇区",
    "park": "徐汇AI创新园区",
    "employees": 45,
    "revenue_year_million": 8.5,
    "rd_ratio_percent": 22,
    "has_ip": true,
    "ip_count": 6,
    "has_high_tech_cert": false,
    "is_sme": true
  }
}
```

See `sample_input.json` for the full input file.

## 示例输出 / Sample Output (Excerpt)

```markdown
# 政策匹配服务报告

## 1. 企业基本信息
- 企业名称：衍策引擎（上海）科技有限公司
- 所属行业：人工智能
- 发展阶段：成长期
- 所在区域：上海市徐汇区

## 2. 匹配政策总览
| 政策名称 | 匹配度 | 级别 | 状态 |
|---------|--------|------|------|
| 上海市高新技术企业认定 | 92/100 | 市级 | 推荐申请 |
| 徐汇区人工智能产业专项扶持 | 88/100 | 区级 | 推荐申请 |

## 3. 材料差距分析
- [ ] 高新技术企业认定申请书
- [ ] 近三年审计报告
- [x] 知识产权证书 (已有6项)

## 4. 人工复核点
⚠️ 研发费用归集需财务部门确认是否符合加计扣除口径
```

See `sample_output.md` for the complete 14-section report.

## 技术栈 / Tech Stack

- **Python 3.10+** — Core language
- **pandas** — Data handling and structured output
- **Rule-based matching engine** — Transparent, auditable policy matching logic
- **JSON** — Input/output data format
- **Markdown** — Report generation
- **pytest** — Unit testing

## 路线图 / Roadmap

### Phase 1: Core Prototype (Current)
- Rule-based policy matching engine
- Single company profiling and matching
- Console and file output
- Unit test coverage

### Phase 2: Data Integration
- Load policies from structured CSV/YAML files
- Support batch matching for multiple companies
- Policy version tracking and change detection
- REST API endpoint for integration

### Phase 3: Intelligence Layer
- LLM-assisted gap analysis with natural language explanations
- Smart document checklist generation
- Policy similarity detection (avoid duplicate entries)
- Confidence scoring with uncertainty quantification

### Phase 4: Park Management Platform
- Multi-park support with park-specific policy catalogs
- Dashboard for park managers with real-time matching status
- Automated notification workflows for policy deadlines
- Government reporting module with exportable templates

## 免责声明 / Disclaimer

Policy matching results are generated by rule-based algorithms and are **for reference only**. All policy recommendations require **human review** by qualified personnel before any action is taken. Policy eligibility depends on official government criteria, which may change without notice. This tool does not guarantee application success or policy availability.

## 非金融边界说明 / Non-Financial Boundary

This project does **NOT** provide:
- Investment advice or stock recommendations
- Financial market analysis or trading signals
- Economic forecasting or macro predictions
- Any form of financial advisory service

The scope is strictly limited to **industrial policy matching** and **park enterprise service workflows**. All outputs are designed for park administrators, government liaison officers, and enterprise service professionals.

## License

MIT License. See [LICENSE](LICENSE) for details.
