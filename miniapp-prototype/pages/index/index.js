// pages/index/index.js
// YanCe Policy Agent - Home Page
// Brand: yance.ai

const app = getApp();

Page({
  data: {
    currentPark: null,
    parkList: [],
    recentServices: [],
    quickActions: [
      { id: 'company', icon: '🏢', title: '企业录入', desc: '录入新企业信息', bgColor: 'rgba(14, 165, 233, 0.12)' },
      { id: 'match', icon: '🔗', title: '政策匹配', desc: '智能匹配可申报政策', bgColor: 'rgba(249, 115, 22, 0.12)' },
      { id: 'order', icon: '📝', title: '服务工单', desc: '查看与管理服务工单', bgColor: 'rgba(16, 185, 129, 0.12)' },
      { id: 'report', icon: '📊', title: '运营报告', desc: '生成完整服务报告', bgColor: 'rgba(139, 92, 246, 0.12)' }
    ],
    stats: {
      totalCompanies: 0,
      totalServices: 0,
      matchRate: 0
    },
    showParkPicker: false,
    loading: false
  },

  onLoad() {
    this._loadData();
  },

  onShow() {
    this._loadData();
  },

  /**
   * Load data from global state
   */
  _loadData() {
    const park = app.globalData.currentPark;
    const recentServices = app.globalData.recentServices || [];
    const parkList = app.globalData.parkList || [];

    this.setData({
      currentPark: park,
      parkList: parkList,
      recentServices: recentServices.slice(0, 5),
      stats: {
        totalCompanies: park ? park.companyCount : 0,
        totalServices: park ? park.serviceCount : 0,
        matchRate: park ? park.progressRate : 0
      }
    });
  },

  /**
   * Handle quick action tap
   */
  onQuickActionTap(e) {
    const action = e.currentTarget.dataset.action;
    switch (action) {
      case 'company':
        wx.navigateTo({ url: '/pages/company/company' });
        break;
      case 'match':
        wx.navigateTo({ url: '/pages/match/match' });
        break;
      case 'report':
        wx.navigateTo({ url: '/pages/report/report' });
        break;
      case 'order':
        wx.navigateTo({ url: '/pages/park/park' });
        break;
      default:
        break;
    }
  },

  /**
   * Open park picker
   */
  onParkPickerOpen() {
    this.setData({ showParkPicker: true });
  },

  /**
   * Close park picker
   */
  onParkPickerClose() {
    this.setData({ showParkPicker: false });
  },

  /**
   * Handle park selection
   */
  onParkChange(e) {
    const index = e.detail.value;
    const park = this.data.parkList[index];
    if (park) {
      app.setCurrentPark(park);
      this._loadData();
      this.setData({ showParkPicker: false });
      wx.showToast({ title: `已切换至${park.name}`, icon: 'none' });
    }
  },

  /**
   * Navigate to recent service detail
   */
  onRecentServiceTap(e) {
    const service = e.currentTarget.dataset.service;
    wx.navigateTo({
      url: `/pages/report/report?serviceId=${service.id}`
    });
  },

  /**
   * Pull to refresh
   */
  onPullDownRefresh() {
    this._loadData();
    wx.stopPullDownRefresh();
  }
});
