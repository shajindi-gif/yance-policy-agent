'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRICING_FAQ = [
  {
    q: '是否提供免费试用？',
    a: '我们提供在线 Demo 供自助体验。如需深度体验，可预约 30 分钟的专属演示，我们将使用示例数据为你完整展示产品功能。',
  },
  {
    q: '企业数量超出上限怎么办？',
    a: '可以随时升级到更高级别的方案。升级过程无缝衔接，不会丢失任何历史数据。',
  },
  {
    q: '数据安全如何保障？',
    a: '所有企业数据加密存储，严格的权限控制体系。企业版支持私有化部署，数据完全在客户环境中运行。',
  },
  {
    q: '合同期限和付款方式？',
    a: '月付方案按月结算，年付方案享受 20% 优惠。支持对公转账和在线支付。企业版可协商灵活付款方式。',
  },
  {
    q: '年付方案可以中途退款吗？',
    a: '年付方案签约后前 30 天内可申请全额退款。30 天后按月折算退还剩余月份费用。',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: '基础版',
      desc: '适合小型孵化器和创业空间，快速上手政策智能服务。',
      monthly: 3000,
      maxCompanies: '200',
      features: [
        'PolicyCopilot 政策问答模块',
        'CompanyProfile 企业画像模块',
        '基础政策库 (市级政策覆盖)',
        '每月生成 50 份企业报告',
        '标准邮件支持',
        '月度运营报告',
        '基础数据看板',
      ],
      featured: false,
      cta: '开始使用',
    },
    {
      name: '专业版',
      desc: '适合中型产业园区，全功能覆盖企业服务工作流。',
      monthly: 8000,
      maxCompanies: '1,000',
      features: [
        '全部 5 个产品模块',
        '完整政策库 (国家+省+市级)',
        'SubsidyMatch 智能匹配引擎',
        'BriefMaker 材料生成引擎',
        'ParkOps 运营工作台',
        '无限企业报告生成',
        '专属客户成功经理',
        'API 集成支持',
        '周度运营报告',
        '优先技术支持',
      ],
      featured: true,
      cta: '开始使用',
    },
    {
      name: '企业版',
      desc: '适合大型园区集团和政务平台，支持私有化部署和定制开发。',
      monthly: 20000,
      maxCompanies: '不限',
      features: [
        '专业版全部功能',
        '私有化部署选项',
        '定制政策库接入',
        '多园区统一管理',
        '白标品牌定制',
        'SLA 服务等级协议',
        '专属技术支持团队',
        '定制开发服务',
        '数据迁移和对接',
        '季度业务复盘',
      ],
      featured: false,
      cta: '联系销售',
    },
  ];

  return (
    <>
      {/* Page Banner */}
      <section
        className="page-banner"
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2d44 60%, #0d1b2a 100%)',
        }}
      >
        <div className="container">
          <span
            className="badge"
            style={{
              background: 'rgba(14,165,233,0.2)',
              color: '#0ea5e9',
              marginBottom: '16px',
            }}
          >
            定价方案
          </span>
          <h1>价格方案</h1>
          <p>
            灵活的定价方案，适配不同规模和需求的产业园区。选择月付或年付，年付享 20% 优惠。
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section">
        <div className="container">
          {/* Toggle */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px',
                background: 'var(--bg-alt)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
              }}
            >
              <button
                onClick={() => setAnnual(false)}
                style={{
                  padding: '10px 24px',
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
                  padding: '10px 24px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  background: annual ? '#0d1b2a' : 'transparent',
                  color: annual ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                年付
                <span
                  style={{
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

          <div className="grid grid-3" style={{ gap: '24px', alignItems: 'start' }}>
            {tiers.map((tier) => {
              const price = annual ? Math.round(tier.monthly * 0.8) : tier.monthly;
              return (
                <div
                  key={tier.name}
                  className={`pricing-card${tier.featured ? ' pricing-card-featured' : ''}`}
                  style={
                    tier.featured
                      ? { borderColor: '#f97316', borderWidth: '2px' }
                      : {}
                  }
                >
                  {tier.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '4px 16px',
                        background: '#f97316',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '9999px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      最受欢迎
                    </div>
                  )}
                  <div className="pricing-name">{tier.name}</div>
                  <div className="pricing-desc">{tier.desc}</div>
                  <div className="pricing-price">
                    &yen;{price.toLocaleString()}{' '}
                    <span className="pricing-price-unit">元/月</span>
                  </div>
                  <div className="pricing-period">
                    最多 {tier.maxCompanies} 家企业 / {annual ? '按年付费' : '按月付费'}
                  </div>
                  <div className="pricing-divider" />
                  <ul className="pricing-features">
                    {tier.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Link
                    href="/demo"
                    className={`btn ${tier.featured ? '' : 'btn-outline'}`}
                    style={
                      tier.featured
                        ? { background: '#f97316', color: '#fff', borderColor: '#f97316', borderRadius: '12px' }
                        : { borderRadius: '12px' }
                    }
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">功能对比</span>
            <h2 className="section-title">方案功能详细对比</h2>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>功能</th>
                  <th>基础版</th>
                  <th style={{ color: '#f97316' }}>专业版</th>
                  <th>企业版</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'PolicyCopilot 政策问答', starter: true, pro: true, enterprise: true },
                  { feature: 'CompanyProfile 企业画像', starter: true, pro: true, enterprise: true },
                  { feature: 'SubsidyMatch 智能匹配', starter: false, pro: true, enterprise: true },
                  { feature: 'BriefMaker 材料生成', starter: false, pro: true, enterprise: true },
                  { feature: 'ParkOps 运营工作台', starter: false, pro: true, enterprise: true },
                  { feature: '政策库范围', starter: '市级', pro: '国家+省+市级', enterprise: '全量+定制', isText: true },
                  { feature: '企业数量上限', starter: '200', pro: '1,000', enterprise: '不限', isText: true },
                  { feature: 'API 集成', starter: false, pro: true, enterprise: true },
                  { feature: '私有化部署', starter: false, pro: false, enterprise: true },
                  { feature: '白标品牌定制', starter: false, pro: false, enterprise: true },
                  { feature: 'SLA 保障', starter: false, pro: false, enterprise: true },
                  { feature: '技术支持', starter: '邮件', pro: '优先支持', enterprise: '专属团队', isText: true },
                  { feature: '运营报告', starter: '月度', pro: '周度', enterprise: '实时', isText: true },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td style={{ fontWeight: 600 }}>{row.feature}</td>
                    <td>
                      {'isText' in row && row.isText
                        ? row.starter
                        : row.starter
                          ? <span className="badge badge-success">包含</span>
                          : <span style={{ color: 'var(--text-tertiary)' }}>-</span>}
                    </td>
                    <td>
                      {'isText' in row && row.isText
                        ? row.pro
                        : row.pro
                          ? <span className="badge badge-success">包含</span>
                          : <span style={{ color: 'var(--text-tertiary)' }}>-</span>}
                    </td>
                    <td>
                      {'isText' in row && row.isText
                        ? row.enterprise
                        : row.enterprise
                          ? <span className="badge badge-success">包含</span>
                          : <span style={{ color: 'var(--text-tertiary)' }}>-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="container-narrow">
            <div className="section-header">
              <span className="section-label">常见问题</span>
              <h2 className="section-title">价格常见问题</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PRICING_FAQ.map((item, i) => (
                <div key={i} className="card-flat" style={{ padding: '24px' }}>
                  <h4 className="card-title" style={{ marginBottom: '8px' }}>
                    {item.q}
                  </h4>
                  <p className="card-desc">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Contact */}
      <section className="section section-alt">
        <div className="container">
          <div className="container-narrow">
            <div className="section-header">
              <span className="section-label">企业咨询</span>
              <h2 className="section-title">需要定制化方案？</h2>
              <p className="section-subtitle">
                如果你的园区有特殊需求，我们的团队可以为你量身定制解决方案。
              </p>
            </div>

            <div className="card" style={{ padding: '40px' }}>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">姓名 *</label>
                  <input type="text" className="form-input" placeholder="请输入你的姓名" />
                </div>
                <div className="form-group">
                  <label className="form-label">公司 *</label>
                  <input type="text" className="form-input" placeholder="请输入公司名称" />
                </div>
              </div>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">邮箱 *</label>
                  <input type="email" className="form-input" placeholder="name@company.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">电话</label>
                  <input type="tel" className="form-input" placeholder="请输入手机号码" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">需求说明</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="请描述你的园区需求和期望的功能..."
                />
              </div>
              <button
                className="btn btn-lg"
                style={{
                  width: '100%',
                  background: '#f97316',
                  color: '#fff',
                  borderColor: '#f97316',
                  borderRadius: '12px',
                }}
              >
                提交咨询
              </button>
              <p className="form-help" style={{ textAlign: 'center', marginTop: '16px' }}>
                或发送邮件至 contact@yance.ai
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="cta-section"
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b2d44 50%, #0d1b2a 100%)',
        }}
      >
        <div className="container">
          <h2 className="cta-title">选择适合你园区的方案</h2>
          <p className="cta-subtitle">
            不确定哪个方案最合适？预约一次免费咨询，我们帮你分析需求并推荐方案。
          </p>
          <div className="cta-actions">
            <Link
              href="/demo"
              className="btn btn-lg"
              style={{ background: '#f97316', color: '#fff', borderColor: '#f97316', borderRadius: '12px' }}
            >
              预约演示
            </Link>
            <a href="mailto:contact@yance.ai" className="btn btn-outline-white btn-lg">
              联系销售
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
