import request from "../../utils/request"

let isSend = false
// page/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认搜索关键字
    placeholderContent: '',
    // 热搜榜数据
    hotList: [],
    // 用户输入的表单项数据
    searchContent: '',
    // 搜索匹配关键字列表
    searchList: [],
    // 搜索历史数据
    historyList: []
  },

  onLoad: function (options) {
    this.getSearchHistory()
    this.getInitData()
  },
  // 获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },
  // 获取本地数据历史记录
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },
  // 表单内容改变回调
  handleInputChange(e) {
    this.setData({
      searchContent: e.detail.value.trim()
    })
    if (isSend) {
      return
    }
    isSend = true
    // 函数节流
    setTimeout(async () => {
      this.getSearchList()
      isSend = false
    }, 1000)

  },
  // 发送请求表单关键字模糊数据
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    let { searchContent, historyList } = this.data
    let searchListData = await request('/search', { keywords: this.data.searchContent, limit: 10 })
    this.setData({
      searchList: searchListData.result.songs
    })

    // 将搜索关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })

    wx.setStorageSync('searchHistory', historyList)
  },

  // 清空搜索内容
  clearSearhContent() {
    console.log('clear');
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  // 删除搜索历史记录
  deleteSearchHistory() {
    wx.showModal({
      title: '',
      content: '确认删除历史记录吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorage({ key: 'searchHistory' })
        }
      },
      fail: () => { },
      complete: () => { }
    });

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})