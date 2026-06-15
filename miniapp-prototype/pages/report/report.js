// pages/report/report.js
// YanCe Policy Agent - Service Report Display

const app = getApp();

Page({
  data: {
    company: null,
    loading: true,
    reportGenerated: false,

    // Report metadata
    reportMeta: {
      id: '',
      generatedAt: '',
      version: '1.0.0'
    },

    // Report sections
    sections: [],

    // Export options
    showExportMenu: false,
    exportOptions: [
      { id: 'markdown', label: '导出为 Markdown', icon: '📄' },
      { id: 'share', label: '分享给同事', icon: '🔗' },
      { id: 'print', label: '打印报告', icon: '🖨️' }
    ]
  },

  onLoad(options) {
    const company = app.globalData.currentCompany;
    if (company) {
      this.setData({ company });
    } else {
      this.setData({
        company: {
          name: '智云科技有限公司',
          industry: '人工智能',
          region: '上海市浦东新区',
          needs: ['高企认定', '算力券', '人才引进'],
          employeeCount: '85',
          registeredCapital: '1000',
          ipCount: '12',
          rdRatio: '8.5'
        }
      });
    }

    this._generateReport();
  },

  /**
   * Generate the full service report
   */
  _generateReport() {
    this.setData({ loading: true });

    const company = this.data.company;
    const now = new Date();
    const reportId = `RPT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // Simulate report generation delay
    setTimeout(() => {
      const sections = this._buildReportSections(company, reportId, now);
      this.setData({
        loading: false,
        reportGenerated: true,
        reportMeta: {
          id: reportId,
          generatedAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
          version: '1.0.0'
        },
        sections
      });
    }, 1200);
  },

  /**
   * Build all 14 report sections
   */
  _buildReportSections(company, reportId, now) {
    const needsText = (company.needs && company.needs.length > 0)
      ? company.needs.join('、')
      : '暂无明确需求';

    return [
      {
        id: 1,
        title: '企业基本信息概览',
        icon: '🏢',
        content: [
          { type: 'table', rows: [
            ['企业名称', company.name || '未填写'],
            ['所在区域', company.region || '未选择'],
            ['所属行业', company.industry || '未选择'],
            ['注册资本', (company.registeredCapital || '未填写') + ' 万元'],
            ['员工人数', company.employeeCount || '未填写'],
            ['知识产权数量', (company.ipCount || '未填写') + ' 件'],
            ['研发投入占比', (company.rdRatio || '未填写') + '%']
          ]},
          { type: 'text', value: `当前需求：${needsText}` }
        ]
      },
      {
        id: 2,
        title: '政策匹配分析',
        icon: '🔍',
        content: [
          { type: 'text', value: `根据企业所在区域（${company.region || '未知'}）和行业（${company.industry || '未知'}），结合当前需求方向，政策匹配分析如下：` },
          { type: 'list', items: [
            '区域政策覆盖度：★★★★☆（4/5）',
            '行业政策匹配度：★★★★☆（4/5）',
            '需求匹配精准度：★★★★☆（4/5）'
          ]},
          { type: 'text', value: `${company.region || '该区域'}针对${company.industry || '该行业'}行业有较为完善的政策支持体系，建议重点关注高新技术认定、算力补贴、人才引进等方向。` }
        ]
      },
      {
        id: 3,
        title: '可申报政策清单',
        icon: '📋',
        content: [
          { type: 'subtitle', value: '国家级政策' },
          { type: 'list', items: [
            '高新技术企业认定 — 企业所得税减按15%，匹配度：高',
            '专精特新"小巨人"认定 — 财政奖补50-100万，匹配度：高',
            '科技型中小企业评价 — 研发费用加计扣除100%，匹配度：中'
          ]},
          { type: 'subtitle', value: '地方政策' },
          { type: 'list', items: [
            '科技创新专项资金 — 研发费用补贴，匹配度：高',
            '产业园区企业扶持 — 场地租金减免，匹配度：高',
            '人才引进安居计划 — 人才补贴10-100万，匹配度：高',
            '算力券政策 — 算力使用补贴最高50万/年，匹配度：高'
          ]}
        ]
      },
      {
        id: 4,
        title: '申报条件符合度评估',
        icon: '✅',
        content: [
          { type: 'subtitle', value: '已满足条件' },
          { type: 'checklist', items: [
            { text: '在区域注册并实际经营', checked: true },
            { text: '独立法人资格', checked: true },
            { text: '属于重点产业领域', checked: true },
            { text: '拥有自主知识产权', checked: true }
          ]},
          { type: 'subtitle', value: '待核实条件' },
          { type: 'checklist', items: [
            { text: '上年度研发投入占比≥3%', checked: false },
            { text: '近两年无重大违法违规记录', checked: false },
            { text: '高新技术产品收入占比≥60%', checked: false },
            { text: '企业征信良好', checked: false }
          ]}
        ]
      },
      {
        id: 5,
        title: '所需材料清单',
        icon: '📎',
        content: [
          { type: 'subtitle', value: '通用材料' },
          { type: 'list', items: [
            '企业营业执照副本（复印件加盖公章）',
            '法定代表人身份证明',
            '企业上年度审计报告',
            '企业近12个月社保缴纳证明',
            '企业纳税证明（近两年）'
          ]},
          { type: 'subtitle', value: '专项材料' },
          { type: 'list', items: [
            '知识产权证书及清单',
            '高新技术企业认定证书（如适用）',
            '研发项目立项材料',
            '产学研合作协议（如适用）',
            '项目申报书'
          ]}
        ]
      },
      {
        id: 6,
        title: '申报时间窗口',
        icon: '📅',
        content: [
          { type: 'table', rows: [
            ['高新技术企业认定', '4月-9月', '开放中'],
            ['专精特新认定', '4月-6月', '未开放'],
            ['科技型中小企业', '全年', '开放中'],
            ['科技创新资金', '3月-4月', '未开放'],
            ['产业园区扶持', '每季度', '开放中'],
            ['算力券', '每季度', '开放中']
          ]}
        ]
      },
      {
        id: 7,
        title: '预估政策支持',
        icon: '💰',
        content: [
          { type: 'subtitle', value: '税收优惠' },
          { type: 'list', items: [
            '高新技术企业：企业所得税减免（15% vs 25%）',
            '研发费用加计扣除：100%加计扣除'
          ]},
          { type: 'subtitle', value: '财政补贴' },
          { type: 'list', items: [
            '科技创新专项资金：预计10-50万元',
            '场地租金减免：预计每年节省5-15万元',
            '人才引进补贴：预计每人5-20万元',
            '算力券补贴：最高50万元/年'
          ]}
        ]
      },
      {
        id: 8,
        title: '风险提示',
        icon: '⚠️',
        content: [
          { type: 'warning_list', items: [
            '申报窗口期有限（约2-4周），请提前备齐材料',
            '材料必须真实有效，虚假信息将被取消资格',
            '部分补贴项目采取竞争性评审，不保证100%获批',
            '政策可能随年度调整，关注最新发布通知',
            '获批企业须按要求报送年度经营数据',
            '注意知识产权的有效期和权属关系'
          ]}
        ]
      },
      {
        id: 9,
        title: '园区服务建议',
        icon: '💡',
        content: [
          { type: 'subtitle', value: '对园区运营团队' },
          { type: 'list', items: [
            '主动推送匹配政策信息给企业负责人',
            '安排专人提供一对一申报辅导服务',
            '在企业提交前进行材料预审',
            '建立申报进度台账，定期跟进',
            '及时将新发布的政策信息同步给企业'
          ]},
          { type: 'subtitle', value: '对企业' },
          { type: 'list', items: [
            '尽快完成知识产权梳理和研发费用归集',
            '提前联系会计师事务所准备审计报告',
            '关注各政策官方网站获取最新申报通知',
            '充分利用园区公共技术服务平台',
            '积极参与园区政策宣讲和培训活动'
          ]}
        ]
      },
      {
        id: 10,
        title: '后续行动建议',
        icon: '🚀',
        content: [
          { type: 'subtitle', value: '短期（1-2周内）' },
          { type: 'list', items: [
            '整理企业现有知识产权清单',
            '联系审计机构确认研发费用归集情况',
            '收集并整理所有通用申报材料'
          ]},
          { type: 'subtitle', value: '中期（1-3个月）' },
          { type: 'list', items: [
            '完成科技型中小企业评价申报',
            '准备高新技术企业认定申报材料',
            '申请产业园区企业扶持'
          ]},
          { type: 'subtitle', value: '长期（3-12个月）' },
          { type: 'list', items: [
            '规划专精特新认定申报',
            '持续关注并申报地方各类专项政策',
            '建立企业政策申报年度计划'
          ]}
        ]
      },
      {
        id: 11,
        title: '关联政策推荐',
        icon: '🔗',
        content: [
          { type: 'list', items: [
            '数字化转型专项资金 — 支持企业数字化转型项目',
            '产学研合作项目 — 鼓励企业与高校/科研院所合作',
            '国际市场开拓资金 — 支持企业参加国际展会',
            '绿色低碳发展补贴 — 支持企业节能减排',
            '人才安居工程 — 为企业核心人才提供住房补贴'
          ]}
        ]
      },
      {
        id: 12,
        title: '历史申报记录参考',
        icon: '📂',
        content: [
          { type: 'text', value: '当前为首份报告，暂无历史申报记录。后续报告将自动关联历史数据，便于跟踪企业申报进度和成效。' }
        ]
      },
      {
        id: 13,
        title: '企业画像摘要',
        icon: '👤',
        content: [
          { type: 'list', items: [
            `企业类型：${company.industry || '科技'}领域科技型企业`,
            '发展阶段：成长期（推测）',
            `政策需求画像：${needsText}`,
            `区域优势：位于${company.region || '重点区域'}，可享受多级政策叠加`,
            '建议关注方向：技术创新、资质认定、规模扩张、人才团队'
          ]}
        ]
      },
      {
        id: 14,
        title: '报告元信息',
        icon: 'ℹ️',
        content: [
          { type: 'table', rows: [
            ['报告编号', reportId],
            ['生成时间', `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`],
            ['数据来源', 'YanCe Policy Agent 政策数据库 (yance.ai) + 公开政策信息'],
            ['分析引擎', `YanCe Policy Agent v1.0.0`],
            ['免责声明', '本报告仅供参考，具体以官方发布为准']
          ]}
        ]
      }
    ];
  },

  // ========================================
  // Export & Share
  // ========================================
  onExportTap() {
    this.setData({ showExportMenu: !this.data.showExportMenu });
  },

  onExportOptionTap(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({ showExportMenu: false });

    switch (option) {
      case 'markdown':
        wx.showToast({ title: 'Markdown 导出功能开发中', icon: 'none' });
        break;
      case 'share':
        wx.showToast({ title: '分享功能开发中', icon: 'none' });
        break;
      case 'print':
        wx.showToast({ title: '打印功能开发中', icon: 'none' });
        break;
    }
  },

  onShareAppMessage() {
    return {
      title: `${this.data.company.name} 政策服务报告 - YanCe Policy Agent | yance.ai`,
      path: '/pages/report/report'
    };
  },

  /**
   * Navigate back to match
   */
  onBackToMatch() {
    wx.navigateBack();
  }
});
