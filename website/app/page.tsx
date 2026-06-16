'use client';

import { useState } from 'react';
import Link from 'next/link';

const FAQ_ITEMS = [
  {
    q: 'Policy Agent 是什么？',
    a: 'Policy Agent 是专为产业园区设计的智能政策服务系统，帮助园区运营团队实现政策问答、企业画像、资源匹配、材料清单生成和服务工单管理的全流程智能化。',
  },
  {
    q: '部署需要多长时间？',
    a: '标准部署周期为 2-4 周。基础版最快 2 周可上线，专业版约 3-4 周，企业版根据定制需求协商。试点园区享受优先部署通道。',
  },
  {
    q: '政策库覆盖哪些地区？',
    a: '目前覆盖国家级、省级和市级政策，重点深耕上海市及各区政策。企业版支持接入园区自有政策库和地方特色政策。',
  },
  {
    q: '数据安全如何保障？',
    a: '所有企业数据加密存储，严格的权限控制体系。系统支持操作审计日志和人工复核机制。企业版提供私有化部署选项，数据完全在客户环境中运行。',
  },
  {
    q: '能否与现有系统集成？',
    a: '专业版和企业版提供 API 集成能力，可与园区现有的 OA、CRM、ERP 等系统对接。企业版支持深度定制集成。',
  },
  {
    q: 'AI 输出的结果可信吗？',
    a: '每条建议都附带政策原文引用和来源溯源，支持精确到条款级别。系统内置 10 项可追溯字段，并支持人工复核和结果修正流程。',
  },
  {
    q: '是否支持多园区管理？',
    a: '企业版支持多园区统一管理，可以在一个平台上管理多个园区的企业数据和服务任务，并生成跨园区对比报告。',
  },
  {
    q: '如何开始试用？',
    a: '你可以直接访问线上 Demo 自助体验，或预约 30 分钟的专属演示，我们将根据你园区的实际场景进行针对性讲解。发送邮件至 contact@yance.ai 即可预约。',
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          padding: '160px 0 100px',
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2d44 40%, #142842 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mesh pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(14,165,233,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,115,22,0.06) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(14,165,233,0.05) 0%, transparent 50%)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '720px' }}>
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '32px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  background: '#0ea5e9',
                  borderRadius: '50%',
                }}
              />
              Demo 已上线 &middot; yance-policy-agent.vercel.app
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              Turn Policy Alerts Into Park Impact
            </h1>

            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#0ea5e9',
                marginBottom: '16px',
              }}
            >
              园区公司的政策服务 Agent
            </p>

            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7,
                marginBottom: '40px',
                maxWidth: '600px',
              }}
            >
              为园区、孵化器、产业服务机构提供政策问答、企业画像、资源匹配、材料清单和企业服务工作台。
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <Link
                href="/demo"
                className="btn btn-lg"
                style={{
                  background: '#f97316',
                  color: '#fff',
                  borderColor: '#f97316',
                  padding: '16px 36px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                }}
              >
                预约园区 Demo
              </Link>
              <Link
                href="https://yance-policy-agent.vercel.app"
                className="btn btn-lg"
                style={{
                  background: 'transparent',
                  color: '#0ea5e9',
                  border: '2px solid #0ea5e9',
                  padding: '16px 36px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                }}
              >
                查看线上 Demo
              </Link>
            </div>

            {/* Stats strip */}
            <div
              style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
            >
              {[
                { value: '14 项', label: '政策库' },
                { value: '27 项', label: '测试通过' },
                { value: '5 大', label: '功能模块' },
                { value: '104 个', label: '源文件' },
              ].map((s) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0ea5e9' }}>
                    {s.value}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PAIN POINTS SECTION ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">核心问题</span>
            <h2 className="section-title">园区政策服务的四大困境</h2>
            <p className="section-subtitle">
              园区不缺政策，缺的是把政策送到对的企业的系统。
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '24px' }}>
            {[
              {
                icon: '1',
                title: '政策信息孤岛',
                stat: '80%',
                statLabel: '政策文件未被园区工作人员完整阅读',
                desc: '各级政府每年发布大量政策文件，条款复杂、条件交叉，园区工作人员难以快速准确地为企业解读。',
              },
              {
                icon: '2',
                title: '企业画像分散',
                stat: '5+',
                statLabel: '个系统中存储同一家企业的数据',
                desc: '企业的工商信息、知识产权、财务状况、发展阶段等数据分散在不同系统中，无法形成统一画像。',
              },
              {
                icon: '3',
                title: '匹配靠经验',
                stat: '4h',
                statLabel: '人工完成一次企业政策匹配',
                desc: '每个政策项目的申报条件不同，人工逐一比对企业资质和政策要求耗时耗力，且容易遗漏或误判。',
              },
              {
                icon: '4',
                title: '服务不可追溯',
                stat: '0%',
                statLabel: '服务过程可完整记录和复核',
                desc: '服务记录分散在邮件、微信和口头沟通中，无法追溯每项建议的依据，服务质量无法评估。',
              },
            ].map((item) => (
              <div key={item.icon} className="pain-point-card">
                <div className="pain-point-number">{item.icon}</div>
                <div>
                  <h3 className="pain-point-title">{item.title}</h3>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'baseline',
                      gap: '6px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: '#f97316',
                      }}
                    >
                      {item.stat}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {item.statLabel}
                    </span>
                  </div>
                  <p className="pain-point-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '48px',
              padding: '32px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderLeft: '4px solid #f97316',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--text)',
                fontStyle: 'italic',
              }}
            >
              &ldquo;园区不缺政策，缺的是把政策送到对的企业的系统。&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ===== SOLUTION SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">解决方案</span>
            <h2 className="section-title">Policy Agent：从政策到服务的一站式解决方案</h2>
          </div>

          {/* Equation bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '24px',
              background: 'linear-gradient(135deg, #0d1b2a, #1b2d44)',
              borderRadius: '16px',
              marginBottom: '48px',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0ea5e9' }}>
              Policy Agent
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.25rem' }}>=</span>
            {['政策库', '企业画像', 'Agent 问答', '资源匹配', '服务工单'].map((item, i) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(14,165,233,0.15)',
                    border: '1px solid rgba(14,165,233,0.3)',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  {item}
                </span>
                {i < 4 && (
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1rem' }}>+</span>
                )}
              </span>
            ))}
          </div>

          {/* 3 Module cards */}
          <div className="grid grid-3" style={{ gap: '24px' }}>
            {[
              {
                tag: '数据层',
                title: '政策库 + 企业画像',
                problem: '政策文件散落各处，企业数据分散在 5+ 个系统',
                solution: '结构化政策库 + 多维企业画像自动整合',
                output: '统一数据底座，政策和企业一键关联',
              },
              {
                tag: '引擎层',
                title: 'Agent 问答 + 智能匹配',
                problem: '人工匹配一次需要 4 小时，覆盖面不足 30%',
                solution: 'AI Agent 自动匹配企业画像与政策条件',
                output: '秒级匹配，适配度评分 + 材料缺口分析',
              },
              {
                tag: '交付层',
                title: '材料清单 + 服务工单',
                problem: '服务过程不可追溯，材料缺口难以跟踪',
                solution: '自动生成材料清单、服务简报和工单',
                output: '标准化交付文档，全流程可追溯',
              },
            ].map((mod) => (
              <div key={mod.tag} className="module-card">
                <div className="module-card-name">{mod.tag}</div>
                <h3 className="module-card-title">{mod.title}</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      padding: '12px',
                      background: '#fef2f2',
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#dc2626',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      痛点
                    </span>
                    <p style={{ fontSize: '0.875rem', color: '#1e293b', marginTop: '4px' }}>
                      {mod.problem}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: '#eff6ff',
                      borderRadius: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      方案
                    </span>
                    <p style={{ fontSize: '0.875rem', color: '#1e293b', marginTop: '4px' }}>
                      {mod.solution}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: '#f0fdf4',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#16a34a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      产出
                    </span>
                    <p style={{ fontSize: '0.875rem', color: '#1e293b', marginTop: '4px' }}>
                      {mod.output}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCT DEMO SECTION ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">产品演示</span>
            <h2 className="section-title">6 步完成园区服务闭环</h2>
            <p className="section-subtitle">
              从选择园区到生成报告，Policy Agent 让每一步都可操作、可追溯。
            </p>
          </div>

          {/* Workflow steps */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '48px',
            }}
          >
            {[
              { icon: '\u{1F3E2}', label: '选择园区' },
              { icon: '\u{1F4CB}', label: '录入企业' },
              { icon: '\u{1F50D}', label: '匹配政策' },
              { icon: '\u{1F4C4}', label: '生成清单' },
              { icon: '\u{1F4DD}', label: '服务工单' },
              { icon: '\u{1F4CA}', label: '园区报告' },
            ].map((step, i) => (
              <span key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{step.icon}</span>
                  <span>
                    <span style={{ color: '#0ea5e9', fontWeight: 700, marginRight: '4px' }}>
                      {i + 1}.
                    </span>
                    {step.label}
                  </span>
                </div>
                {i < 5 && (
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '1.25rem' }}>
                    &rarr;
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Mock dashboard preview */}
          <div className="dashboard-preview">
            <div className="dashboard-header">
              <span className="dashboard-header-title">YanCe 园区服务驾驶舱</span>
              <div className="dashboard-header-actions">
                <span className="dashboard-dot dashboard-dot-red" />
                <span className="dashboard-dot dashboard-dot-orange" />
                <span className="dashboard-dot dashboard-dot-green" />
              </div>
            </div>
            <div className="grid grid-4" style={{ gap: '16px' }}>
              {[
                { value: '2,847', label: '企业总数', trend: '+128 本月新增', color: '' },
                { value: '1,632', label: '可服务企业数', trend: '57.3% 覆盖率', color: 'green' },
                { value: '23', label: '高优先级政策', trend: '8 项即将截止', color: '' },
                { value: '156', label: '材料缺口', trend: '-23 本周补充', color: 'orange' },
              ].map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div
                    className={`stat-value${stat.color === 'green' ? ' stat-value-green' : stat.color === 'orange' ? ' stat-value-orange' : ''}`}
                  >
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                  <div
                    className={`stat-trend${stat.trend.includes('+') || stat.trend.includes('覆盖率') ? ' stat-trend-up' : stat.trend.includes('-') ? ' stat-trend-down' : ''}`}
                  >
                    {stat.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #162a45 100%)',
          color: '#fff',
        }}
      >
        <div className="container">
          <div className="section-header">
            <span
              className="badge"
              style={{
                background: 'rgba(14,165,233,0.2)',
                color: '#0ea5e9',
                marginBottom: '16px',
              }}
            >
              可信溯源
            </span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              每条建议，都可追溯、可解释、可复核
            </h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Policy Agent 的所有输出都建立在可追溯的数据基础之上。
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            {[
              { icon: '\u{1F4DC}', label: '政策原文来源' },
              { icon: '\u{1F4C5}', label: '政策时效标注' },
              { icon: '\u{2696}\u{FE0F}', label: '适用条件说明' },
              { icon: '\u{1F4CF}', label: '匹配规则透明' },
              { icon: '\u{1F4CA}', label: '数据更新时间' },
              { icon: '\u{1F50D}', label: '引用精确到条' },
              { icon: '\u{1F504}', label: '复核机制' },
              { icon: '\u{1F4DD}', label: '操作审计日志' },
              { icon: '\u{1F6E1}\u{FE0F}', label: '数据安全保障' },
              { icon: '\u{1F4E4}', label: '报告可导出' },
            ].map((chip) => (
              <div
                key={chip.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                <span>{chip.icon}</span>
                {chip.label}
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              padding: '20px 24px',
              background: 'rgba(14,165,233,0.1)',
              border: '1px solid rgba(14,165,233,0.25)',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0ea5e9' }}>
              {'\uD83D\uDEE1\uFE0F'} 人工复核
            </span>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginLeft: '8px' }}>
              &mdash; 所有 AI 输出均支持人工复核和结果修正流程，确保服务质量
            </span>
          </div>
        </div>
      </section>

      {/* ===== USE CASES SECTION ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">使用场景</span>
            <h2 className="section-title">为园区全角色赋能</h2>
            <p className="section-subtitle">
              从政策研究员到招商经理，Policy Agent 为园区每个角色提供针对性的服务支持。
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: '24px' }}>
            {[
              {
                role: '政策研究员',
                title: '快速解读新政策',
                desc: '新政策发布后，快速了解政策要点、适用企业和对园区的影响，无需逐条阅读冗长文件。',
              },
              {
                role: '企业服务专员',
                title: '一键匹配企业政策',
                desc: '输入企业名称或画像，自动匹配该企业可申报的政策项目，按优先级排列并给出材料缺口分析。',
              },
              {
                role: '申报服务经理',
                title: '申报材料预审',
                desc: '生成申报材料清单，自动标注缺口和风险点，帮助企业提前准备，提高申报成功率。',
              },
              {
                role: '园区运营总监',
                title: '服务数据看板',
                desc: '实时查看园区企业服务的核心运营指标，包括服务覆盖率、申报进度、政策覆盖率等。',
              },
              {
                role: '招商经理',
                title: '政策优势展示',
                desc: '为潜在入驻企业展示园区可匹配的政策资源和成功案例，提升招商吸引力和转化率。',
              },
              {
                role: '孵化器负责人',
                title: '批量企业服务',
                desc: '对在孵企业进行批量政策匹配和服务推荐，发现高价值企业并优先配置服务资源。',
              },
            ].map((uc) => (
              <div key={uc.role} className="usecase-card">
                <span className="usecase-card-role">{uc.role}</span>
                <h3 className="usecase-card-title">{uc.title}</h3>
                <p className="usecase-card-desc">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MARKET SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">市场空间</span>
            <h2 className="section-title">中国园区服务的万亿级市场</h2>
          </div>

          <div className="grid grid-3" style={{ gap: '24px' }}>
            {[
              {
                label: 'TAM',
                value: '15,000+',
                desc: '全国产业园区总数',
                detail: '涵盖国家级、省级、市级各类产业园区',
                color: '#0ea5e9',
              },
              {
                label: 'SAM',
                value: '500+',
                desc: '上海重点园区',
                detail: '上海市各类产业园区和孵化器',
                color: '#f97316',
              },
              {
                label: 'SOM',
                value: '20+',
                desc: '徐汇区试点园区',
                detail: '首批试点合作的目标园区数量',
                color: '#16a34a',
              },
            ].map((m) => (
              <div
                key={m.label}
                className="stat-card"
                style={{ textAlign: 'center', padding: '40px 24px' }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: m.color,
                    background: `${m.color}15`,
                    border: `1px solid ${m.color}30`,
                    marginBottom: '16px',
                  }}
                >
                  {m.label}
                </span>
                <div className="stat-value" style={{ fontSize: '2.5rem' }}>
                  {m.value}
                </div>
                <div className="stat-label" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>
                  {m.desc}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {m.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MULTI-PLATFORM SECTION ===== */}
      <section className="section platforms-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">多端覆盖</span>
            <h2 className="section-title">随时随地使用 Policy Agent</h2>
            <p className="section-subtitle">
              浏览器、桌面端、移动端 — 三大平台无缝衔接，让政策服务触手可及。
            </p>
          </div>

          <div className="platforms-grid">
            {/* Chrome Extension */}
            <div className="platform-card">
              <div className="platform-icon platform-icon-chrome">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <circle cx="24" cy="24" r="22" stroke="#0ea5e9" strokeWidth="2" fill="rgba(14,165,233,0.08)" />
                  <circle cx="24" cy="24" r="8" fill="#0ea5e9" />
                  <path d="M24 16 L38 16 A16 16 0 0 1 31 37.8" stroke="#0ea5e9" strokeWidth="2" fill="none" />
                  <path d="M31 37.8 L24 24 L10.2 31" stroke="#0ea5e9" strokeWidth="2" fill="none" />
                  <path d="M10.2 31 L24 24 L17 10.5" stroke="#0ea5e9" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <h3 className="platform-card-title">Chrome 浏览器插件</h3>
              <p className="platform-card-desc">
                在任何政策网页上一键分析，自动提取政策要点、生成企业服务建议
              </p>
              <ul className="platform-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  结构化政策提取（6字段）
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  ParkOps 剪贴板同步
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Dashboard 快速入口
                </li>
              </ul>
              <Link href="/demo" className="btn btn-outline platform-card-btn">
                安装插件
              </Link>
            </div>

            {/* Mac Desktop App */}
            <div className="platform-card">
              <div className="platform-icon platform-icon-desktop">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <rect x="6" y="8" width="36" height="24" rx="3" stroke="#f97316" strokeWidth="2" fill="rgba(249,115,22,0.08)" />
                  <rect x="10" y="12" width="28" height="16" rx="1" fill="rgba(249,115,22,0.15)" />
                  <path d="M18 36 L30 36" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                  <path d="M24 32 L24 36" stroke="#f97316" strokeWidth="2" />
                  <path d="M16 40 L32 40" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="platform-card-title">Mac 桌面端应用</h3>
              <p className="platform-card-desc">
                离线可用的桌面端工作台，支持批量企业录入和政策文件导入
              </p>
              <ul className="platform-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  启动画面、navy/teal/coral 主题
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  PDF 导出
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Open yance.ai 菜单
                </li>
              </ul>
              <Link href="/demo" className="btn btn-outline platform-card-btn">
                下载 Mac 版
              </Link>
            </div>

            {/* WeChat Mini Program */}
            <div className="platform-card">
              <div className="platform-icon platform-icon-wechat">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <rect x="14" y="4" width="20" height="40" rx="4" stroke="#16a34a" strokeWidth="2" fill="rgba(22,163,74,0.08)" />
                  <rect x="17" y="10" width="14" height="24" rx="1" fill="rgba(22,163,74,0.12)" />
                  <circle cx="24" cy="40" r="2" fill="#16a34a" />
                  <path d="M20 6 L28 6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="platform-card-title">微信小程序</h3>
              <p className="platform-card-desc">
                园区工作人员的移动端助手，随时随地录入企业、匹配政策、查看报告
              </p>
              <ul className="platform-features">
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  骨架屏加载
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  分步匹配动画
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  分享报告、yance.ai 品牌贯穿
                </li>
              </ul>
              <Link href="/demo" className="btn btn-outline platform-card-btn">
                扫码体验
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">价格方案</span>
            <h2 className="section-title">灵活的定价方案</h2>
            <p className="section-subtitle">
              从初创孵化器到大型产业园区，找到适合你的方案。
            </p>

            {/* Annual toggle */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '4px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                marginTop: '16px',
              }}
            >
              <button
                onClick={() => setAnnual(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: !annual ? '#0d1b2a' : 'transparent',
                  color: !annual ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                月付
              </button>
              <button
                onClick={() => setAnnual(true)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: annual ? '#0d1b2a' : 'transparent',
                  color: annual ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                年付
                <span
                  style={{
                    marginLeft: '6px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: '#f0fdf4',
                    color: '#16a34a',
                  }}
                >
                  省 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-3" style={{ gap: '24px' }}>
            {[
              {
                name: '基础版',
                desc: '适合小型孵化器和创业空间',
                monthly: 3000,
                features: [
                  'PolicyCopilot 政策问答',
                  'CompanyProfile 企业画像',
                  '基础政策库 (市级政策)',
                  '最多 200 家企业',
                  '邮件支持',
                  '每月运营报告',
                ],
                featured: false,
              },
              {
                name: '专业版',
                desc: '适合中型产业园区',
                monthly: 8000,
                features: [
                  '全部 5 个产品模块',
                  '完整政策库 (国家+省+市级)',
                  'SubsidyMatch 智能匹配',
                  'BriefMaker 材料生成',
                  'ParkOps 运营工作台',
                  '最多 1,000 家企业',
                  '专属客户成功经理',
                  'API 集成支持',
                ],
                featured: true,
              },
              {
                name: '企业版',
                desc: '适合大型园区集团和政务平台',
                monthly: 20000,
                features: [
                  '专业版全部功能',
                  '私有化部署选项',
                  '定制政策库接入',
                  '多园区管理',
                  '不限企业数量',
                  'SLA 保障',
                  '专属技术支持团队',
                  '定制开发服务',
                ],
                featured: false,
              },
            ].map((tier) => {
              const price = annual ? Math.round(tier.monthly * 0.8) : tier.monthly;
              return (
                <div
                  key={tier.name}
                  className={`pricing-card${tier.featured ? ' pricing-card-featured' : ''}`}
                >
                  <div className="pricing-name">{tier.name}</div>
                  <div className="pricing-desc">{tier.desc}</div>
                  <div className="pricing-price">
                    &yen;{price.toLocaleString()}{' '}
                    <span className="pricing-price-unit">元/月</span>
                  </div>
                  <div className="pricing-period">
                    {annual ? '按年付费' : '按月付费'}
                  </div>
                  <div className="pricing-divider" />
                  <ul className="pricing-features">
                    {tier.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Link
                    href="/demo"
                    className={`btn ${tier.featured ? 'btn-primary' : 'btn-outline'}`}
                    style={
                      tier.featured
                        ? { background: '#f97316', borderColor: '#f97316' }
                        : {}
                    }
                  >
                    {tier.name === '企业版' ? '联系销售' : '开始使用'}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Feature comparison link */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/pricing" className="btn btn-ghost">
              查看完整功能对比表 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PILOT SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split-content">
              <span className="section-label">试点计划</span>
              <h2 className="section-title mb-4">徐汇试点计划</h2>
              <p>
                我们正在与上海市徐汇区的产业园区合作，部署 Policy Agent 的实际应用场景。试点计划为期 3 个月，分阶段推进。
              </p>
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ marginBottom: '12px' }}>目标 KPI</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {[
                    { value: '200+', label: '覆盖企业' },
                    { value: '85%', label: '匹配准确率' },
                    { value: '30min', label: '服务响应' },
                    { value: '3x', label: '效率提升' },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      style={{
                        padding: '12px 20px',
                        background: 'var(--bg-alt)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0ea5e9' }}>
                        {kpi.value}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <Link href="/roadshow" className="btn btn-outline">
                  了解试点详情
                </Link>
              </div>
            </div>

            <div>
              <div className="pilot-card">
                <h3>3 个月试点路线图</h3>
                <div className="pilot-phase">
                  <div className="pilot-phase-number">1</div>
                  <div>
                    <div className="pilot-phase-title">第 1 月：基础部署</div>
                    <div className="pilot-phase-desc">
                      部署 PolicyCopilot 和 CompanyProfile，覆盖核心企业政策问答服务。
                    </div>
                  </div>
                </div>
                <div className="pilot-phase">
                  <div className="pilot-phase-number">2</div>
                  <div>
                    <div className="pilot-phase-title">第 2 月：智能匹配</div>
                    <div className="pilot-phase-desc">
                      接入 SubsidyMatch 和 BriefMaker，实现企业-政策自动匹配和材料生成。
                    </div>
                  </div>
                </div>
                <div className="pilot-phase">
                  <div className="pilot-phase-number">3</div>
                  <div>
                    <div className="pilot-phase-title">第 3 月：全面运营</div>
                    <div className="pilot-phase-desc">
                      上线 ParkOps 工作台，整合所有模块，实现全流程数字化管理。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="container-narrow">
            <div className="section-header">
              <span className="section-label">常见问题</span>
              <h2 className="section-title">FAQ</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text)',
                    }}
                  >
                    {item.q}
                    <span
                      style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-tertiary)',
                        transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                        marginLeft: '16px',
                      }}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      style={{
                        padding: '0 24px 20px',
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        className="cta-section"
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2d44 50%, #0d1b2a 100%)',
        }}
      >
        <div className="container">
          <h2 className="cta-title">为你的园区部署一个政策服务 Agent</h2>
          <p className="cta-subtitle">
            30 分钟了解 Policy Agent 如何帮助你的园区提升企业服务效率和覆盖率。
          </p>
          <div className="cta-actions">
            <Link
              href="/demo"
              className="btn btn-lg"
              style={{
                background: '#f97316',
                color: '#fff',
                borderColor: '#f97316',
                padding: '16px 36px',
                fontSize: '1.125rem',
                borderRadius: '12px',
              }}
            >
              预约 Demo
            </Link>
            <a
              href="mailto:contact@yance.ai"
              className="btn btn-outline-white btn-lg"
            >
              联系我们
            </a>
          </div>
          <div
            style={{
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
              contact@yance.ai
            </span>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>|</span>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
              yance.ai
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
