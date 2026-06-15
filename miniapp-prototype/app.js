// app.js
// YanCe Policy Agent Mini Program
// Brand: yance.ai

App({
  onLaunch() {
    console.log('[YanCe] App launched — yance.ai');

    // Check for updates
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          console.log('[YanCe] Update available');
        }
      });
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
    }

    // Load cached park data
    this._loadCachedData();
  },

  onShow() {
    console.log('[YanCe] App visible');
  },

  onHide() {
    console.log('[YanCe] App hidden');
  },

  /**
   * Load cached data from local storage
   */
  _loadCachedData() {
    try {
      const cachedPark = wx.getStorageSync('currentPark');
      if (cachedPark) {
        this.globalData.currentPark = cachedPark;
      }

      const cachedCompany = wx.getStorageSync('currentCompany');
      if (cachedCompany) {
        this.globalData.currentCompany = cachedCompany;
      }

      const recentServices = wx.getStorageSync('recentServices');
      if (recentServices) {
        this.globalData.recentServices = recentServices;
      }
    } catch (e) {
      console.error('[YanCe] Failed to load cached data:', e);
    }
  },

  /**
   * Save current park to cache
   */
  setCurrentPark(park) {
    this.globalData.currentPark = park;
    try {
      wx.setStorageSync('currentPark', park);
    } catch (e) {
      console.error('[YanCe] Failed to cache park data:', e);
    }
  },

  /**
   * Save current company to cache
   */
  setCurrentCompany(company) {
    this.globalData.currentCompany = company;
    try {
      wx.setStorageSync('currentCompany', company);
    } catch (e) {
      console.error('[YanCe] Failed to cache company data:', e);
    }
  },

  /**
   * Add a service record to recent list
   */
  addRecentService(service) {
    const list = this.globalData.recentServices;
    list.unshift({
      ...service,
      timestamp: Date.now(),
      date: this._formatDate(new Date())
    });
    // Keep only last 20 records
    if (list.length > 20) {
      list.length = 20;
    }
    this.globalData.recentServices = list;
    try {
      wx.setStorageSync('recentServices', list);
    } catch (e) {
      console.error('[YanCe] Failed to cache services:', e);
    }
  },

  /**
   * Format date as YYYY-MM-DD
   */
  _formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  globalData: {
    domain: 'yance.ai',
    currentPark: {
      id: 'park-001',
      name: '张江人工智能产业园',
      region: '上海市浦东新区',
      companyCount: 156,
      serviceCount: 42,
      progressRate: 78
    },
    currentCompany: null,
    recentServices: [
      {
        id: 'svc-001',
        companyName: '智云科技有限公司',
        type: '政策匹配',
        summary: '匹配到3项可申报政策',
        date: '2025-01-15',
        status: 'completed'
      },
      {
        id: 'svc-002',
        companyName: '芯创微电子科技',
        type: '服务报告',
        summary: '生成高企认定辅导报告',
        date: '2025-01-14',
        status: 'completed'
      },
      {
        id: 'svc-003',
        companyName: '未来机器人科技',
        type: '政策推送',
        summary: '推送算力券政策信息',
        date: '2025-01-13',
        status: 'pending'
      }
    ],
    parkList: [
      { id: 'park-001', name: '张江人工智能产业园', region: '上海市浦东新区' },
      { id: 'park-002', name: '漕河泾新兴技术开发区', region: '上海市徐汇区' },
      { id: 'park-003', name: '临港智能制造产业园', region: '上海市临港新片区' },
      { id: 'park-004', name: '杨浦创智天地', region: '上海市杨浦区' },
      { id: 'park-005', name: '苏州工业园区AI小镇', region: '苏州市工业园区' }
    ]
  }
});
