// pages/match/match.js
// YanCe Policy Agent - Policy Matching Results
// Brand: yance.ai

const app = getApp();

Page({
  data: {
    company: null,
    matching: false,
    matchComplete: false,
    matchStep: 0,

    // Match results
    matchSummary: {
      totalPolicies: 0,
      highMatch: 0,
      mediumMatch: 0,
      lowMatch: 0,
      overallScore: 0
    },

    matchedPolicies: [],
    expandedPolicy: null,

    // Material gaps
    materialGaps: []
  },

  onLoad() {
    const company = app.globalData.currentCompany;
    if (company) {
      this.setData({ company });
      this._startMatching();
    } else {
      this.setData({
        company: {
          name: '智云科技有限公司',
          industry: '人工智能',
          region: '上海市浦东新区',
          needs: ['高企认定', '算力券', '人才引进']
        }
      });
      this._startMatching();
    }
  },

  /**
   * Start policy matching with stepped animation
   */
  _startMatching() {
    this.setData({ matching: true, matchComplete: false, matchStep: 0 });

    // Step 1: scanning policy database
    setTimeout(() => {
      this.setData({ matchStep: 1 });
    }, 500);

    // Step 2: matching enterprise profile
    setTimeout(() => {
      this.setData({ matchStep: 2 });
    }, 1200);

    // Step 3: calculating scores
    setTimeout(() => {
      this.setData({ matchStep: 3 });
    }, 1800);

    // Complete
    setTimeout(() => {
      const results = this._getMockMatchResults();
      this.setData({
        matching: false,
        matchComplete: true,
        matchSummary: results.summary,
        matchedPolicies: results.policies,
        materialGaps: results.gaps
      });
    }, 2500);
  },

  /**
   * Toggle policy detail expansion
   */
  onPolicyTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      expandedPolicy: this.data.expandedPolicy === id ? null : id
    });
  },

  /**
   * Navigate to full report
   */
  onGenerateReport() {
    wx.navigateTo({ url: '/pages/report/report' });
  },

  /**
   * Share match results
   */
  onShareAppMessage() {
    return {
      title: `${this.data.company.name} 政策匹配结果 - YanCe Policy Agent | yance.ai`,
      path: '/pages/match/match'
    };
  },

  /**
   * Re-run matching
   */
  onRematchTap() {
    this._startMatching();
  },

  /**
   * Generate mock match results
   */
  _getMockMatchResults() {
    const company = this.data.company;
    return {
      summary: {
        totalPolicies: 18,
        highMatch: 5,
        mediumMatch: 8,
        lowMatch: 5,
        overallScore: 82
      },
      policies: [
        {
          id: 'p1',
          title: '高新技术企业认定',
          level: '国家级',
          score: 95,
          matchLevel: 'high',
          supportContent: '企业所得税减按15%征收，研发费用加计扣除',
          window: '每年4-9月',
          status: '开放中',
          conditions: [
            { text: '注册满一年以上', met: true },
            { text: '拥有核心自主知识产权', met: true },
            { text: '研发人员占比≥10%', met: true },
            { text: '研发费用占比达标', met: true },
            { text: '高新技术产品收入占比≥60%', met: false }
          ],
          missingMaterials: ['高新技术产品收入占比证明', '科技成果转化说明']
        },
        {
          id: 'p2',
          title: `${company.region}科技创新专项资金`,
          level: '区级',
          score: 92,
          matchLevel: 'high',
          supportContent: '研发费用补贴，最高不超过实际研发投入的20%',
          window: '每年3-4月',
          status: '未开放',
          conditions: [
            { text: '在本区注册经营', met: true },
            { text: '属于重点产业领域', met: true },
            { text: '研发投入占比≥3%', met: true },
            { text: '拥有自主知识产权', met: true }
          ],
          missingMaterials: []
        },
        {
          id: 'p3',
          title: '算力券政策',
          level: '市级',
          score: 90,
          matchLevel: 'high',
          supportContent: 'AI企业可申请算力使用补贴，最高50万元/年',
          window: '每季度',
          status: '开放中',
          conditions: [
            { text: 'AI相关企业', met: true },
            { text: '有明确的算力需求', met: true },
            { text: '在本市注册', met: true }
          ],
          missingMaterials: ['算力使用需求说明']
        },
        {
          id: 'p4',
          title: '专精特新"小巨人"企业认定',
          level: '国家级',
          score: 85,
          matchLevel: 'high',
          supportContent: '财政奖补50-100万元 + 融资优惠 + 项目优先',
          window: '每年第二季度',
          status: '未开放',
          conditions: [
            { text: '专业化发展', met: true },
            { text: '精细化运营', met: true },
            { text: '特色化产品', met: true },
            { text: '创新能力突出', met: true },
            { text: '营收达到一定规模', met: false }
          ],
          missingMaterials: ['营收规模佐证材料']
        },
        {
          id: 'p5',
          title: '人才引进安居计划',
          level: '区级',
          score: 88,
          matchLevel: 'high',
          supportContent: '高层次人才安居补贴10-100万元，子女入学便利',
          window: '每年5-6月',
          status: '未开放',
          conditions: [
            { text: '企业正常经营', met: true },
            { text: '人才符合认定标准', met: true },
            { text: '在本区缴纳社保', met: true }
          ],
          missingMaterials: []
        },
        {
          id: 'p6',
          title: '科技型中小企业评价',
          level: '国家级',
          score: 78,
          matchLevel: 'medium',
          supportContent: '研发费用加计扣除比例100%，亏损结转延长至10年',
          window: '全年',
          status: '开放中',
          conditions: [
            { text: '员工总数≤500人', met: true },
            { text: '年营收≤2亿', met: true },
            { text: '拥有科技人员', met: true }
          ],
          missingMaterials: []
        },
        {
          id: 'p7',
          title: '产业园区企业扶持办法',
          level: '园区级',
          score: 75,
          matchLevel: 'medium',
          supportContent: '场地租金减免50%-100%，公共平台使用补贴',
          window: '每季度',
          status: '开放中',
          conditions: [
            { text: '入驻园区企业', met: true },
            { text: '正常经营', met: true }
          ],
          missingMaterials: []
        },
        {
          id: 'p8',
          title: '知识产权资助计划',
          level: '区级',
          score: 72,
          matchLevel: 'medium',
          supportContent: '发明专利授权补贴5000-10000元/件，软著补贴1000元/件',
          window: '每年两次',
          status: '开放中',
          conditions: [
            { text: '拥有自主知识产权', met: true },
            { text: '在本区注册', met: true }
          ],
          missingMaterials: []
        },
        {
          id: 'p9',
          title: '数字化转型专项资金',
          level: '市级',
          score: 65,
          matchLevel: 'medium',
          supportContent: '支持企业数字化转型项目，最高补贴100万元',
          window: '每年一次',
          status: '未开放',
          conditions: [
            { text: '有数字化转型项目', met: false },
            { text: '在本市注册', met: true }
          ],
          missingMaterials: ['数字化转型方案']
        },
        {
          id: 'p10',
          title: '国际市场开拓资金',
          level: '市级',
          score: 45,
          matchLevel: 'low',
          supportContent: '支持企业参加国际展会和拓展海外市场',
          window: '每年两次',
          status: '开放中',
          conditions: [
            { text: '有出口业务', met: false },
            { text: '在本市注册', met: true }
          ],
          missingMaterials: ['出口业务证明']
        }
      ],
      gaps: [
        { type: '材料', item: '高新技术产品收入占比证明', priority: 'high', suggestion: '需财务部门出具相关统计报表' },
        { type: '材料', item: '科技成果转化说明', priority: 'high', suggestion: '整理近3年科技成果转化项目清单' },
        { type: '材料', item: '算力使用需求说明', priority: 'medium', suggestion: '编写算力需求文档，说明使用场景和预估用量' },
        { type: '资质', item: '营收规模佐证材料', priority: 'medium', suggestion: '准备近三年审计报告，确认营收是否达到专精特新门槛' },
        { type: '方案', item: '数字化转型方案', priority: 'low', suggestion: '如有数字化转型计划，建议编写专项方案' }
      ]
    };
  }
});
