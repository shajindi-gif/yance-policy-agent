"""
test_policy_match.py — Unit tests for the YanCe Policy Matcher

Tests cover:
- Basic matching (full match scenario)
- No match scenario
- Partial match scenario
- Material gap detection
- Scoring logic
- Recommendation generation
"""

import pytest

from policy_matcher import MatchedPolicy, Policy, PolicyMatcher


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def matcher() -> PolicyMatcher:
    return PolicyMatcher()


@pytest.fixture
def sample_company() -> dict:
    return {
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
    }


@pytest.fixture
def ai_policy() -> Policy:
    """A policy that should match the sample company well."""
    return Policy(
        name="徐汇区人工智能产业专项扶持",
        level="区级",
        region="徐汇区",
        industry_tags=["人工智能", "智能机器人"],
        stage_tags=["初创期", "成长期"],
        min_employees=5,
        max_employees=500,
        min_rd_ratio=10.0,
        require_ip=True,
        require_high_tech=False,
        require_sme=False,
        required_materials=["AI产品说明文档", "知识产权证书"],
        source_url="https://www.xh.sh.cn/ai-policy",
        publish_date="2024-06-15",
        issuing_authority="徐汇区商务委员会",
        deadline="2025-10-15",
        subsidy_description="最高200万元专项资金",
    )


@pytest.fixture
def biotech_policy() -> Policy:
    """A policy that should NOT match the sample company (wrong industry)."""
    return Policy(
        name="上海市生物医药创新专项",
        level="市级",
        region="上海市",
        industry_tags=["生物医药", "医疗器械"],
        stage_tags=["成长期", "成熟期"],
        min_employees=20,
        max_employees=2000,
        min_rd_ratio=15.0,
        require_ip=True,
        require_high_tech=True,
        require_sme=False,
        required_materials=["GMP认证证书", "临床试验批件"],
        source_url="https://stcsm.sh.gov.cn/biotech",
        publish_date="2024-03-01",
        issuing_authority="上海市科学技术委员会",
    )


@pytest.fixture
def high_tech_policy() -> Policy:
    """A policy requiring high-tech cert (partial match)."""
    return Policy(
        name="上海市人工智能产业发展专项资金",
        level="市级",
        region="上海市",
        industry_tags=["人工智能", "智能机器人"],
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
        ],
        source_url="https://stcsm.sh.gov.cn/ai-fund",
        publish_date="2024-05-20",
        issuing_authority="上海市科学技术委员会",
        deadline="2025-12-15",
        risk_notes=["需要已获得高新技术企业认定"],
    )


# ---------------------------------------------------------------------------
# Tests: Basic Matching
# ---------------------------------------------------------------------------

class TestBasicMatching:
    """Test basic matching where the company should match the policy well."""

    def test_match_returns_results(self, matcher, sample_company, ai_policy):
        results = matcher.match_company(sample_company, [ai_policy])
        assert len(results) == 1

    def test_match_score_is_high(self, matcher, sample_company, ai_policy):
        results = matcher.match_company(sample_company, [ai_policy])
        assert results[0].score >= 70

    def test_match_industry_reason(self, matcher, sample_company, ai_policy):
        results = matcher.match_company(sample_company, [ai_policy])
        industry_reasons = [r for r in results[0].reasons if "行业匹配" in r]
        assert len(industry_reasons) >= 1

    def test_match_region_reason(self, matcher, sample_company, ai_policy):
        results = matcher.match_company(sample_company, [ai_policy])
        region_reasons = [r for r in results[0].reasons if "区域匹配" in r]
        assert len(region_reasons) >= 1

    def test_match_recommendation_is_recommend(self, matcher, sample_company, ai_policy):
        results = matcher.match_company(sample_company, [ai_policy])
        # With IP and no high-tech requirement, should get good recommendation
        assert results[0].recommendation in ("推荐申请", "建议补充材料后申请")

    def test_sorted_by_score(self, matcher, sample_company, ai_policy, biotech_policy, high_tech_policy):
        results = matcher.match_company(sample_company, [ai_policy, biotech_policy, high_tech_policy])
        scores = [r.score for r in results]
        assert scores == sorted(scores, reverse=True)


# ---------------------------------------------------------------------------
# Tests: No Match Scenario
# ---------------------------------------------------------------------------

