"""
研策政策智能体 — 园区服务 SaaS 演示
YanCe Policy Agent — Park Service SaaS Demo

面向产业园区服务人员的政策匹配与企业服务辅助平台。
严格限定于产业园区政策申报与企业服务领域，不涉及任何金融投资内容。
"""

import streamlit as st
import pandas as pd
import os
from datetime import datetime, timedelta
import hashlib

# ──────────────────────────────────────────────
# 页面配置
# ──────────────────────────────────────────────
st.set_page_config(
    page_title="研策政策智能体 · 园区服务平台",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ──────────────────────────────────────────────
# 自定义样式
# ──────────────────────────────────────────────
st.markdown("""
<style>
    .main-header {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.2rem;
        border-radius: 12px;
        color: white;
        text-align: center;
    }
    .metric-card-green {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        padding: 1.2rem;
        border-radius: 12px;
        color: white;
        text-align: center;
    }
    .metric-card-orange {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 1.2rem;
        border-radius: 12px;
        color: white;
        text-align: center;
    }
    .metric-card-blue {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        padding: 1.2rem;
        border-radius: 12px;
        color: white;
        text-align: center;
    }
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
    }
    .metric-label {
        font-size: 0.85rem;
        opacity: 0.9;
    }
    .match-high {
        background-color: #d4edda;
        border-left: 4px solid #28a745;
        padding: 12px 16px;
        border-radius: 4px;
        margin: 8px 0;
    }
    .match-medium {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 12px 16px;
        border-radius: 4px;
        margin: 8px 0;
    }
    .match-low {
        background-color: #f8f9fa;
        border-left: 4px solid #6c757d;
        padding: 12px 16px;
        border-radius: 4px;
        margin: 8px 0;
    }
    .disclaimer-banner {
        background-color: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 20px;
        font-size: 0.9rem;
        color: #856404;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        padding: 8px 20px;
        border-radius: 8px 8px 0 0;
    }
</style>
""", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# 数据加载
# ──────────────────────────────────────────────
@st.cache_data
def load_policies():
    path = os.path.join(os.path.dirname(__file__), "data", "policies_sample.csv")
    return pd.read_csv(path)

@st.cache_data
def load_companies():
    path = os.path.join(os.path.dirname(__file__), "data", "companies_sample.csv")
    return pd.read_csv(path)

@st.cache_data
def load_parks():
    path = os.path.join(os.path.dirname(__file__), "data", "parks_sample.csv")
    return pd.read_csv(path)

@st.cache_data
def load_providers():
    path = os.path.join(os.path.dirname(__file__), "data", "service_providers_sample.csv")
    return pd.read_csv(path)

@st.cache_data
def load_sample_report():
    path = os.path.join(os.path.dirname(__file__), "outputs", "sample_park_policy_report.md")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


# ──────────────────────────────────────────────
# Session State 初始化
# ──────────────────────────────────────────────
if "selected_park" not in st.session_state:
    st.session_state.selected_park = None
if "current_company" not in st.session_state:
    st.session_state.current_company = None
if "matched_policies" not in st.session_state:
    st.session_state.matched_policies = []
if "material_list" not in st.session_state:
    st.session_state.material_list = []
if "service_tickets" not in st.session_state:
    st.session_state.service_tickets = []
if "company_entered" not in st.session_state:
    st.session_state.company_entered = False


# ──────────────────────────────────────────────
# 政策匹配引擎（规则引擎）
# ──────────────────────────────────────────────
def match_policies(company, policies_df):
    """
    规则引擎：根据企业画像匹配政策。
    匹配维度：行业、阶段、区域、员工数。
    返回匹配结果列表，每项包含 score, reason, requirements_check 等。
    """
    results = []
    company_industry = str(company.get("industry", "")).strip()
    company_region = str(company.get("region", "")).strip()
    company_stage = str(company.get("revenue_stage", "")).strip()
    employee_count = int(company.get("employee_count", 0))
    park_name = str(company.get("park_name", "")).strip()

    for _, policy in policies_df.iterrows():
        score = 0
        reasons = []
        max_score = 100

        # 行业匹配 (30分)
        target_industry = str(policy.get("target_industry", ""))
        if target_industry == "全行业":
            score += 25
            reasons.append("行业要求：全行业（通用政策）")
        elif any(kw in company_industry for kw in target_industry.split("/")):
            score += 30
            reasons.append(f"行业匹配：{company_industry} 属于 {target_industry} 领域")
        elif any(kw in target_industry for kw in company_industry.split("/")):
            score += 20
            reasons.append(f"行业相关：{company_industry} 与 {target_industry} 关联")

        # 阶段匹配 (25分)
        target_stage = str(policy.get("target_stage", ""))
        if target_stage == "全阶段":
            score += 20
            reasons.append("阶段要求：全阶段（无限制）")
        elif "初创" in company_stage and "初创" in target_stage:
            score += 25
            reasons.append(f"阶段匹配：企业处于{company_stage}，政策面向{target_stage}")
        elif "成长" in company_stage and "成长" in target_stage:
            score += 25
            reasons.append(f"阶段匹配：企业处于{company_stage}，政策面向{target_stage}")
        elif "成熟" in company_stage and "成长" in target_stage:
            score += 15
            reasons.append(f"阶段部分匹配：企业处于成熟期，政策面向成长期")

        # 区域匹配 (25分)
        policy_region = str(policy.get("region", ""))
        if policy_region == "全国":
            score += 20
            reasons.append("区域要求：全国（无地域限制）")
        else:
            region_parts = policy_region.split("/")
            company_region_parts = company_region.split("/")
            match_count = sum(1 for rp in region_parts if any(rp in crp for crp in company_region_parts))
            if match_count == len(region_parts):
                score += 25
                reasons.append(f"区域完全匹配：{company_region} 包含 {policy_region}")
            elif match_count > 0:
                score += 15
                reasons.append(f"区域部分匹配：{company_region} 部分覆盖 {policy_region}")
            # 额外检查园区名称
            if "漕河泾" in policy_region and "漕河泾" in park_name:
                score += 10
                reasons.append(f"园区匹配：企业入驻 {park_name}")

        # 员工数/规模匹配 (20分)
        requirements = str(policy.get("requirements", ""))
        size_ok = True
        if "≤500人" in requirements and employee_count > 500:
            size_ok = False
            reasons.append(f"规模限制：要求≤500人，企业{employee_count}人（不符合）")
        if "≤100人" in requirements and employee_count > 100:
            size_ok = False
            reasons.append(f"规模限制：要求≤100人，企业{employee_count}人（不符合）")
        if "成立满2年" in requirements:
            founded = company.get("founded_date", "")
            if founded:
                try:
                    founded_date = datetime.strptime(str(founded), "%Y-%m-%d")
                    years = (datetime.now() - founded_date).days / 365
                    if years < 2:
                        size_ok = False
                        reasons.append("成立年限：要求满2年，企业成立时间不足")
                    else:
                        reasons.append(f"成立年限：已满{years:.1f}年（符合≥2年要求）")
                except ValueError:
                    pass
        if "成立≤3年" in requirements:
            founded = company.get("founded_date", "")
            if founded:
                try:
                    founded_date = datetime.strptime(str(founded), "%Y-%m-%d")
                    years = (datetime.now() - founded_date).days / 365
                    if years > 3:
                        size_ok = False
                        reasons.append("成立年限：要求≤3年，企业成立时间超过3年")
                    else:
                        reasons.append(f"成立年限：{years:.1f}年（符合≤3年要求）")
                except ValueError:
                    pass
        if "成立≤5年" in requirements:
            founded = company.get("founded_date", "")
            if founded:
                try:
                    founded_date = datetime.strptime(str(founded), "%Y-%m-%d")
                    years = (datetime.now() - founded_date).days / 365
                    if years > 5:
                        size_ok = False
                        reasons.append("成立年限：要求≤5年，企业成立时间超过5年")
                    else:
                        reasons.append(f"成立年限：{years:.1f}年（符合≤5年要求）")
                except ValueError:
                    pass

        # 营收门槛检查
        if "≥5000万" in requirements:
            if "5000万" not in company_stage and "成熟" not in company_stage:
                size_ok = False
                reasons.append("营收门槛：要求≥5000万，企业营收阶段未达标")

        if "≥1000万" in requirements:
            if "<500万" in company_stage:
                size_ok = False
                reasons.append("营收门槛：要求≥1000万，企业营收<500万")

        if size_ok:
            score += 20
        elif score > 0:
            score += 5

        # 确保分数不超过100
        score = min(score, 100)

        # 要求检查清单
        requirements_list = []
        reqs = str(policy.get("requirements", ""))
        for req in reqs.split("；"):
            req = req.strip()
            if req:
                requirements_list.append(req)

        # 材料清单
        materials_list = []
        mats = str(policy.get("materials_needed", ""))
        for mat in mats.split("；"):
            mat = mat.strip()
            if mat:
                materials_list.append(mat)

        # 缺口分析
        gaps = []
        ip_status = str(company.get("ip_status", ""))
        if "审计报告" in str(materials_list):
            gaps.append({"material": "审计报告", "status": "待准备", "note": "需联系财务咨询机构出具"})
        if "市场占有率" in str(materials_list):
            gaps.append({"material": "市场占有率证明", "status": "待准备", "note": "需联系行业协会或第三方机构"})
        if "知识产权证书" in str(materials_list):
            if "已申请" in ip_status or "专利" in ip_status:
                gaps.append({"material": "知识产权证书", "status": "已准备", "note": f"企业已有：{ip_status}"})
            else:
                gaps.append({"material": "知识产权证书", "status": "待准备", "note": "需补充知识产权申请"})
        if "研发项目" in str(materials_list):
            gaps.append({"material": "研发项目清单", "status": "待整理", "note": "需整理现有研发项目台账"})
        if "人员名单" in str(materials_list) or "科技人员" in str(materials_list):
            gaps.append({"material": "科技人员名单", "status": "待整理", "note": "需整理员工花名册及岗位信息"})
        if "社保" in str(materials_list):
            gaps.append({"material": "社保缴费证明", "status": "待准备", "note": "需到社保中心打印缴费记录"})
        if "营业执照" in str(materials_list):
            gaps.append({"material": "营业执照", "status": "已准备", "note": "企业基本材料"})

        if score > 30:  # 只返回有一定匹配度的政策
            results.append({
                "policy_id": policy.get("policy_id", ""),
                "policy_name": policy.get("policy_name", ""),
                "source": policy.get("source", ""),
                "publish_date": policy.get("publish_date", ""),
                "region": policy.get("region", ""),
                "valid_until": policy.get("valid_until", ""),
                "subsidy_amount": policy.get("subsidy_amount", ""),
                "score": score,
                "reasons": reasons,
                "requirements": requirements_list,
                "materials": materials_list,
                "gaps": gaps,
                "application_url": policy.get("application_url", ""),
                "target_industry": policy.get("target_industry", ""),
                "target_stage": policy.get("target_stage", ""),
            })

    # 按分数降序排列
    results.sort(key=lambda x: x["score"], reverse=True)
    return results


def generate_tickets(company, matched_policies, providers_df):
    """根据匹配结果生成服务工单"""
    tickets = []
    priority_map = {"高": "high", "中": "medium", "低": "low"}

    for i, mp in enumerate(matched_policies):
        if mp["score"] >= 70:
            priority = "高"
            days = 30
        elif mp["score"] >= 50:
            priority = "中"
            days = 60
        else:
            continue  # 低匹配不生成工单

        # 根据服务类型分配服务商
        service_type = "政策申报"
        if "知识产权" in mp["policy_name"] or "贯标" in mp["policy_name"]:
            service_type = "知识产权代理"
            matched_providers = providers_df[providers_df["service_type"].str.contains("知识产权", na=False)]
        elif "审计" in str(mp["materials"]):
            service_type = "财税咨询/审计"
            matched_providers = providers_df[providers_df["service_type"].str.contains("财税", na=False)]
        elif "算力" in mp["policy_name"] or "模型" in mp["policy_name"]:
            service_type = "政策咨询"
            matched_providers = providers_df[providers_df["service_type"].str.contains("政策咨询", na=False)]
        else:
            matched_providers = providers_df[providers_df["service_type"].str.contains("政策|项目申报", na=False)]

        if matched_providers.empty:
            matched_providers = providers_df.head(1)

        provider = matched_providers.iloc[0]

        ticket_id = f"WO-{datetime.now().strftime('%Y%m%d')}-{i+1:03d}"
        due_date = (datetime.now() + timedelta(days=days)).strftime("%Y-%m-%d")

        tickets.append({
            "ticket_id": ticket_id,
            "policy_name": mp["policy_name"],
            "priority": priority,
            "service_type": service_type,
            "company_name": company.get("company_name", ""),
            "provider_name": provider["provider_name"],
            "provider_id": provider["provider_id"],
            "due_date": due_date,
            "score": mp["score"],
            "materials_needed": mp["materials"],
            "gaps": mp["gaps"],
            "status": "待分配",
        })

    return tickets


def get_match_color(score):
    if score >= 70:
        return "green"
    elif score >= 50:
        return "orange"
    else:
        return "gray"


def get_priority_badge(priority):
    colors = {"高": "#dc3545", "中": "#ffc107", "低": "#6c757d"}
    color = colors.get(priority, "#6c757d")
    return f'<span style="background-color:{color};color:white;padding:2px 10px;border-radius:12px;font-weight:bold;">{priority}</span>'


# ──────────────────────────────────────────────
# 侧边栏
# ──────────────────────────────────────────────
parks_df = load_parks()
policies_df = load_policies()
companies_df = load_companies()
providers_df = load_providers()

with st.sidebar:
    st.markdown("### 🏛️ 研策政策智能体")
    st.markdown("*园区服务平台*")
    st.markdown("---")

    # 园区选择
    st.markdown("#### 📍 选择园区")
    park_options = parks_df["park_name"].tolist()
    selected_park = st.selectbox(
        "当前园区",
        park_options,
        key="park_selector",
    )
    st.session_state.selected_park = selected_park

    # 显示园区信息
    park_info = parks_df[parks_df["park_name"] == selected_park].iloc[0]
    st.markdown(f"""
    **园区类型：** {park_info['park_type']}  
    **所在区域：** {park_info['region']}  
    **入驻企业：** {park_info['total_companies']} 家  
    **服务团队：** {park_info['service_staff']} 人
    """)

    st.markdown("---")

    # 导航
    st.markdown("#### 📌 导航菜单")
    nav_options = [
        "📊 园区工作台",
        "📝 企业录入",
        "🔍 政策匹配",
        "📋 材料清单",
        "🎫 服务工单",
        "📈 服务报告",
    ]
    selected_nav = st.radio("选择功能页面", nav_options, label_visibility="collapsed")

    st.markdown("---")
    st.markdown(
        '<div style="font-size:0.75rem;color:#999;text-align:center;">'
        '研策政策智能体 v1.0<br>仅供产业园区服务使用</div>',
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# 免责声明横幅
# ──────────────────────────────────────────────
st.markdown(
    '<div class="disclaimer-banner">'
    '⚠️ <strong>免责声明：</strong>本系统为辅助工具，政策申报结果以官方审核为准。'
    '所有建议需经人工复核后执行。本系统不涉及任何金融投资、股票、证券相关内容。'
    '</div>',
    unsafe_allow_html=True,
)


# ══════════════════════════════════════════════
# 页面：园区工作台
# ══════════════════════════════════════════════
if selected_nav == "📊 园区工作台":
    st.markdown('<div class="main-header">📊 园区工作台</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="sub-header">{selected_park} · 服务总览</div>', unsafe_allow_html=True)

    # 获取园区企业
    park_companies = companies_df[companies_df["park_name"] == selected_park]
    company_count = len(park_companies)
    total_in_park = int(park_info["total_companies"])

    # 模拟统计数据
    high_priority_count = 0
    medium_priority_count = 0
    material_gap_count = 0
    expiring_count = 0

    for _, comp in park_companies.iterrows():
        matches = match_policies(comp.to_dict(), policies_df)
        for m in matches:
            if m["score"] >= 70:
                high_priority_count += 1
            elif m["score"] >= 50:
                medium_priority_count += 1
            material_gap_count += len([g for g in m["gaps"] if g["status"] in ["待准备", "待整理"]])

    # 检查即将到期的政策（6个月内）
    for _, policy in policies_df.iterrows():
        try:
            valid_until = datetime.strptime(str(policy["valid_until"]), "%Y-%m-%d")
            if valid_until < datetime.now() + timedelta(days=180):
                expiring_count += 1
        except (ValueError, TypeError):
            pass

    # 指标卡片
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{total_in_park}</div>
            <div class="metric-label">园区企业总数</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
        <div class="metric-card-green">
            <div class="metric-value">{company_count}</div>
            <div class="metric-label">已录入服务企业</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="metric-card-orange">
            <div class="metric-value">{high_priority_count}</div>
            <div class="metric-label">高优先级政策匹配</div>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown(f"""
        <div class="metric-card-blue">
            <div class="metric-value">{material_gap_count}</div>
            <div class="metric-label">材料缺口总数</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("")

    col5, col6, col7 = st.columns(3)
    with col5:
        st.metric("中优先级政策", medium_priority_count)
    with col6:
        st.metric("待处理工单", len(st.session_state.service_tickets))
    with col7:
        st.metric("即将到期政策（6个月内）", expiring_count)

    st.markdown("---")

    # 本周服务推荐
    st.markdown("### 📅 本周服务推荐")

    if company_count > 0:
        recommendations = []
        for _, comp in park_companies.iterrows():
            matches = match_policies(comp.to_dict(), policies_df)
            for m in matches[:2]:  # 每家企业取前2个匹配
                if m["score"] >= 60:
                    recommendations.append({
                        "企业": comp["company_name"],
                        "推荐政策": m["policy_name"],
                        "匹配度": f"{m['score']}%",
                        "建议行动": f"准备{len(m['materials'])}项申报材料",
                        "优先级": "高" if m["score"] >= 70 else "中",
                    })

        if recommendations:
            rec_df = pd.DataFrame(recommendations)
            st.dataframe(rec_df, use_container_width=True, hide_index=True)
        else:
            st.info("暂无高优先级服务推荐。请先完成企业录入和政策匹配。")
    else:
        st.info("该园区暂无已录入企业。请前往「企业录入」页面添加企业信息。")

    # 园区企业列表
    if company_count > 0:
        st.markdown("### 🏢 园区已录入企业")
        display_cols = ["company_name", "industry", "employee_count", "revenue_stage", "current_needs"]
        rename_map = {
            "company_name": "企业名称",
            "industry": "行业",
            "employee_count": "员工数",
            "revenue_stage": "营收阶段",
            "current_needs": "当前需求",
        }
        st.dataframe(
            park_companies[display_cols].rename(columns=rename_map),
            use_container_width=True,
            hide_index=True,
        )


# ══════════════════════════════════════════════
# 页面：企业录入
# ══════════════════════════════════════════════
elif selected_nav == "📝 企业录入":
    st.markdown('<div class="main-header">📝 企业录入</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="sub-header">{selected_park} · 新增/选择企业</div>', unsafe_allow_html=True)

    # 预填示例数据按钮
    col1, col2 = st.columns([3, 1])
    with col2:
        if st.button("📥 使用示例数据预填"):
            park_companies = companies_df[companies_df["park_name"] == selected_park]
            if not park_companies.empty:
                sample = park_companies.iloc[0].to_dict()
                st.session_state.prefill_data = sample
                st.rerun()
            else:
                st.warning("该园区暂无示例企业数据")

    st.markdown("---")

    # 从已有企业中选择
    st.markdown("#### 📂 从已有企业中选择")
    park_companies = companies_df[companies_df["park_name"] == selected_park]

    if not park_companies.empty:
        company_names = park_companies["company_name"].tolist()
        selected_company_name = st.selectbox("选择企业", ["-- 新建企业 --"] + company_names, key="company_select")

        if selected_company_name != "-- 新建企业 --":
            company_data = park_companies[park_companies["company_name"] == selected_company_name].iloc[0].to_dict()
            st.session_state.current_company = company_data
            st.session_state.company_entered = True

            # 自动触发匹配
            matches = match_policies(company_data, policies_df)
            st.session_state.matched_policies = matches

            # 生成工单
            tickets = generate_tickets(company_data, matches, providers_df)
            st.session_state.service_tickets = tickets

            st.success(f"已选择企业：{selected_company_name}，匹配到 {len(matches)} 条政策")
            st.info("👉 请前往「政策匹配」页面查看详细匹配结果")

    st.markdown("---")

    # 新建企业表单
    st.markdown("#### ✏️ 新建企业")
    with st.form("company_form", clear_on_submit=False):
        fc1, fc2 = st.columns(2)
        with fc1:
            form_park = st.selectbox("所在园区", [selected_park], key="form_park")
            form_name = st.text_input("企业名称 *", key="form_name",
                                       value=st.session_state.get("prefill_data", {}).get("company_name", ""))
            form_region = st.text_input("所在区域", key="form_region",
                                         value=st.session_state.get("prefill_data", {}).get("region", "") or str(park_info["region"]))
            form_industry = st.selectbox("所属行业", [
                "人工智能", "大数据", "半导体", "生物医药", "智能制造",
                "物联网", "文化创意", "医疗器械", "软件/信息技术", "新材料",
                "新能源", "全行业",
            ], key="form_industry")
            form_founded = st.date_input("成立日期", key="form_founded",
                                          value=datetime(2021, 1, 1))
        with fc2:
            form_employees = st.number_input("员工人数", min_value=1, max_value=10000, value=50, key="form_employees")
            form_revenue = st.selectbox("营收阶段", [
                "初创期（<500万）",
                "成长期（500万-5000万）",
                "成熟期（>5000万）",
            ], key="form_revenue")
            form_ip = st.text_area("知识产权情况", key="form_ip", height=80,
                                    value=st.session_state.get("prefill_data", {}).get("ip_status", "") or "")
            form_needs = st.multiselect("当前需求", [
                "政策申报", "融资对接", "人才引进", "市场拓展",
                "资质认证", "产学研合作", "产业链对接", "场地补贴",
                "创业指导", "技术合作", "海外市场", "人才招聘",
            ], default=["政策申报"], key="form_needs")

        form_note = st.text_area("服务备注", key="form_note", height=80)

        submitted = st.form_submit_button("✅ 提交企业信息", use_container_width=True)

        if submitted:
            if not form_name:
                st.error("请填写企业名称")
            else:
                new_company = {
                    "company_id": f"C{hashlib.md5(form_name.encode()).hexdigest()[:4].upper()}",
                    "company_name": form_name,
                    "park_name": form_park,
                    "region": form_region,
                    "industry": form_industry,
                    "founded_date": form_founded.strftime("%Y-%m-%d"),
                    "employee_count": form_employees,
                    "revenue_stage": form_revenue,
                    "ip_status": form_ip,
                    "current_needs": "；".join(form_needs),
                    "notes": form_note,
                }
                st.session_state.current_company = new_company
                st.session_state.company_entered = True

                # 自动触发匹配
                matches = match_policies(new_company, policies_df)
                st.session_state.matched_policies = matches

                # 生成工单
                tickets = generate_tickets(new_company, matches, providers_df)
                st.session_state.service_tickets = tickets

                st.success(f"企业「{form_name}」录入成功！匹配到 {len(matches)} 条政策。")
                st.info("👉 请前往「政策匹配」页面查看详细匹配结果")


# ══════════════════════════════════════════════
# 页面：政策匹配
# ══════════════════════════════════════════════
elif selected_nav == "🔍 政策匹配":
    st.markdown('<div class="main-header">🔍 政策匹配</div>', unsafe_allow_html=True)

    if not st.session_state.company_entered or not st.session_state.current_company:
        st.warning("请先在「企业录入」页面选择或创建企业，然后进行政策匹配。")
    else:
        company = st.session_state.current_company
        st.markdown(f'<div class="sub-header">企业：{company["company_name"]}</div>', unsafe_allow_html=True)

        # 企业画像卡片
        with st.expander("📋 企业画像详情", expanded=True):
            ic1, ic2, ic3 = st.columns(3)
            with ic1:
                st.markdown(f"""
                **行业：** {company.get('industry', 'N/A')}  
                **成立日期：** {company.get('founded_date', 'N/A')}  
                **员工数：** {company.get('employee_count', 'N/A')} 人
                """)
            with ic2:
                st.markdown(f"""
                **营收阶段：** {company.get('revenue_stage', 'N/A')}  
                **所在区域：** {company.get('region', 'N/A')}  
                **园区：** {company.get('park_name', 'N/A')}
                """)
            with ic3:
                st.markdown(f"""
                **知识产权：** {company.get('ip_status', 'N/A')}  
                **当前需求：** {company.get('current_needs', 'N/A')}
                """)

        st.markdown("---")

        # 重新匹配按钮
        if st.button("🔄 重新匹配"):
            matches = match_policies(company, policies_df)
            st.session_state.matched_policies = matches
            tickets = generate_tickets(company, matches, providers_df)
            st.session_state.service_tickets = tickets
            st.rerun()

        # 匹配结果
        matches = st.session_state.matched_policies
        if not matches:
            st.info("暂无匹配结果。请检查企业信息是否完整，或尝试重新匹配。")
        else:
            # 匹配概览
            high_count = len([m for m in matches if m["score"] >= 70])
            medium_count = len([m for m in matches if 50 <= m["score"] < 70])
            low_count = len([m for m in matches if m["score"] < 50])

            mc1, mc2, mc3 = st.columns(3)
            with mc1:
                st.metric("🟢 高匹配度（≥70%）", high_count)
            with mc2:
                st.metric("🟡 中匹配度（50-69%）", medium_count)
            with mc3:
                st.metric("⚪ 低匹配度（<50%）", low_count)

            st.markdown("---")

            # 逐条展示匹配结果
            for i, m in enumerate(matches):
                score = m["score"]
                color = get_match_color(score)

                # 匹配度标签
                if score >= 70:
                    level = "高匹配"
                    icon = "🟢"
                elif score >= 50:
                    level = "中匹配"
                    icon = "🟡"
                else:
                    level = "低匹配"
                    icon = "⚪"

                with st.expander(f"{icon} [{score}%] {m['policy_name']} — {level}", expanded=(i < 3)):
                    # 基本信息
                    bc1, bc2, bc3 = st.columns(3)
                    with bc1:
                        st.markdown(f"""
                        **政策来源：** {m['source']}  
                        **发布日期：** {m['publish_date']}  
                        **适用区域：** {m['region']}
                        """)
                    with bc2:
                        st.markdown(f"""
                        **目标行业：** {m['target_industry']}  
                        **目标阶段：** {m['target_stage']}  
                        **有效期至：** {m['valid_until']}
                        """)
                    with bc3:
                        st.markdown(f"""
                        **补贴/优惠：** {m['subsidy_amount']}  
                        **官方链接：** [申请入口]({m['application_url']})
                        """)

                    st.markdown("")

                    # 匹配理由
                    st.markdown("**匹配理由：**")
                    for reason in m["reasons"]:
                        st.markdown(f"- {reason}")

                    st.markdown("")

                    # 要求检查清单
                    st.markdown("**要求检查清单：**")
                    for req in m["requirements"]:
                        # 简单判断是否可能满足
                        ip_status = str(company.get("ip_status", ""))
                        employee_count = int(company.get("employee_count", 0))

                        check_icon = "⬜"
                        if "知识产权" in req and ("已申请" in ip_status or "专利" in ip_status):
                            check_icon = "✅"
                        elif "科技人员" in req:
                            check_icon = "⚠️"
                        elif "≤500人" in req and employee_count <= 500:
                            check_icon = "✅"
                        elif "≤100人" in req and employee_count <= 100:
                            check_icon = "✅"
                        elif "上海" in req and "上海" in str(company.get("region", "")):
                            check_icon = "✅"
                        st.markdown(f"  {check_icon} {req}")

                    st.markdown("")

                    # 所需材料
                    st.markdown("**申报材料：**")
                    for mat in m["materials"]:
                        st.markdown(f"  - 📄 {mat}")

                    # 风险提醒
                    st.markdown("")
                    st.info(f"**人工复核要点：** 建议核实企业是否完全满足上述所有要求，特别是财务指标和知识产权相关条件。申报前请确认政策是否仍在有效期内。")


# ══════════════════════════════════════════════
# 页面：材料清单
# ══════════════════════════════════════════════
elif selected_nav == "📋 材料清单":
    st.markdown('<div class="main-header">📋 材料清单</div>', unsafe_allow_html=True)

    if not st.session_state.company_entered or not st.session_state.matched_policies:
        st.warning("请先完成企业录入和政策匹配，然后查看材料清单。")
    else:
        company = st.session_state.current_company
        st.markdown(f'<div class="sub-header">企业：{company["company_name"]}</div>', unsafe_allow_html=True)

        matches = st.session_state.matched_policies

        # 汇总所有材料
        all_materials = {}
        for m in matches:
            if m["score"] >= 50:
                for mat in m["materials"]:
                    if mat not in all_materials:
                        all_materials[mat] = {
                            "material": mat,
                            "policies": [],
                            "status": "待准备",
                            "note": "",
                        }
                    all_materials[mat]["policies"].append(m["policy_name"])

                for gap in m["gaps"]:
                    if gap["material"] in all_materials:
                        all_materials[gap["material"]]["status"] = gap["status"]
                        all_materials[gap["material"]]["note"] = gap["note"]

        if not all_materials:
            st.info("暂无需要准备的申报材料。")
        else:
            # 统计
            prepared = len([m for m in all_materials.values() if m["status"] == "已准备"])
            pending = len([m for m in all_materials.values() if m["status"] == "待准备"])
            organizing = len([m for m in all_materials.values() if m["status"] == "待整理"])
            total = len(all_materials)

            mc1, mc2, mc3, mc4 = st.columns(4)
            with mc1:
                st.metric("材料总数", total)
            with mc2:
                st.metric("✅ 已准备", prepared)
            with mc3:
                st.metric("⏳ 待准备", pending)
            with mc4:
                st.metric("📝 待整理", organizing)

            st.markdown("---")

            # 材料清单表格
            st.markdown("### 📄 申报材料清单")

            material_rows = []
            for mat_name, mat_info in all_materials.items():
                status_icon = {"已准备": "✅", "待准备": "❌", "待整理": "⚠️"}.get(mat_info["status"], "⬜")
                material_rows.append({
                    "材料名称": mat_name,
                    "状态": f"{status_icon} {mat_info['status']}",
                    "对应政策": "、".join(mat_info["policies"]),
                    "备注": mat_info["note"],
                })

            mat_df = pd.DataFrame(material_rows)
            st.dataframe(mat_df, use_container_width=True, hide_index=True)

            st.markdown("---")

            # 缺口分析
            st.markdown("### 🔍 材料缺口分析")
            gap_materials = [m for m in all_materials.values() if m["status"] != "已准备"]
            if gap_materials:
                for g in gap_materials:
                    status_icon = "❌" if g["status"] == "待准备" else "⚠️"
                    st.markdown(f"**{status_icon} {g['material']}**")
                    st.markdown(f"  - 状态：{g['status']}")
                    st.markdown(f"  - 对应政策：{'、'.join(g['policies'])}")
                    if g["note"]:
                        st.markdown(f"  - 建议：{g['note']}")
                    st.markdown("")
            else:
                st.success("所有申报材料均已准备就绪！")

            # 按政策分组展示
            st.markdown("---")
            st.markdown("### 📂 按政策分组查看")
            for m in matches:
                if m["score"] >= 50:
                    with st.expander(f"{'🟢' if m['score']>=70 else '🟡'} {m['policy_name']}（{m['score']}%）"):
                        for mat in m["materials"]:
                            mat_status = all_materials.get(mat, {}).get("status", "待准备")
                            icon = {"已准备": "✅", "待准备": "❌", "待整理": "⚠️"}.get(mat_status, "⬜")
                            st.markdown(f"  {icon} {mat}")


# ══════════════════════════════════════════════
# 页面：服务工单
# ══════════════════════════════════════════════
elif selected_nav == "🎫 服务工单":
    st.markdown('<div class="main-header">🎫 服务工单</div>', unsafe_allow_html=True)

    if not st.session_state.company_entered or not st.session_state.service_tickets:
        st.warning("请先完成企业录入和政策匹配，系统将根据匹配结果自动生成服务工单。")
    else:
        company = st.session_state.current_company
        tickets = st.session_state.service_tickets
        st.markdown(f'<div class="sub-header">企业：{company["company_name"]}</div>', unsafe_allow_html=True)

        # 工单统计
        high_tickets = len([t for t in tickets if t["priority"] == "高"])
        medium_tickets = len([t for t in tickets if t["priority"] == "中"])
        low_tickets = len([t for t in tickets if t["priority"] == "低"])

        tc1, tc2, tc3, tc4 = st.columns(4)
        with tc1:
            st.metric("工单总数", len(tickets))
        with tc2:
            st.metric("🔴 高优先级", high_tickets)
        with tc3:
            st.metric("🟡 中优先级", medium_tickets)
        with tc4:
            st.metric("⚪ 低优先级", low_tickets)

        st.markdown("---")

        # 工单列表
        for i, ticket in enumerate(tickets):
            priority_icon = {"高": "🔴", "中": "🟡", "低": "⚪"}.get(ticket["priority"], "⚪")

            with st.expander(f"{priority_icon} [{ticket['ticket_id']}] {ticket['policy_name']} — {ticket['priority']}优先级", expanded=(i < 2)):
                tc_left, tc_right = st.columns(2)
                with tc_left:
                    st.markdown(f"""
                    **工单编号：** {ticket['ticket_id']}  
                    **服务类型：** {ticket['service_type']}  
                    **目标企业：** {ticket['company_name']}  
                    **匹配度：** {ticket['score']}%
                    """)
                with tc_right:
                    st.markdown(f"""
                    **建议服务商：** {ticket['provider_name']}  
                    **截止日期：** {ticket['due_date']}  
                    **工单状态：** {ticket['status']}  
                    **优先级：** {get_priority_badge(ticket['priority'])}
                    """, unsafe_allow_html=True)

                st.markdown("")
                st.markdown("**所需材料：**")
                for mat in ticket["materials_needed"]:
                    st.markdown(f"  - 📄 {mat}")

                if ticket["gaps"]:
                    st.markdown("")
                    st.markdown("**材料缺口：**")
                    for gap in ticket["gaps"]:
                        icon = {"已准备": "✅", "待准备": "❌", "待整理": "⚠️"}.get(gap["status"], "⬜")
                        st.markdown(f"  {icon} {gap['material']}：{gap['note']}")

                st.markdown("")
                bc1, bc2 = st.columns(2)
                with bc1:
                    if st.button(f"✅ 标记为进行中", key=f"start_{i}"):
                        st.session_state.service_tickets[i]["status"] = "进行中"
                        st.rerun()
                with bc2:
                    if st.button(f"✔️ 标记为已完成", key=f"done_{i}"):
                        st.session_state.service_tickets[i]["status"] = "已完成"
                        st.rerun()

        st.markdown("---")

        # 工单汇总表
        st.markdown("### 📊 工单汇总")
        ticket_rows = []
        for t in tickets:
            ticket_rows.append({
                "工单编号": t["ticket_id"],
                "政策": t["policy_name"],
                "优先级": t["priority"],
                "服务商": t["provider_name"],
                "截止日期": t["due_date"],
                "状态": t["status"],
            })
        ticket_df = pd.DataFrame(ticket_rows)
        st.dataframe(ticket_df, use_container_width=True, hide_index=True)


# ══════════════════════════════════════════════
# 页面：服务报告
# ══════════════════════════════════════════════
elif selected_nav == "📈 服务报告":
    st.markdown('<div class="main-header">📈 园区服务报告</div>', unsafe_allow_html=True)

    # 报告类型选择
    report_type = st.radio(
        "选择报告类型",
        ["生成当前企业服务报告", "查看完整示例报告"],
        horizontal=True,
    )

    if report_type == "查看完整示例报告":
        st.markdown("### 📄 漕河泾开发区 · 示例服务报告")
        report_content = load_sample_report()
        st.markdown(report_content)

        # 导出按钮
        st.markdown("---")
        st.download_button(
            label="📥 导出示例报告 (Markdown)",
            data=report_content,
            file_name="sample_park_policy_report.md",
            mime="text/markdown",
        )

    else:
        if not st.session_state.company_entered or not st.session_state.current_company:
            st.warning("请先完成企业录入和政策匹配，然后生成服务报告。")
        else:
            company = st.session_state.current_company
            matches = st.session_state.matched_policies
            tickets = st.session_state.service_tickets

            if st.button("📝 生成服务报告", use_container_width=True):
                st.session_state.report_generated = True
                st.rerun()

            if st.session_state.get("report_generated", False):
                # 生成报告内容
                now = datetime.now()
                report_id = f"YC-{now.strftime('%Y-%m%d')}-{hashlib.md5(company['company_name'].encode()).hexdigest()[:4].upper()}"

                report_lines = []
                report_lines.append(f"# 园区政策服务报告\n")
                report_lines.append(f"**报告日期：** {now.strftime('%Y-%m-%d')}\n")
                report_lines.append(f"**园区名称：** {company.get('park_name', 'N/A')}\n")
                report_lines.append(f"**报告生成人：** 研策政策智能体\n")
                report_lines.append(f"**报告编号：** {report_id}\n")
                report_lines.append("---\n")

                # 1. 园区服务摘要
                high_m = [m for m in matches if m["score"] >= 70]
                medium_m = [m for m in matches if 50 <= m["score"] < 70]
                low_m = [m for m in matches if m["score"] < 50]
                total_gaps = sum(len([g for g in m["gaps"] if g["status"] != "已准备"]) for m in matches)

                report_lines.append(f"## 1. 园区服务摘要\n")
                report_lines.append(f"| 指标 | 数值 |")
                report_lines.append(f"|------|------|")
                report_lines.append(f"| 服务覆盖企业 | 1 家（{company['company_name']}） |")
                report_lines.append(f"| 可匹配政策数量 | {len(matches)} 条 |")
                report_lines.append(f"| 高优先级匹配 | {len(high_m)} 条 |")
                report_lines.append(f"| 中优先级匹配 | {len(medium_m)} 条 |")
                report_lines.append(f"| 暂不建议推动 | {len(low_m)} 条 |")
                report_lines.append(f"| 材料缺口总数 | {total_gaps} 项 |")
                report_lines.append(f"| 待处理服务工单 | {len(tickets)} 个 |")
                report_lines.append("")

                # 2. 企业画像
                report_lines.append(f"## 2. 企业画像\n")
                report_lines.append(f"| 属性 | 内容 |")
                report_lines.append(f"|------|------|")
                report_lines.append(f"| 企业名称 | {company.get('company_name', 'N/A')} |")
                report_lines.append(f"| 行业 | {company.get('industry', 'N/A')} |")
                report_lines.append(f"| 成立日期 | {company.get('founded_date', 'N/A')} |")
                report_lines.append(f"| 员工数 | {company.get('employee_count', 'N/A')} 人 |")
                report_lines.append(f"| 营收阶段 | {company.get('revenue_stage', 'N/A')} |")
                report_lines.append(f"| 知识产权 | {company.get('ip_status', 'N/A')} |")
                report_lines.append(f"| 当前需求 | {company.get('current_needs', 'N/A')} |")
                report_lines.append("")

                # 3. 当前阶段判断
                report_lines.append(f"## 3. 当前阶段判断\n")
                stage = company.get('revenue_stage', '')
                if '初创' in stage:
                    stage_judge = "初创期"
                    stage_detail = "企业处于早期发展阶段，重点需求为降低运营成本、获取资质背书、吸引核心团队"
                    stage_dir = "建议优先申报：科技型中小企业评价 → 创业补贴 → 算力券/模型券"
                elif '成长' in stage:
                    stage_judge = "快速成长期"
                    stage_detail = "企业已度过初创期，产品进入商业化阶段，重点需求为提升资质等级、扩大市场份额"
                    stage_dir = "建议优先申报：高新技术企业认定 → 专精特新 → 技术合同认定"
                else:
                    stage_judge = "成熟期"
                    stage_detail = "企业已具备规模化运营能力，重点需求为行业地位巩固、海外市场拓展"
                    stage_dir = "建议优先申报：科技小巨人 → 首版次软件 → 产业链对接"

                report_lines.append(f"- **阶段判断：** {stage_judge}")
                report_lines.append(f"- **判断依据：** {stage_detail}")
                report_lines.append(f"- **申报方向：** {stage_dir}")
                report_lines.append("")

                # 4. 可匹配政策资源
                report_lines.append(f"## 4. 可匹配政策资源\n")
                report_lines.append(f"| 序号 | 政策名称 | 匹配度 | 优先级 |")
                report_lines.append(f"|------|----------|--------|--------|")
                for i, m in enumerate(matches):
                    if m["score"] >= 70:
                        p = "高"
                    elif m["score"] >= 50:
                        p = "中"
                    else:
                        p = "低"
                    report_lines.append(f"| {i+1} | {m['policy_name']} | {m['score']}% | {p} |")
                report_lines.append("")

                # 5. 高优先级服务事项
                report_lines.append(f"## 5. 高优先级服务事项\n")
                for m in high_m:
                    report_lines.append(f"### {m['policy_name']}\n")
                    report_lines.append(f"| 字段 | 内容 |")
                    report_lines.append(f"|------|------|")
                    report_lines.append(f"| **政策来源** | {m['source']} |")
                    report_lines.append(f"| **发布日期** | {m['publish_date']} |")
                    report_lines.append(f"| **适用区域** | {m['region']} |")
                    report_lines.append(f"| **目标企业** | {company['company_name']} |")
                    report_lines.append(f"| **匹配理由** | {'；'.join(m['reasons'][:3])} |")
                    report_lines.append(f"| **材料要求** | {'；'.join(m['materials'][:5])} |")
                    report_lines.append(f"| **有效期至** | {m['valid_until']} |")
                    report_lines.append(f"| **补贴/优惠** | {m['subsidy_amount']} |")
                    report_lines.append(f"| **风险提醒** | 需确认企业完全满足所有申报条件，建议提前3个月准备 |")
                    report_lines.append(f"| **人工复核要点** | 核实财务指标和知识产权相关条件 |")
                    report_lines.append(f"| **下一步行动** | 联系对应服务商，启动材料准备 |")
                    report_lines.append("")

                # 6. 中优先级服务事项
                report_lines.append(f"## 6. 中优先级服务事项\n")
                if medium_m:
                    for m in medium_m:
                        report_lines.append(f"### {m['policy_name']}\n")
                        report_lines.append(f"| 字段 | 内容 |")
                        report_lines.append(f"|------|------|")
                        report_lines.append(f"| **政策来源** | {m['source']} |")
                        report_lines.append(f"| **目标企业** | {company['company_name']} |")
                        report_lines.append(f"| **匹配理由** | {'；'.join(m['reasons'][:3])} |")
                        report_lines.append(f"| **有效期至** | {m['valid_until']} |")
                        report_lines.append(f"| **人工复核要点** | 核实企业是否满足所有申报条件 |")
                        report_lines.append("")
                else:
                    report_lines.append("暂无中优先级服务事项。\n")

                # 7. 暂不建议推动事项
                report_lines.append(f"## 7. 暂不建议推动事项\n")
                if low_m:
                    for m in low_m:
                        report_lines.append(f"- **{m['policy_name']}**：匹配度仅{m['score']}%，暂不满足核心申报条件")
                    report_lines.append("")
                else:
                    report_lines.append("暂无暂不建议推动的事项。\n")

                # 8. 材料缺口
                report_lines.append(f"## 8. 材料缺口\n")
                report_lines.append(f"| 序号 | 所需材料 | 对应政策 | 当前状态 | 缺口说明 |")
                report_lines.append(f"|------|----------|----------|----------|----------|")
                gap_idx = 1
                for m in matches:
                    if m["score"] >= 50:
                        for gap in m["gaps"]:
                            if gap["status"] != "已准备":
                                report_lines.append(f"| {gap_idx} | {gap['material']} | {m['policy_name']} | {gap['status']} | {gap['note']} |")
                                gap_idx += 1
                report_lines.append("")

                # 9. 政策来源与引用
                report_lines.append(f"## 9. 政策来源与引用\n")
                report_lines.append(f"| 政策名称 | 来源机构 | 官方链接 | 发布日期 |")
                report_lines.append(f"|----------|----------|----------|----------|")
                for m in matches:
                    report_lines.append(f"| {m['policy_name']} | {m['source']} | {m['application_url']} | {m['publish_date']} |")
                report_lines.append("")

                # 10. 风险与失效条件
                report_lines.append(f"## 10. 风险与失效条件\n")
                report_lines.append(f"| 风险类型 | 说明 | 应对措施 |")
                report_lines.append(f"|----------|------|----------|")
                report_lines.append(f"| 政策变动风险 | 政策可能随时调整或终止 | 定期跟踪官方公告 |")
                report_lines.append(f"| 窗口期风险 | 部分政策有固定申报窗口 | 提前准备材料，关注申报通知 |")
                report_lines.append(f"| 额度限制风险 | 补贴资金有限，先到先得 | 尽早提交申请 |")
                report_lines.append(f"| 信息滞后风险 | 系统数据可能与最新政策不同步 | 申报前核实官方最新要求 |")
                report_lines.append("")

                # 11. 人工复核清单
                report_lines.append(f"## 11. 人工复核清单\n")
                report_lines.append(f"| 序号 | 复核事项 | 对应政策 | 复核原因 |")
                report_lines.append(f"|------|----------|----------|----------|")
                review_idx = 1
                for m in matches:
                    if m["score"] >= 50:
                        report_lines.append(f"| {review_idx} | 核实财务指标是否达标 | {m['policy_name']} | 需确认研发费用占比和营收数据 |")
                        review_idx += 1
                        report_lines.append(f"| {review_idx} | 核实知识产权有效性 | {m['policy_name']} | 需确认专利/软著在有效期内 |")
                        review_idx += 1
                report_lines.append("")

                # 12. 服务工单建议
                report_lines.append(f"## 12. 服务工单建议\n")
                if tickets:
                    for t in tickets:
                        report_lines.append(f"### 工单 {t['ticket_id']}\n")
                        report_lines.append(f"| 字段 | 内容 |")
                        report_lines.append(f"|------|------|")
                        report_lines.append(f"| 工单编号 | {t['ticket_id']} |")
                        report_lines.append(f"| 优先级 | {t['priority']} |")
                        report_lines.append(f"| 政策 | {t['policy_name']} |")
                        report_lines.append(f"| 服务商 | {t['provider_name']} |")
                        report_lines.append(f"| 截止日期 | {t['due_date']} |")
                        report_lines.append(f"| 状态 | {t['status']} |")
                        report_lines.append("")
                else:
                    report_lines.append("暂无服务工单。\n")

                # 13. 30天服务计划
                report_lines.append(f"## 13. 30天服务计划\n")
                report_lines.append(f"| 周次 | 日期范围 | 行动项 | 预期产出 |")
                report_lines.append(f"|------|----------|--------|----------|")
                base = datetime.now()
                for week in range(4):
                    start = (base + timedelta(weeks=week)).strftime("%m月%d日")
                    end = (base + timedelta(weeks=week, days=6)).strftime("%m月%d日")
                    if week == 0:
                        action = "联系服务商确认合作；启动材料准备"
                        output = "确认服务方案"
                    elif week == 1:
                        action = "完成核心材料整理；提交初步申请"
                        output = "材料包初稿"
                    elif week == 2:
                        action = "补充完善材料；提交正式申请"
                        output = "正式提交申报"
                    else:
                        action = "跟踪审核进度；补充反馈材料"
                        output = "进入审核流程"
                    report_lines.append(f"| 第{week+1}周 | {start}-{end} | {action} | {output} |")
                report_lines.append("")

                # 14. 90天园区跟进计划
                report_lines.append(f"## 14. 90天园区跟进计划\n")
                report_lines.append(f"| 月份 | 重点工作 | 预期成果 |")
                report_lines.append(f"|------|----------|----------|")
                report_lines.append(f"| 第1个月 | 完成高优先级政策申报准备和提交 | 核心申报材料完成并提交 |")
                report_lines.append(f"| 第2个月 | 推进中优先级政策；跟踪高优先级审核进度 | 中优先级材料提交；高优先级进入审核 |")
                report_lines.append(f"| 第3个月 | 完成所有匹配政策申报；评估新增企业 | 全部政策提交；扩展服务覆盖范围 |")
                report_lines.append("")

                report_lines.append(f"---\n")
                report_lines.append(f"*本报告由研策政策智能体自动生成，仅供参考。政策申报结果以官方审核为准，所有建议需经人工复核后执行。*\n")
                report_lines.append(f"**报告生成时间：** {now.strftime('%Y-%m-%d %H:%M:%S')}\n")

                report_content = "\n".join(report_lines)

                # 显示报告
                st.markdown(report_content)

                st.markdown("---")
                st.download_button(
                    label="📥 导出报告 (Markdown)",
                    data=report_content,
                    file_name=f"park_report_{company['company_name']}_{now.strftime('%Y%m%d')}.md",
                    mime="text/markdown",
                    use_container_width=True,
                )
