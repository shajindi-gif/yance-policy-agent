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
      { id: 'generate', icon: '📋', title: '为企业生成政策服务建议', desc: '一键分析匹配政策', color: '#0ea5e9' },
      { id: 'match', icon: '🔍', title: '政策智能匹配', desc: '多维度政策匹配分析', color: '#f97316' },
      { id: 'report', icon: '📊', title: '服务报告', desc: '生成完整服务报告', color: '#10b981' },
      { id: 'library', icon: '📚', title: '政策库', desc: '浏览园区政策库', color: '#8b5cf6' }
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
      case 'generate':
        wx.navigateTo({ url: '/pages/company/company' });
        break;
      case 'match':
        wx.navigateTo({ url: '/pages/match/match' });
        break;
      case 'report':
        wx.navigateTo({ url: '/pages/report/report' });
        break;
      case 'library':
        wx.showToast({ title: '政策库功能开发中', icon: 'none' });
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
