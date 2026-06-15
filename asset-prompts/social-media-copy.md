# Social Media Copy Templates — YanCe Policy Agent

Ready-to-use social media copy for WeChat, Weibo, and LinkedIn announcements.

---

## 1. WeChat Official Account (微信公众号)

### Post 1: Product Launch Announcement

**Title:** 衍策政策Agent正式上线 — 让园区企业服务从人工表格变成AI工作流

**Summary (摘要):** 一个轻量级政策匹配Agent，帮助园区管理者快速匹配政策、生成服务工单、追踪材料差距。从徐汇AI创新园区开始验证。

**Body:**

```
在产业园区的日常运营中，企业服务团队常常面临这样的困境：

- 政策文件堆积如山，不知道哪家企业符合哪项政策
- 用Excel手工比对企业信息，耗时且容易遗漏
- 错过政策申报截止日期，企业错失补贴机会
- 服务工单没有优先级，团队疲于应付

今天，我们正式发布衍策政策Agent — 一个专为产业园区设计的政策匹配AI工具。

核心能力：
1. 一键政策匹配 — 输入企业信息，秒级匹配适用政策，评分0-100
2. 材料差距分析 — 自动识别缺少的申报材料，按紧急程度排序
3. 服务工单生成 — 生成优先级排序的服务任务，分配给对应团队
4. 全程可追溯 — 每条推荐都有来源、日期、发布机构、区域信息
5. 人工复核点 — 明确标注需要人工判断的环节，AI不替代决策

技术特点：
- 规则引擎透明可审计，不是黑箱
- 支持JSON输入/输出，可对接现有系统
- 每条推荐附带风险提示和截止日期

首个验证场景：徐汇AI创新园区
我们为园区内的AI企业衍策引擎（上海）科技有限公司完成了首次政策匹配，
成功识别6项适用政策，最高匹配度92分，生成4张服务工单。

这不是投资工具，不提供金融建议。
它只专注于一个目标：让园区企业服务更智能、更高效、更可追溯。

点击阅读原文，查看完整Demo和开源代码。
```

**Cover Image:** Poster 1 (园区公司的政策服务Agent)

---

### Post 2: Technical Deep-Dive

**Title:** 衍策政策Agent技术解析 — 规则匹配引擎是如何工作的？

**Summary (摘要):** 深入解读衍策引擎的评分体系、材料差距分析逻辑和可追溯性设计。

**Body:**

```
很多朋友问：衍策政策Agent的匹配逻辑是什么？今天做一个技术解析。

一、评分体系（总分100分）

我们的规则引擎基于8个维度进行加权评分：

| 维度 | 权重 | 说明 |
|------|------|------|
| 行业匹配 | 30% | 企业行业是否在政策覆盖范围 |
| 区域匹配 | 20% | 企业注册地是否属于政策区域 |
| 阶段匹配 | 15% | 发展阶段是否符合政策要求 |
| 人员规模 | 10% | 员工人数是否在范围内 |
| 研发占比 | 10% | R&D投入是否达标 |
| 知识产权 | 5% | 是否拥有必要IP |
| 资质认定 | 5% | 高企认定等 |
| 中小企业 | 5% | SME标准 |

二、推荐等级

- 70分+无重大缺口 → 推荐申请
- 50-70分+少量缺口 → 建议补充材料后申请
- 30-50分 → 建议进一步评估
- 30分以下 → 暂不推荐

三、材料差距分析

系统会自动比对政策要求的材料清单与企业现有数据，
标记"已有"和"缺少"的材料，并按紧急程度排序。

四、可追溯性

每条推荐都附带：
- 政策来源URL
- 发布日期和发布机构
- 适用区域
- 申请截止日期
- 风险提示

五、人工复核点

对于无法自动验证的材料（如审计报告、项目计划书），
系统会标记为"需人工确认"，确保关键决策有人参与。

设计原则：AI辅助决策，不替代决策。
所有推荐仅供参考，执行前必须人工复核。

完整代码已开源，欢迎查阅。
```

