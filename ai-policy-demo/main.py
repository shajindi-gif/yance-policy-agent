#!/usr/bin/env python3
"""
main.py — YanCe Policy Agent Demo

Loads sample policy and company data, performs rule-based policy matching,
generates a structured service report, and outputs to console and file.

Usage:
    python main.py [--output report.md] [--json]
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

from policy_matcher import MatchedPolicy, Policy, PolicyMatcher


# ---------------------------------------------------------------------------
# Sample data (inline — no external CSV required)
# ---------------------------------------------------------------------------

SAMPLE_COMPANY: dict = {
    "name": "衍策引擎（上海）科技有限公司",
    "industry": "人工智能",
    "stage": "成长期",
    "region": "上海市徐汇区",
    "park": "徐汇AI创新园区",
    "employees": 45,
    "revenue_year_million": 8.5,
    "rd_ratio_percent": 22,
    "has_ip": True,
    "ip_count": 6,
    "has_high_tech_cert": False,
    "is_sme": True,
    "registered_capital_million": 5.0,
    "founded_year": 2021,
    "contact_person": "张经理",
    "contact_phone": "021-XXXX-XXXX",
    "business_scope": "人工智能技术研发、政策数据分析、企业服务平台开发",
}

SAMPLE_POLICIES: list[Policy] = [
    Policy(
        name="上海市高新技术企业认定",
        level="市级",
        region="上海市",
        industry_tags=["人工智能", "大数据", "集成电路", "生物医药", "新材料"],
        stage_tags=["初创期", "成长期", "成熟期"],
        min_employees=10,
        max_employees=5000,
        min_rd_ratio=15.0,
        require_ip=True,
        require_high_tech=False,
        require_sme=False,
        required_materials=[
            "高新技术企业认定申请书",
            "近三年审计报告",
            "近一年企业所得税纳税申报表",
            "企业职工和科技人员情况说明",
            "知识产权证书",
        ],
        source_url="https://stcsm.sh.gov.cn/high-tech-enterprise",
        publish_date="2024-03-01",
        issuing_authority="上海市科学技术委员会",
        deadline="2025-09-30",
        subsidy_description="企业所得税减按15%征收，研发费用加计扣除，市区两级奖励",
        risk_notes=["近三年审计报告需包含完整年度"],
    ),
    Policy(
        name="徐汇区人工智能产业专项扶持",
        level="区级",
        region="徐汇区",
        industry_tags=["人工智能", "智能机器人", "自动驾驶"],
        stage_tags=["初创期", "成长期"],
        min_employees=5,
        max_employees=500,
        min_rd_ratio=10.0,
        require_ip=True,
        require_high_tech=False,
        require_sme=False,
        required_materials=[
            "AI产品或服务说明文档",
            "近一年营收证明",
            "知识产权证明材料",
            "知识产权证书",
        ],
        source_url="https://www.xh.sh.cn/ai-policy-2024",
        publish_date="2024-06-15",
        issuing_authority="徐汇区商务委员会",
        deadline="2025-10-15",
        subsidy_description="最高200万元专项资金支持，办公场地租金补贴",
    ),
    Policy(
        name="上海市科技型中小企业技术创新资金",
        level="市级",
        region="上海市",
        industry_tags=["人工智能", "大数据", "生物医药", "新材料", "新能源"],
        stage_tags=["初创期", "成长期"],
        min_employees=5,
        max_employees=500,
        min_rd_ratio=5.0,
        require_ip=False,
        require_high_tech=False,
        require_sme=True,
        required_materials=[
            "科技型中小企业评价入库",
            "项目计划书",
            "近三年财务报表",
        ],
        source_url="https://stcsm.sh.gov.cn/sme-innovation-fund",
        publish_date="2024-04-10",
        issuing_authority="上海市科学技术委员会",
        deadline="2025-08-31",
        subsidy_description="最高50万元创新资金支持",
        risk_notes=["需先完成科技型中小企业评价入库"],
    ),
    Policy(
        name="徐汇区科技创新企业租金补贴",
        level="区级",
        region="徐汇区",
        industry_tags=["人工智能", "大数据", "集成电路", "生物医药", "文化创意"],
        stage_tags=["初创期", "成长期", "成熟期"],
        min_employees=5,
        max_employees=1000,
        min_rd_ratio=0.0,
        require_ip=False,
        require_high_tech=False,
        require_sme=True,
        required_materials=[
            "租赁合同复印件",
            "租金发票",
        ],
        source_url="https://www.xh.sh.cn/rent-subsidy-2024",
        publish_date="2024-01-20",
        issuing_authority="徐汇区科学技术委员会",
        deadline="2025-12-31",
        subsidy_description="最高30%租金补贴，最长补贴3年",
    ),
    Policy(
        name="国家中小企业发展专项资金",
        level="国家级",
        region="全国",
        industry_tags=["人工智能", "大数据", "先进制造", "新材料", "新能源"],
        stage_tags=["成长期", "成熟期"],
        min_employees=20,
        max_employees=5000,
        min_rd_ratio=8.0,
        require_ip=True,
        require_high_tech=False,
        require_sme=True,
        required_materials=[
            "中小企业认定证明",
            "知识产权证书",
            "近三年审计报告",
            "项目可行性研究报告",
        ],
        source_url="https://www.miit.gov.cn/sme-development-fund",
        publish_date="2024-02-01",
        issuing_authority="工业和信息化部",
        deadline="2025-11-30",
        subsidy_description="最高100万元专项资金支持",
    ),
    Policy(
        name="上海市人工智能产业发展专项资金",
        level="市级",
        region="上海市",
        industry_tags=["人工智能", "智能机器人", "自动驾驶", "智能医疗"],
        stage_tags=["成长期", "成熟期"],
        min_employees=30,
        max_employees=10000,
        min_rd_ratio=15.0,
        require_ip=True,
        require_high_tech=True,
        require_sme=False,
        required_materials=[
            "高新技术企业认定证书",
            "知识产权证书",
            "AI产品/服务说明",
            "近一年营收证明",
            "项目实施方案",
        ],
        source_url="https://stcsm.sh.gov.cn/ai-industry-fund",
        publish_date="2024-05-20",
        issuing_authority="上海市科学技术委员会",
        deadline="2025-12-15",
        subsidy_description="最高500万元专项资金，配套融资支持",
        risk_notes=["需要已获得高新技术企业认定"],
    ),
]


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def generate_report(
    company: dict,
    results: list[MatchedPolicy],
    report_id: str = "",
) -> str:
    """Generate a structured Markdown service report."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if not report_id:
        report_id = f"YC-{datetime.now().strftime('%Y-%m%d-%f')[:11]}"

    lines: list[str] = []
    w = lines.append  # shorthand

    # Header
    w("# 政策匹配服务报告\n")
    w(f"> 生成时间: {now}")
    w(f"> 生成引擎: YanCe Policy Agent v1.0")
    w(f"> 报告编号: {report_id}\n")
    w("---\n")

    # 1. Company Info
    w("## 1. 企业基本信息\n")
    w("| 字段 | 内容 |")
    w("|------|------|")
    field_map = [
        ("企业名称", "name"),
        ("所属行业", "industry"),
        ("发展阶段", "stage"),
        ("所在区域", "region"),
        ("所在园区", "park"),
        ("员工人数", "employees"),
        ("年营收(百万)", "revenue_year_million"),
        ("研发占比(%)", "rd_ratio_percent"),
        ("知识产权数", "ip_count"),
        ("高企认定", "has_high_tech_cert"),
        ("中小企业", "is_sme"),
        ("成立年份", "founded_year"),
        ("注册资本(百万)", "registered_capital_million"),
        ("经营范围", "business_scope"),
    ]
    for label, key in field_map:
        val = company.get(key, "N/A")
        if isinstance(val, bool):
            val = "是" if val else "否"
        if key == "employees":
            val = f"{val}人"
        w(f"| {label} | {val} |")
    w("")

    # 2. Matched Policies Summary
    w("\n## 2. 匹配政策总览\n")
    w("| # | 政策名称 | 匹配度 | 级别 | 区域 | 推荐动作 |")
    w("|---|---------|--------|------|------|---------|")
    for i, m in enumerate(results, 1):
        w(f"| {i} | {m.policy.name} | {m.score}/100 | {m.policy.level} | {m.policy.region} | {m.recommendation} |")
    w("")
    rec_counts: dict[str, int] = {}
    for m in results:
        rec_counts[m.recommendation] = rec_counts.get(m.recommendation, 0) + 1
    summary_parts = [f"{k} {v} 项" for k, v in rec_counts.items()]
    w(f"**匹配统计:** 共匹配 {len(results)} 项政策，" + "，".join(summary_parts) + "。\n")

    # 3. Detailed Policy Analysis
    w("\n## 3. 政策详细分析\n")
    for i, m in enumerate(results, 1):
        p = m.policy
        w(f"### 3.{i} {p.name}\n")
        w(f"- **匹配度:** {m.score}/100")
        w(f"- **级别:** {p.level}")
        w(f"- **发布机构:** {p.issuing_authority}")
        w(f"- **发布日期:** {p.publish_date}")
        w(f"- **来源:** {p.source_url}")
        if p.deadline:
            w(f"- **截止日期:** {p.deadline}")
        if p.subsidy_description:
            w(f"- **扶持内容:** {p.subsidy_description}")
        w("")
        w("**匹配原因:**")
        for r in m.reasons:
            w(f"- {r}")
        w("")
        w("**材料差距:**")
        if m.gaps:
            for g in m.gaps:
                w(f"- [ ] {g}")
        else:
            w("- 无重大材料缺失")
        w("")
        w("**风险提示:**")
        if m.risks:
            for r in m.risks:
                w(f"- {r}")
        else:
            w("- 无重大风险")
        w("")
        w("**人工复核点:**")
        if m.human_review_points:
            for h in m.human_review_points:
                w(f"- {h}")
        else:
            w("- 无需额外人工复核")
        w("\n---\n")

    # 4. Material Gap Summary
    w("\n## 4. 材料差距分析汇总\n")
    all_gaps: dict[str, list[str]] = {}
    for m in results:
        for g in m.gaps:
            all_gaps.setdefault(g, []).append(m.policy.name)
    if all_gaps:
        w("| 材料名称 | 关联政策 | 紧急程度 |")
        w("|---------|---------|---------|")
        for gap, policies_list in all_gaps.items():
            urgency = "高" if len(policies_list) > 1 else "中"
            w(f"| {gap} | {', '.join(policies_list)} | {urgency} |")
    else:
        w("无材料差距。\n")

    # 5. Risk Assessment
    w("\n\n## 5. 风险评估\n")
    all_risks: list[tuple[str, str, str]] = []
    for m in results:
        for r in m.risks:
            severity = "高" if "截止" in r else "中"
            all_risks.append((r, severity, m.policy.name))
    if all_risks:
        w("| 风险项 | 等级 | 关联政策 |")
        w("|--------|------|---------|")
        for risk, sev, policy_name in all_risks:
            w(f"| {risk} | {sev} | {policy_name} |")
    else:
        w("无重大风险。\n")

    # 6. Service Tickets
    w("\n\n## 6. 服务工单建议\n")
    for i, m in enumerate(results[:4], 1):  # Top 4 policies
        priority = "紧急" if m.score >= 80 else "一般" if m.score >= 50 else "常规"
        w(f"### 工单 {i}: {m.policy.name} [{priority}]")
        w(f"- **负责部门:** 园区企业服务部")
        w(f"- **服务对象:** {company.get('name', 'N/A')}")
        w(f"- **行动项:**")
        for g in m.gaps[:3]:
            w(f"  - [ ] 准备: {g}")
        w(f"- **推荐动作:** {m.recommendation}")
        w("")

    # 7-14. Remaining sections (concise)
    w("\n## 7. 政策时间线\n")
    w("```")
    w("2025-07  ████ 启动政策申报准备")
    w("2025-08  ████ 完成中小企业评价入库 (截止 08-31)")
    w("2025-09  ████ 提交高企认定申请 (截止 09-30)")
    w("2025-10  ████ 提交AI专项扶持申请 (截止 10-15)")
    w("2025-11  ████ 提交国家专项资金申请 (截止 11-30)")
    w("2025-12  ████ 年度政策复核 + 下一年度规划")
    w("```\n")

    w("\n## 8. 企业画像摘要\n")
    w(f"**{company.get('name', '')}** 是一家成立于{company.get('founded_year', 'N/A')}年的"
      f"{company.get('industry', '')}领域{company.get('stage', '')}企业，"
      f"位于{company.get('park', company.get('region', ''))}。"
      f"公司拥有{company.get('employees', 0)}名员工，"
      f"年营收约{company.get('revenue_year_million', 0) * 100:.0f}万元，"
      f"研发投入占比{company.get('rd_ratio_percent', 0)}%，"
      f"已拥有{company.get('ip_count', 0)}项知识产权。\n")

    w("\n## 9. 匹配算法说明\n")
    w("| 维度 | 权重 | 说明 |")
    w("|------|------|------|")
    w("| 行业匹配 | 30% | 企业所属行业是否在政策覆盖范围内 |")
    w("| 区域匹配 | 20% | 企业注册地是否属于政策适用区域 |")
    w("| 阶段匹配 | 15% | 企业发展阶段是否符合政策要求 |")
    w("| 人员规模 | 10% | 员工人数是否在政策规定范围内 |")
    w("| 研发占比 | 10% | 研发费用占比是否达到政策门槛 |")
    w("| 知识产权 | 5% | 是否拥有必要的知识产权 |")
    w("| 资质认定 | 5% | 高企认定等资质 |")
    w("| 中小企业 | 5% | 是否符合中小企业标准 |\n")

    w("\n## 10. 数据追溯信息\n")
    w("| 政策 | 来源URL | 发布日期 | 发布机构 | 区域 |")
    w("|------|---------|---------|---------|------|")
    for m in results:
        p = m.policy
        short_url = p.source_url.replace("https://", "")
        w(f"| {p.name} | {short_url} | {p.publish_date} | {p.issuing_authority} | {p.region} |")

    w("\n\n## 11. 人工复核清单\n")
    all_reviews: list[str] = []
    for m in results:
        for h in m.human_review_points:
            if h not in all_reviews:
                all_reviews.append(h)
    if all_reviews:
        for h in all_reviews:
            w(f"- [ ] {h}")
    else:
        w("- 无需额外人工复核")

    w("\n\n## 12. 下一步行动\n")
    w("1. 园区服务经理联系企业负责人，确认政策申报意愿")
    w("2. 根据材料差距清单，制定材料准备计划")
    w("3. 按时间线优先级推进各项政策申报")
    w("4. 定期跟踪政策变更和截止日期")

    w("\n\n## 13. 免责声明\n")
    w("本报告由 YanCe Policy Agent v1.0 规则匹配引擎自动生成，结果**仅供参考**。")
    w("所有政策推荐需要**人工复核**后才能采取行动。")
    w("政策资格取决于官方政府标准，可能随时变更。\n")

    w("\n## 14. 非金融边界说明\n")
    w("本项目**不提供**投资建议、股票推荐、金融市场分析或任何形式的金融咨询服务。")
    w("本工具的范围严格限定于**产业政策匹配**和**园区企业服务工单**。\n")

    w("---\n")
    w("*报告由 YanCe Policy Agent 生成 | 衍策引擎 v1.0*")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="YanCe Policy Agent — Policy Matching Demo"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default="report_output.md",
        help="Output file path for the Markdown report (default: report_output.md)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Also output results as JSON",
    )
    parser.add_argument(
        "--min-score",
        type=int,
        default=0,
        help="Minimum score threshold for results (default: 0)",
    )
    args = parser.parse_args()

    print("=" * 60)
    print("  YanCe Policy Agent v1.0 — 衍策政策匹配引擎")
    print("=" * 60)
    print()

    # Load data
    company = SAMPLE_COMPANY
    policies = SAMPLE_POLICIES

    print(f"[INFO] 企业信息: {company['name']}")
    print(f"[INFO] 行业: {company['industry']} | 阶段: {company['stage']} | 区域: {company['region']}")
    print(f"[INFO] 加载政策: {len(policies)} 项")
    print()

    # Match
    matcher = PolicyMatcher(min_score=args.min_score)
    results = matcher.match_company(company, policies)

    # Console output
    print("-" * 60)
    print("  匹配结果")
    print("-" * 60)
    for i, m in enumerate(results, 1):
        print(f"  {i}. [{m.score:3d}/100] {m.policy.name}")
        print(f"     级别: {m.policy.level} | 区域: {m.policy.region}")
        print(f"     推荐: {m.recommendation}")
        if m.gaps:
            print(f"     材料差距: {len(m.gaps)} 项")
        if m.risks:
            print(f"     风险提示: {len(m.risks)} 项")
        print()

    print(f"[INFO] 共匹配 {len(results)} 项政策")
    print()

    # Generate report
    report = generate_report(company, results)

    # Write to file
    output_path = Path(args.output)
    output_path.write_text(report, encoding="utf-8")
    print(f"[OK] 报告已保存至: {output_path.resolve()}")

    # JSON output
    if args.json:
        json_data = {
            "company": company,
            "results": [
                {
                    "policy_name": m.policy.name,
                    "score": m.score,
                    "level": m.policy.level,
                    "region": m.policy.region,
                    "recommendation": m.recommendation,
                    "reasons": m.reasons,
                    "gaps": m.gaps,
                    "risks": m.risks,
                    "human_review_points": m.human_review_points,
                    "source_url": m.policy.source_url,
                    "publish_date": m.policy.publish_date,
                    "issuing_authority": m.policy.issuing_authority,
                    "deadline": m.policy.deadline,
                }
                for m in results
            ],
            "generated_at": datetime.now().isoformat(),
            "engine_version": "1.0",
        }
        json_path = output_path.with_suffix(".json")
        json_path.write_text(
            json.dumps(json_data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"[OK] JSON 已保存至: {json_path.resolve()}")

    print()
    print("[DONE] 衍策政策匹配完成。所有推荐需人工复核后方可执行。")


if __name__ == "__main__":
    main()