class TestNoMatch:
    """Test scenarios where the company should not match the policy."""

    def test_wrong_industry_low_score(self, matcher, sample_company, biotech_policy):
        results = matcher.match_company(sample_company, [biotech_policy])
        # Biotech policy should score lower than industry-matched policies
        # Score is ~60 because region/stage/size/RD/IP still match despite wrong industry
        assert results[0].score < 65

    def test_wrong_industry_reason(self, matcher, sample_company, biotech_policy):
        results = matcher.match_company(sample_company, [biotech_policy])
        mismatch_reasons = [r for r in results[0].reasons if "行业不匹配" in r]
        assert len(mismatch_reasons) >= 1

    def test_wrong_industry_not_recommended(self, matcher, sample_company, biotech_policy):
        results = matcher.match_company(sample_company, [biotech_policy])
        # With wrong industry, recommendation should be lower than top match
        # Score 60 + 1 gap yields "建议补充材料后申请" which is not "推荐申请"
        assert results[0].recommendation != "推荐申请"

    def test_min_score_filter(self, sample_company, biotech_policy):
        """Policies below min_score should be excluded."""
        matcher = PolicyMatcher(min_score=80)
        results = matcher.match_company(sample_company, [biotech_policy])
        assert len(results) == 0

    def test_employee_count_out_of_range(self, matcher, ai_policy):
        """Company with too many employees should lose size points."""
        big_company = {
            "name": "Big Corp",
            "industry": "人工智能",
            "stage": "成长期",
            "region": "上海市徐汇区",
            "employees": 10000,  # Way over max_employees=500
            "rd_ratio_percent": 22,
            "has_ip": True,
            "ip_count": 6,
            "has_high_tech_cert": False,
            "is_sme": False,
        }
        results = matcher.match_company(big_company, [ai_policy])
        size_reasons = [r for r in results[0].reasons if "人员规模不匹配" in r]
        assert len(size_reasons) >= 1


# ---------------------------------------------------------------------------
# Tests: Partial Match
# ---------------------------------------------------------------------------

class TestPartialMatch:
    """Test scenarios with partial matches (some criteria met, some not)."""

    def test_partial_match_score_range(self, matcher, sample_company, high_tech_policy):
        results = matcher.match_company(sample_company, [high_tech_policy])
        # Should match on industry, region, stage, size, RD, IP but miss high-tech cert
        score = results[0].score
        assert 50 <= score <= 90

    def test_partial_match_has_gap(self, matcher, sample_company, high_tech_policy):
        results = matcher.match_company(sample_company, [high_tech_policy])
        # Should have high-tech cert gap
        gap_texts = " ".join(results[0].gaps)
        assert "高新技术企业认定" in gap_texts or "高企" in gap_texts

    def test_partial_match_has_risk(self, matcher, sample_company, high_tech_policy):
        results = matcher.match_company(sample_company, [high_tech_policy])
        risk_texts = " ".join(results[0].risks)
        assert "高企" in risk_texts or "高新技术" in risk_texts

    def test_partial_match_has_human_review(self, matcher, sample_company, high_tech_policy):
        results = matcher.match_company(sample_company, [high_tech_policy])
        # Should have human review points for materials we can't auto-verify
        assert len(results[0].human_review_points) >= 1

    def test_partial_recommendation(self, matcher, sample_company, high_tech_policy):
        results = matcher.match_company(sample_company, [high_tech_policy])
        # With high-tech gap, should be "建议补充材料后申请" or similar
        assert results[0].recommendation in (
            "推荐申请",
            "建议补充材料后申请",
            "建议进一步评估",
        )


# ---------------------------------------------------------------------------
# Tests: Material Gap Detection
# ---------------------------------------------------------------------------

class TestMaterialGapDetection:
    """Test that material gaps are correctly identified."""

    def test_ip_gap_when_missing(self, matcher):
        """Company without IP should have IP gap when policy requires it."""
        company_no_ip = {
            "name": "No IP Company",
            "industry": "人工智能",
            "stage": "成长期",
            "region": "上海市徐汇区",
            "employees": 45,
            "rd_ratio_percent": 22,
            "has_ip": False,
            "ip_count": 0,
            "has_high_tech_cert": False,
            "is_sme": True,
        }
        policy = Policy(
            name="IP Required Policy",
            level="市级",
            region="上海市",
            industry_tags=["人工智能"],
            stage_tags=["成长期"],
            require_ip=True,
            required_materials=["知识产权证书"],
        )
        results = matcher.match_company(company_no_ip, [policy])
        gap_texts = " ".join(results[0].gaps)
        assert "知识产权" in gap_texts

    def test_no_ip_gap_when_present(self, matcher, sample_company, ai_policy):
        """Company with IP should NOT have IP gap."""
        results = matcher.match_company(sample_company, [ai_policy])
        # The IP certificate is in required_materials but company has IP
        ip_gaps = [g for g in results[0].gaps if "知识产权证书" in g]
        assert len(ip_gaps) == 0

    def test_high_tech_gap_when_missing(self, matcher, sample_company, high_tech_policy):
        """Company without high-tech cert should have it as gap."""
        results = matcher.match_company(sample_company, [high_tech_policy])
        gap_texts = " ".join(results[0].gaps)
        assert "高新" in gap_texts

    def test_sme_gap_when_missing(self, matcher):
        """Non-SME company should have SME gap when policy requires it."""
        company_not_sme = {
            "name": "Big Corp",
            "industry": "人工智能",
            "stage": "成长期",
            "region": "上海市",
            "employees": 45,
            "rd_ratio_percent": 22,
            "has_ip": True,
            "ip_count": 6,
            "has_high_tech_cert": False,
            "is_sme": False,
        }
        policy = Policy(
            name="SME Only Policy",
            level="市级",
            region="上海市",
            industry_tags=["人工智能"],
            stage_tags=["成长期"],
            require_sme=True,
            required_materials=["中小企业认定证明"],
        )
        results = matcher.match_company(company_not_sme, [policy])
        gap_texts = " ".join(results[0].gaps)
        assert "中小企业" in gap_texts

    def test_unverifiable_material_flagged_for_review(self, matcher, sample_company):
        """Materials that can't be auto-verified should appear in human review."""
        policy = Policy(
            name="Policy with unverifiable materials",
            level="区级",
            region="徐汇区",
            industry_tags=["人工智能"],
            stage_tags=["成长期"],
            required_materials=["近三年审计报告", "项目计划书"],
        )
        results = matcher.match_company(sample_company, [policy])
        review_texts = " ".join(results[0].human_review_points)
        assert "审计报告" in review_texts or "项目计划书" in review_texts


