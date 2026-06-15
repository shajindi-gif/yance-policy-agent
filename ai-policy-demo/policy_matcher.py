"""
policy_matcher.py — Core Policy Matching Engine for YanCe Policy Agent

Provides the PolicyMatcher class that performs rule-based policy matching,
scoring, material gap analysis, and risk flagging for park enterprise services.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

@dataclass
class Policy:
    """Represents a single government policy."""
    name: str
    level: str                        # 国家级 / 市级 / 区级
    region: str                       # e.g. "上海市", "徐汇区"
    industry_tags: list[str]          # e.g. ["人工智能", "大数据"]
    stage_tags: list[str]             # e.g. ["初创期", "成长期"]
    min_employees: int = 0
    max_employees: int = 100000
    min_revenue_million: float = 0.0
    min_rd_ratio: float = 0.0         # R&D expense ratio (%)
    require_ip: bool = False
    require_high_tech: bool = False
    require_sme: bool = False
    required_materials: list[str] = field(default_factory=list)
    source_url: str = ""
    publish_date: str = ""
    issuing_authority: str = ""
    deadline: str = ""
    subsidy_description: str = ""
    risk_notes: list[str] = field(default_factory=list)


@dataclass
class MatchedPolicy:
    """Result of matching one policy against one company."""
    policy: Policy
    score: int                        # 0-100
    reasons: list[str]                # Why it matched
    gaps: list[str]                   # Missing materials / qualifications
    risks: list[str]                  # Risk flags
    recommendation: str               # 推荐申请 / 建议补充材料 / 暂不推荐
    human_review_points: list[str]    # Items requiring human judgment


# ---------------------------------------------------------------------------
# Scoring weights
# ---------------------------------------------------------------------------

WEIGHT_INDUSTRY   = 30   # Industry match
WEIGHT_STAGE      = 15   # Development stage match
WEIGHT_REGION     = 20   # Region match
WEIGHT_SIZE       = 10   # Employee count in range
WEIGHT_RD         = 10   # R&D ratio meets threshold
WEIGHT_IP         = 5    # Has IP if required
WEIGHT_CERT       = 5    # Has high-tech certification if required
WEIGHT_SME        = 5    # SME status if required


# ---------------------------------------------------------------------------
# PolicyMatcher
# ---------------------------------------------------------------------------

class PolicyMatcher:
    """Rule-based policy matching engine.

    Usage::

        matcher = PolicyMatcher()
        results = matcher.match_company(company_data, policies)
        for r in results:
            print(r.policy.name, r.score)
    """

    def __init__(self, *, min_score: int = 0):
        """
        Args:
            min_score: Minimum score threshold to include in results.
                       Set to 0 to return all matches (including zero-score).
        """
        self.min_score = min_score

    # ----- public API -----

    def match_company(
        self,
        company: dict[str, Any],
        policies: list[Policy],
    ) -> list[MatchedPolicy]:
        """Match a single company against a list of policies.

        Args:
            company: Company profile dict with keys like name, industry,
                     stage, region, employees, etc.
            policies: List of Policy objects to match against.

        Returns:
            List of MatchedPolicy sorted by score descending.
        """
        results: list[MatchedPolicy] = []
        for policy in policies:
            matched = self._evaluate(company, policy)
            if matched.score >= self.min_score:
                results.append(matched)

        results.sort(key=lambda m: m.score, reverse=True)
        return results

    # ----- internal scoring -----

    def _evaluate(self, company: dict[str, Any], policy: Policy) -> MatchedPolicy:
        """Evaluate a single company-policy pair."""
        score = 0
        reasons: list[str] = []
        gaps: list[str] = []
        risks: list[str] = list(policy.risk_notes)
        human_review: list[str] = []

        # 1. Industry match
        industry = company.get("industry", "")
        if industry in policy.industry_tags:
            score += WEIGHT_INDUSTRY
            reasons.append(f"行业匹配: {industry}")
        else:
            reasons.append(f"行业不匹配: 企业={industry}, 政策要求={policy.industry_tags}")

        # 2. Stage match
        stage = company.get("stage", "")
        if stage in policy.stage_tags:
            score += WEIGHT_STAGE
            reasons.append(f"阶段匹配: {stage}")
        else:
            reasons.append(f"阶段不匹配: 企业={stage}, 政策要求={policy.stage_tags}")

        # 3. Region match
        region = company.get("region", "")
        if policy.region in region or region in policy.region:
            score += WEIGHT_REGION
            reasons.append(f"区域匹配: {region} 包含 {policy.region}")
        else:
            reasons.append(f"区域不匹配: 企业={region}, 政策区域={policy.region}")

        # 4. Employee count
        employees = company.get("employees", 0)
        if policy.min_employees <= employees <= policy.max_employees:
            score += WEIGHT_SIZE
            reasons.append(f"人员规模匹配: {employees}人")
        else:
            reasons.append(
                f"人员规模不匹配: {employees}人, "
                f"政策要求 {policy.min_employees}-{policy.max_employees}"
            )

        # 5. R&D ratio
        rd_ratio = company.get("rd_ratio_percent", 0.0)
        if rd_ratio >= policy.min_rd_ratio:
            score += WEIGHT_RD
            reasons.append(f"研发占比达标: {rd_ratio}% >= {policy.min_rd_ratio}%")
        else:
            reasons.append(
                f"研发占比不足: {rd_ratio}% < {policy.min_rd_ratio}%"
            )

        # 6. IP status
        has_ip = company.get("has_ip", False)
        if policy.require_ip and not has_ip:
            gaps.append("需要具备知识产权证书")
            risks.append("缺少知识产权，可能影响申请资格")
        elif policy.require_ip and has_ip:
            score += WEIGHT_IP
            ip_count = company.get("ip_count", 0)
            reasons.append(f"知识产权达标: {ip_count}项")
        else:
            # IP not required but company has it — minor positive signal
            if has_ip:
                reasons.append(f"企业拥有知识产权 ({company.get('ip_count', 0)}项)")

        # 7. High-tech certification
        has_high_tech = company.get("has_high_tech_cert", False)
        if policy.require_high_tech and not has_high_tech:
            gaps.append("需要高新技术企业认定")
            risks.append("尚未获得高企认定，需先完成认定流程")
            human_review.append("高企认定申请需财务与法务部门协同准备")
        elif policy.require_high_tech and has_high_tech:
            score += WEIGHT_CERT
            reasons.append("已获得高新技术企业认定")

        # 8. SME status
        is_sme = company.get("is_sme", False)
        if policy.require_sme and not is_sme:
            gaps.append("需要中小企业认定")
        elif policy.require_sme and is_sme:
            score += WEIGHT_SME
            reasons.append("符合中小企业认定标准")

        # Material gap analysis
        for material in policy.required_materials:
            # Simple heuristic: check if company data indicates the material exists
            material_key = self._material_to_key(material)
            if material_key and not company.get(material_key, False):
                gaps.append(f"缺少材料: {material}")
            elif not material_key:
                # We can't auto-verify this material — flag for human review
                human_review.append(f"需人工确认材料: {material}")

        # Deadline risk
        if policy.deadline:
            risks.append(f"申请截止日期: {policy.deadline}，请尽快准备")

        # Recommendation
        recommendation = self._make_recommendation(score, gaps, risks)

        return MatchedPolicy(
            policy=policy,
            score=score,
            reasons=reasons,
            gaps=gaps,
            risks=risks,
            recommendation=recommendation,
            human_review_points=human_review,
        )

    # ----- helpers -----

    @staticmethod
    def _make_recommendation(score: int, gaps: list[str], risks: list[str]) -> str:
        """Generate a human-readable recommendation based on score and gaps."""
        if score >= 70 and len(gaps) == 0:
            return "推荐申请"
        elif score >= 50 and len(gaps) <= 2:
            return "建议补充材料后申请"
        elif score >= 30:
            return "建议进一步评估"
        else:
            return "暂不推荐"

    @staticmethod
    def _material_to_key(material: str) -> str | None:
        """Map a material description to a company data key, if possible.

        Returns None if the material cannot be auto-verified.
        """
        mapping = {
            "知识产权证书": "has_ip",
            "高新技术企业认定证书": "has_high_tech_cert",
            "中小企业认定证明": "is_sme",
        }
        return mapping.get(material)
