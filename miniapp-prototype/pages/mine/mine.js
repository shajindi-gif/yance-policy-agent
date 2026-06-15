// pages/mine/mine.js
// YanCe Policy Agent - My Profile Page

const app = getApp();

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,

    // Stats
    stats: {
      reportCount: 12,
      companyCount: 45,
      matchCount: 89,
      serviceDays: 128
    },

    // Menu items
    menuGroups: [
      {
        title: '数据管理',
        items: [
          { id: 'my-reports', icon: '📊', label: '我的报告', badge: 12 },
          { id: 'my-companies', icon: '🏢', label: '企业管理', badge: 0 },
          { id: 'policy-library', icon: '📚', label: '政策库', badge: 0 },
          { id: 'data-export', icon: '📤', label: '数据导出', badge: 0 }
        ]
      },
      {
        title: '设置',
        items: [
          { id: 'park-settings', icon: '🏗️', label: '园区设置', badge: 0 },
          { id: 'notification', icon: '🔔', label: '通知设置', badge: 0 },
          { id: 'theme', icon: '🎨', label: '主题设置', badge: 0 }
        ]
      },
      {
        title: '关于',
        items: [
          { id: 'help', icon: '❓', label: '使用帮助', badge: 0 },
          { id: 'feedback', icon: '💬', label: '意见反馈', badge: 0 },
          { id: 'about', icon: 'ℹ️', label: '关于 YanCe', badge: 0, extra: 'v1.0.0' }
        ]
      }
    ],

    // Settings toggles
    settings: {
      autoSync: true,
      pushNotification: true,
      darkMode: false
    }
  },

  onLoad() {
    this._checkLoginStatus();
  },

  onShow() {
    this._loadStats();
  },

  /**
   * Check if user is logged in
   */
  _checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ isLoggedIn: true, userInfo });
    }
  },

  /**
   * Load usage stats
   */
  _loadStats() {
    // In a real app, this would come from the backend
    const park = app.globalData.currentPark;
    if (park) {
      this.setData({
        'stats.companyCount': park.companyCount || 45,
        'stats.matchCount': 89,
        'stats.reportCount': 12
      });
    }
  },

  /**
   * Handle login
   */
  onLoginTap() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({ isLoggedIn: true, userInfo });
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      fail: () => {
        // Use mock login for prototype
        const mockUser = {
          nickName: '园区管理员',
          avatarUrl: ''
        };
        wx.setStorageSync('userInfo', mockUser);
        this.setData({ isLoggedIn: true, userInfo: mockUser });
      }
    });
  },

  /**
   * Handle menu item tap
   */
  onMenuTap(e) {
    const id = e.currentTarget.dataset.id;
    switch (id) {
      case 'my-reports':
        wx.showToast({ title: '报告列表功能开发中', icon: 'none' });
        break;
      case 'my-companies':
        wx.navigateTo({ url: '/pages/company/company' });
        break;
      case 'policy-library':
        wx.showToast({ title: '政策库功能开发中', icon: 'none' });
        break;
      case 'data-export':
        wx.showToast({ title: '数据导出功能开发中', icon: 'none' });
        break;
      case 'park-settings':
        wx.navigateTo({ url: '/pages/index/index' });
        break;
      case 'notification':
        wx.showToast({ title: '通知设置功能开发中', icon: 'none' });
        break;
      case 'theme':
        wx.showToast({ title: '主题设置功能开发中', icon: 'none' });
        break;
      case 'help':
        wx.showModal({
          title: '使用帮助',
          content: '1. 在首页选择园区\n2. 录入企业信息\n3. 进行政策匹配\n4. 生成服务报告\n\n如有问题请联系技术支持。',
          showCancel: false
        });
        break;
      case 'feedback':
        wx.showToast({ title: '意见反馈功能开发中', icon: 'none' });
        break;
      case 'about':
        wx.showModal({
          title: '关于 YanCe Policy Agent',
          content: '版本：v1.0.0\n\nYanCe Policy Agent 是一款面向产业园区的政策分析助手，帮助园区工作人员高效分析政策、精准服务园区企业。\n\n官网：yance.ai\n\n© 2025 YanCe Policy Agent | yance.ai',
          showCancel: false
        });
        break;
      default:
        break;
    }
  },

  /**
   * Toggle setting
   */
  onSettingToggle(e) {
    const key = e.currentTarget.dataset.key;
    const value = !this.data.settings[key];
    this.setData({ [`settings.${key}`]: value });
    wx.showToast({ title: '设置已更新', icon: 'success' });
  },

  /**
   * Logout
   */
  onLogoutTap() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          this.setData({ isLoggedIn: false, userInfo: null });
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  }
});
