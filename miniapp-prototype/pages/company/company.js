// pages/company/company.js
// YanCe Policy Agent - Company Entry Form

const app = getApp();

Page({
  data: {
    // Form fields
    companyName: '',
    contactPerson: '',
    contactPhone: '',
    registeredCapital: '',
    establishedYear: '',
    employeeCount: '',

    // Pickers
    regionIndex: 0,
    regions: [
      '上海市浦东新区', '上海市徐汇区', '上海市杨浦区', '上海市松江区',
      '上海市嘉定区', '上海市临港新片区', '北京市中关村', '北京市亦庄经开区',
      '深圳市南山区', '深圳市前海', '杭州市余杭区', '杭州市滨江区',
      '苏州市工业园区', '成都市天府新区', '广州市天河区', '武汉市东湖高新区'
    ],

    industryIndex: 0,
    industries: [
      '人工智能', '生物医药', '集成电路', '新材料', '新能源',
      '智能制造', '软件与信息服务', '数字经济', '金融科技',
      '文化创意', '现代农业', '航空航天', '其他'
    ],

    companyTypeIndex: 0,
    companyTypes: [
      '有限责任公司', '股份有限公司', '合伙企业', '个人独资企业', '外商投资企业'
    ],

    // Needs checkboxes
    needs: [
      { key: 'startup', label: '创业补贴', checked: false },
      { key: 'rent', label: '场地补贴', checked: false },
      { key: 'computing', label: '算力券', checked: false },
      { key: 'model', label: '模型券', checked: false },
      { key: 'hn-tech', label: '高企认定', checked: false },
      { key: 'sme', label: '专精特新', checked: false },
      { key: 'sci-sme', label: '科技型中小企业', checked: false },
      { key: 'talent', label: '人才引进', checked: false },
      { key: 'rd', label: '研发费用补贴', checked: false },
      { key: 'ip', label: '知识产权资助', checked: false },
      { key: 'finance', label: '融资对接', checked: false },
      { key: 'platform', label: '公共平台补贴', checked: false }
    ],

    // Certifications
    certifications: {
      highTech: false,
      specialized: false,
      sciSme: false,
      unicorn: false,
      gazelle: false
    },

    // Additional info
    ipCount: '',
    rdRatio: '',
    annualRevenue: '',
    description: '',

    // UI state
    showPreFill: false,
    submitting: false,
    pageLoading: true
  },

  onLoad(options) {
    // Simulate loading for skeleton screen
    setTimeout(() => {
      this.setData({ pageLoading: false });
    }, 400);

    // If coming with a company ID, pre-fill
    if (options.companyId) {
      this._loadCompanyData(options.companyId);
    }

    // Set park region as default
    const park = app.globalData.currentPark;
    if (park && park.region) {
      const regionIdx = this.data.regions.indexOf(park.region);
      if (regionIdx >= 0) {
        this.setData({ regionIndex: regionIdx });
      }
    }
  },

  // ========================================
  // Form Input Handlers
  // ========================================
  onCompanyNameInput(e) {
    this.setData({ companyName: e.detail.value });
  },

  onContactPersonInput(e) {
    this.setData({ contactPerson: e.detail.value });
  },

  onContactPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value });
  },

  onRegisteredCapitalInput(e) {
    this.setData({ registeredCapital: e.detail.value });
  },

  onEstablishedYearInput(e) {
    this.setData({ establishedYear: e.detail.value });
  },

  onEmployeeCountInput(e) {
    this.setData({ employeeCount: e.detail.value });
  },

  onRegionChange(e) {
    this.setData({ regionIndex: parseInt(e.detail.value) });
  },

  onIndustryChange(e) {
    this.setData({ industryIndex: parseInt(e.detail.value) });
  },

  onCompanyTypeChange(e) {
    this.setData({ companyTypeIndex: parseInt(e.detail.value) });
  },

  onNeedToggle(e) {
    const index = e.currentTarget.dataset.index;
    const key = `needs[${index}].checked`;
    this.setData({ [key]: !this.data.needs[index].checked });
  },

  onCertToggle(e) {
    const cert = e.currentTarget.dataset.cert;
    const key = `certifications.${cert}`;
    this.setData({ [key]: !this.data.certifications[cert] });
  },

  onIpCountInput(e) {
    this.setData({ ipCount: e.detail.value });
  },

  onRdRatioInput(e) {
    this.setData({ rdRatio: e.detail.value });
  },

  onAnnualRevenueInput(e) {
    this.setData({ annualRevenue: e.detail.value });
  },

  onDescriptionInput(e) {
    this.setData({ description: e.detail.value });
  },

  // ========================================
  // Actions
  // ========================================

  /**
   * Pre-fill with sample data for demo
   */
  onPreFillTap() {
    this.setData({
      companyName: '智云科技有限公司',
      contactPerson: '张经理',
      contactPhone: '138****5678',
      registeredCapital: '1000',
      establishedYear: '2020',
      employeeCount: '85',
      regionIndex: 0,
      industryIndex: 0,
      companyTypeIndex: 0,
      ipCount: '12',
      rdRatio: '8.5',
      annualRevenue: '3500',
      description: '专注于人工智能技术研发与行业应用，主要产品包括智能客服系统、AI数据分析平台等。',
      'needs[4].checked': true,  // 高企认定
      'needs[2].checked': true,  // 算力券
      'needs[7].checked': true,  // 人才引进
      'certifications.sciSme': true
    });

    wx.showToast({ title: '已填入示例数据', icon: 'success' });
  },

  /**
   * Validate and submit form
   */
  onSubmitTap() {
    // Validate required fields
    if (!this.data.companyName.trim()) {
      wx.showToast({ title: '请填写企业名称', icon: 'none' });
      return;
    }
    if (!this.data.contactPerson.trim()) {
      wx.showToast({ title: '请填写联系人', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    // Collect form data
    const companyData = {
      name: this.data.companyName,
      contactPerson: this.data.contactPerson,
      contactPhone: this.data.contactPhone,
      registeredCapital: this.data.registeredCapital,
      establishedYear: this.data.establishedYear,
      employeeCount: this.data.employeeCount,
      region: this.data.regions[this.data.regionIndex],
      industry: this.data.industries[this.data.industryIndex],
      companyType: this.data.companyTypes[this.data.companyTypeIndex],
      needs: this.data.needs.filter(n => n.checked).map(n => n.label),
      certifications: this.data.certifications,
      ipCount: this.data.ipCount,
      rdRatio: this.data.rdRatio,
      annualRevenue: this.data.annualRevenue,
      description: this.data.description
    };

    // Save to global state
    app.setCurrentCompany(companyData);

    // Simulate submission delay
    setTimeout(() => {
      this.setData({ submitting: false });

      wx.showModal({
        title: '提交成功',
        content: `已保存「${companyData.name}」的企业信息。是否立即进行政策匹配？`,
        confirmText: '政策匹配',
        cancelText: '返回首页',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/match/match' });
          } else {
            wx.navigateBack();
          }
        }
      });
    }, 800);
  },

  /**
   * Load company data (for editing)
   */
  _loadCompanyData(companyId) {
    const company = app.globalData.currentCompany;
    if (company) {
      this.setData({
        companyName: company.name || '',
        contactPerson: company.contactPerson || '',
        contactPhone: company.contactPhone || '',
        registeredCapital: company.registeredCapital || '',
        establishedYear: company.establishedYear || '',
        employeeCount: company.employeeCount || '',
        ipCount: company.ipCount || '',
        rdRatio: company.rdRatio || '',
        annualRevenue: company.annualRevenue || '',
        description: company.description || ''
      });
    }
  },

  /**
   * Reset form
   */
  onResetTap() {
    wx.showModal({
      title: '确认重置',
      content: '确定要清空所有已填写的内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            companyName: '', contactPerson: '', contactPhone: '',
            registeredCapital: '', establishedYear: '', employeeCount: '',
            regionIndex: 0, industryIndex: 0, companyTypeIndex: 0,
            ipCount: '', rdRatio: '', annualRevenue: '', description: '',
            'certifications.highTech': false, 'certifications.specialized': false,
            'certifications.sciSme': false, 'certifications.unicorn': false,
            'certifications.gazelle': false
          });
          // Reset all needs
          const needs = this.data.needs.map(n => ({ ...n, checked: false }));
          this.setData({ needs });
        }
      }
    });
  }
});