**Cover Image:** Workflow diagram (Image 3)

---

## 2. Weibo (微博)

### Weibo Post 1: Launch Tweet

```
【衍策政策Agent正式发布】

园区企业服务的新工具来了。

衍策政策Agent — 一个轻量级政策匹配AI工具，专为产业园区设计。

能做什么？
- 输入企业信息 → 秒级匹配适用政策
- 自动分析材料差距 → 按紧急程度排序
- 生成服务工单 → 优先级清晰
- 每条推荐可追溯 → 来源、日期、机构一目了然

首个验证场景：徐汇AI创新园区
为一家45人的AI企业匹配到6项政策，最高匹配度92分。

这不是金融工具，不提供投资建议。
只做一件事：让园区政策服务从人工表格变成AI工作流。

#AI #产业园区 #政策匹配 #企业服务 #徐汇 #人工智能

开源代码和Demo → [链接]
```

### Weibo Post 2: Feature Highlight

```
每一条政策建议，都可追溯、可解释、可复核。

这是衍策政策Agent的核心设计原则。

当AI推荐一家企业申请"高企认定"时，你能看到：
- 政策来源：上海市科委官网
- 匹配依据：行业、阶段、区域、研发占比、知识产权
- 材料差距：还缺哪些文件
- 风险提示：截止日期、口径确认
- 人工复核：哪些环节需要人来做判断

AI不替代决策，AI辅助决策。

#可追溯AI #政策Agent #园区服务

[配图：Poster 3 — 可追溯、可解释、可复核]
```

### Weibo Post 3: Impact Numbers

```
一组数字看衍策政策Agent的首次验证：

6项 — 为一家徐汇AI企业匹配到的适用政策
92分 — 最高政策匹配度（高企认定）
4张 — 自动生成的服务工单
0秒 — 从输入到匹配的时间（人工需要数小时）
100% — 每条推荐的可追溯率

从人工表格到AI工作流，效率提升看得见。

徐汇AI创新园区，验证开始。

#衍策引擎 #政策匹配 #AI效率

[配图：Impact stats graphic]
```

---

## 3. LinkedIn

### LinkedIn Post 1: Product Launch (English)

```
Introducing YanCe Policy Agent — an AI copilot for industrial park enterprise services.

The problem:
Park managers spend hours manually matching tenant companies with government policies
using spreadsheets. Deadlines get missed. Opportunities are lost.

The solution:
YanCe Policy Agent is a lightweight, rule-based matching engine that:

1. Profiles each tenant company (industry, stage, region, R&D ratio, IP status)
2. Matches them against the full policy catalog with 0-100 scoring
3. Identifies material gaps and prioritizes what to prepare first
4. Generates service tickets with clear action items
5. Ensures every recommendation is traceable to its source

Key design principles:
- Transparent, auditable rule engine (not a black box)
- Human review points clearly marked
- Policy results are for reference only — AI assists, humans decide

First validation: Xuhui AI Innovation Park, Shanghai
- 6 policies matched for a 45-person AI company
- Highest match score: 92/100 (High-Tech Enterprise Certification)
- 4 service tickets auto-generated

What this is NOT:
- Not an investment advisory tool
- Not a financial market analysis platform
- Not a trading signal generator

It's focused on one thing: making industrial park enterprise services smarter.

Open source demo available: [link]

#AIAgent #IndustrialPark #EnterpriseService #PolicyMatching #Xuhui #Shanghai #SmartCity
```

### LinkedIn Post 2: Technical Perspective (English)

