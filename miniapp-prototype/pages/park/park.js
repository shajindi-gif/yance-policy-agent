// pages/park/park.js
// YanCe Policy Agent - Park Workbench
// Brand: yance.ai

const app = getApp();

Page({
  data: {
    park: null,
    overview: {
      companyCount: 0,
      serviceCount: 0,
      progressRate: 0,
      pendingTasks: 0
    },
    quickActions: [
      { id: 'entry', icon: '🏢', title: '企业录入', desc: '录入新企业信息' },
      { id: 'match', icon: '🔗', title: '政策匹配', desc: '为园区企业匹配政策' },
      { id: 'order', icon: '📝', title: '服务工单', desc: '管理服务工单' },
      { id: 'ops', icon: '📈', title: '运营报告', desc: '生成运营报告' }
    ],
    recentActivities: [
      { time: '10:30', action: '为「智云科技」生成政策匹配报告', type: 'match' },
      { time: '09:45', action: '录入新企业「芯创微电子」', type: 'entry' },
      { time: '09:15', action: '推送算力券政策信息给5家企业', type: 'push' },
      { time: '昨天 16:30', action: '完成「未来机器人」高企认定辅导', type: 'service' },
      { time: '昨天 14:00', action: '更新园区政策库 - 新增3条政策', type: 'policy' }
    ],
    serviceOrders: [
      { id: 1, company: '智云科技有限公司', task: '高企认定辅导', status: '进行中', urgency: 'high' },
      { id: 2, company: '芯创微电子科技', task: '专精特新申报', status: '待处理', urgency: 'medium' },
      { id: 3, company: '未来机器人科技', task: '算力券申请', status: '进行中', urgency: 'low' },
      { id: 4, company: '数据智能科技', task: '场地补贴申报', status: '待处理', urgency: 'high' }
    ],
    loading: true
  },

  onLoad() {
    this._loadParkData();
  },

  onShow() {
    this._loadParkData();
  },

  /**
   * Load park data with skeleton loading simulation
   */
  _loadParkData() {
    this.setData({ loading: true });

    // Simulate loading delay for skeleton screen demo
    setTimeout(() => {
      const park = app.globalData.currentPark;
      if (park) {
        this.setData({
          loading: false,
          park: park,
          overview: {
            companyCount: park.companyCount || 0,
            serviceCount: park.serviceCount || 0,
            progressRate: park.progressRate || 0,
            pendingTasks: this.data.serviceOrders.filter(o => o.status === '待处理').length
          }
        });
      } else {
        this.setData({ loading: false });
      }
    }, 600);
  },

  /**
   * Handle quick action tap
   */
  onQuickActionTap(e) {
    const action = e.currentTarget.dataset.action;
    switch (action) {
      case 'entry':
        wx.navigateTo({ url: '/pages/company/company' });
        break;
      case 'match':
        wx.navigateTo({ url: '/pages/match/match' });
        break;
      case 'order':
        wx.showToast({ title: '服务工单功能开发中', icon: 'none' });
        break;
      case 'ops':
        wx.navigateTo({ url: '/pages/report/report' });
        break;
      default:
        break;
    }
  },

  /**
   * Navigate to company detail
   */
  onOrderTap(e) {
    const order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: `/pages/company/company?companyId=${order.id}`
    });
  },

  /**
   * Pull to refresh
   */
  onPullDownRefresh() {
    this._loadParkData();
    wx.stopPullDownRefresh();
  }
});