# ---------------------------------------------------------------------------
# Tests: Scoring Logic
# ---------------------------------------------------------------------------

class TestScoringLogic:
    """Test specific scoring dimensions."""

    def test_perfect_match_score(self, matcher):
        """A company matching all criteria should score 100."""
        company = {
            "name": "Perfect Match Co",
            "industry": "人工智能",
            "stage": "成长期",
            "region": "上海市徐汇区",
            "employees": 50,
            "rd_ratio_percent": 20,
            "has_ip": True,
            "ip_count": 5,
            "has_high_tech_cert": True,
            "is_sme": True,
        }
        policy = Policy(
            name="Perfect Policy",
            level="市级",
            region="上海市",
            industry_tags=["人工智能"],
            stage_tags=["成长期"],
            min_employees=10,
            max_employees=200,
            min_rd_ratio=15.0,
            require_ip=True,
            require_high_tech=True,
            require_sme=True,
        )
        results = matcher.match_company(company, [policy])
        assert results[0].score == 100

    def test_zero_match_score(self, matcher):
        """A company matching nothing should score very low."""
        company = {
            "name": "No Match Co",
            "industry": "餐饮",
            "stage": "衰退期",
            "region": "广东省深圳市",
            "employees": 3,
            "rd_ratio_percent": 0,
            "has_ip": False,
            "ip_count": 0,
            "has_high_tech_cert": False,
            "is_sme": False,
        }
        policy = Policy(
            name="Strict Policy",
            level="区级",
            region="徐汇区",
            industry_tags=["人工智能"],
            stage_tags=["成长期"],
            min_employees=20,
            max_employees=100,
            min_rd_ratio=15.0,
            require_ip=True,
            require_high_tech=True,
            require_sme=True,
        )
        results = matcher.match_company(company, [policy])
        assert results[0].score == 0

    def test_recommendation_thresholds(self, matcher):
        """Test that recommendations follow score thresholds."""
        # Score >= 70 with no gaps => "推荐申请"
        result = MatchedPolicy(
            policy=Policy(name="test", level="", region="", industry_tags=[], stage_tags=[]),
            score=85,
            reasons=[],
            gaps=[],
            risks=[],
            recommendation="",
            human_review_points=[],
        )
        from policy_matcher import PolicyMatcher as PM
        rec = PM._make_recommendation(85, [], [])
        assert rec == "推荐申请"

        rec = PM._make_recommendation(55, ["gap1"], [])
        assert rec == "建议补充材料后申请"

        rec = PM._make_recommendation(35, ["gap1", "gap2", "gap3"], [])
        assert rec == "建议进一步评估"

        rec = PM._make_recommendation(15, [], [])
        assert rec == "暂不推荐"


# ---------------------------------------------------------------------------
# Tests: Edge Cases
# ---------------------------------------------------------------------------

class TestEdgeCases:
    """Test edge cases and boundary conditions."""

    def test_empty_policies(self, matcher, sample_company):
        results = matcher.match_company(sample_company, [])
        assert results == []

    def test_empty_company(self, matcher):
        results = matcher.match_company({}, [Policy(
            name="test", level="市级", region="上海市",
            industry_tags=["AI"], stage_tags=["成长期"],
        )])
        assert len(results) == 1
        # Empty company still matches some defaults: region substring, size range, RD ratio
        # But industry and stage are missing, so score should be well below 50
        assert results[0].score < 50

    def test_multiple_policies_sorted(self, matcher, sample_company, ai_policy, biotech_policy, high_tech_policy):
        results = matcher.match_company(sample_company, [biotech_policy, ai_policy, high_tech_policy])
        scores = [r.score for r in results]
        assert scores == sorted(scores, reverse=True)