```
How do you build trust in AI-generated policy recommendations?

When we designed the YanCe Policy Agent, we started with one question:
"How would a park manager verify that a recommendation is correct?"

Our answer: make everything traceable.

Every policy recommendation includes:
- Source URL linking to the official government document
- Publication date and issuing authority
- Applicable region and deadline
- Detailed scoring breakdown (8 weighted dimensions)
- Material gap analysis with verification status
- Explicit human review checkpoints

The scoring system is transparent:
- Industry match: 30%
- Region match: 20%
- Stage match: 15%
- Employee count: 10%
- R&D ratio: 10%
- IP status: 5%
- Certifications: 5%
- SME status: 5%

No hidden weights. No opaque ML model. Just clear, auditable rules.

Why rule-based instead of LLM-only?
- Policy eligibility has strict, verifiable criteria
- Park managers need to explain decisions to government auditors
- False positives have real consequences (wasted application effort)

AI should make the process faster, not less accountable.

#ExplainableAI #PolicyTech #GovernmentServices #RuleEngine #Traceability
```

### LinkedIn Post 3: Vision Post (English)

```
Starting from Xuhui. Scaling to every industrial park in China.

There are over 15,000 industrial parks and development zones in China.
Each park has hundreds of tenant companies.
Each company could benefit from dozens of government policies.

The matching problem is massive — and it's currently solved with spreadsheets.

YanCe Policy Agent starts with a simple demo:
one park, one company, six policies.

But the architecture is designed for scale:
- Structured policy schema (easy to add new policies)
- Batch processing (match all park tenants at once)
- Multi-park support (park-specific policy catalogs)
- API-first design (integrate with existing park management systems)

Our roadmap:
Phase 1: Core prototype (done) — rule-based matching, report generation
Phase 2: Data integration — CSV/YAML policy loading, batch processing, REST API
Phase 3: Intelligence layer — LLM-assisted gap analysis, smart checklists
Phase 4: Platform — multi-park dashboard, automated notifications, gov reporting

The goal isn't to replace park managers.
It's to give them a superpower: instant, accurate policy intelligence.

If you manage an industrial park, or know someone who does, I'd love to hear from you.

#IndustrialPark #SmartCity #PolicyTech #ChinaTech #StartupJourney
```

---

## 4. Cross-Platform Quick Posts

### WeChat Moments (朋友圈)

```
衍策政策Agent上线了。一个帮园区做政策匹配的AI小工具。
输入企业信息，秒出匹配结果，自动生成服务工单。
第一条推荐就是可追溯的，不是黑箱。
徐汇AI创新园区验证中。
不做投资建议，只做园区服务。
```

### Weibo Short

```
园区政策匹配，从Excel时代进入AI时代。
衍策政策Agent，徐汇验证开始。
6项政策 / 92分匹配 / 4张工单 / 100%可追溯。
[链接]
```

### LinkedIn Short

```
Built a lightweight AI agent that matches park tenant companies with government policies.
Rule-based, transparent, every recommendation traceable.
First validation: Xuhui AI Innovation Park, Shanghai.
Not fintech. Just park-tech.
[link]
```

---

## Posting Schedule Recommendation

| Day | Platform | Content | Best Time |
|-----|----------|---------|-----------|
| Day 1 | WeChat | Product Launch (Post 1) | 08:30 AM |
| Day 1 | Weibo | Launch Tweet | 09:00 AM |
| Day 1 | LinkedIn | Product Launch | 09:30 AM |
| Day 3 | WeChat | Technical Deep-Dive (Post 2) | 08:30 AM |
| Day 3 | Weibo | Feature Highlight | 12:00 PM |
| Day 5 | Weibo | Impact Numbers | 09:00 AM |
| Day 7 | LinkedIn | Technical Perspective | 10:00 AM |
| Day 10 | LinkedIn | Vision Post | 09:00 AM |
| Day 14 | All | Cross-platform repost with updates | Various |

---

## Hashtag Strategy

### Chinese (WeChat / Weibo)
- Primary: #衍策引擎 #政策匹配 #政策Agent
- Secondary: #AI #产业园区 #企业服务 #人工智能 #徐汇
- Tertiary: #可追溯AI #智慧园区 #数字化转型

### English (LinkedIn)
- Primary: #PolicyAgent #PolicyMatching #IndustrialPark
- Secondary: #AIAgent #EnterpriseService #SmartCity #PolicyTech
- Tertiary: #ExplainableAI #RuleEngine #Traceability #ChinaTech #StartupJourney
