import request from '../../utils/request'
// page/personal/personal.js
let startY = 0        // 起始坐标
let moveY = 0         // 移动坐标
let moveDistance = 0  // 移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransfrom: 'translateY(0rpx)',
    coverTransition: '',
    userInfo: {},
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', { uid: userId, type: 0 })
    let index = 0
    let recentPlayList = recentPlayListData.allData.splice(0, 10).map(item => {
      item.id = 'recentPlay_' + index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },
  handleTouchStart(event) {
    // 起始坐标
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    // 动态更新coverTransfrom的值
    if (moveDistance <= 0) {
      return
    }
    if (moveDistance >= 120) {
      moveDistance = 120
    }
    this.setData({
      coverTransfrom: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(event) {
    this.setData({
      coverTransfrom: `translateY(0rpx)`,
      coverTransition: 'transform .6s linear'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/page/login/login'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})