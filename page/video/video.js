
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '', // 导航的标识
    videoList: [],
    videoId: "",
    videoUpdateTime: [],
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId) {
    if (!navId) {
      return
    }
    let videoListData = await request('/video/group', { id: navId })
    // 关闭消息提示框
    wx.hideLoading()
    let index = 0
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      // 关闭下拉刷新框
      isTriggered: false
    })
  },
  // 点击切换导航的回调
  changeNav(e) {
    let navId = e.currentTarget.id
    this.setData({
      navId: navId * 1,
      videoList: []
    })
    // 显示正在加载
    wx.showLoading({
      title: "正在加载",
    })
    this.getVideoList(this.data.navId)
  },
  // 点击播放视频的回调
  handlePlay(e) {
    let vid = e.currentTarget.id
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    // 判断当前视频是否有播放记录 如果有跳转到上次播放位置
    let { videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },
  // 鉴定视频播放进度回调
  handleTimeUpdate(e) {
    let videoTimeObj = { vid: e.currentTarget.id, currentTime: e.detail.currentTime }
    let { videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      videoItem.currentTime = e.detail.currentTime
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束的回调
  handleEnded(e) {
    let { videoUpdateTime } = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === e.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },
  // 下拉刷新回调
  handleRefresh() {
    this.getVideoList(this.data.navId)
  },
  // 懒加载 上拉刷新
  hadnleTolower() {
    // 网易没有懒加载接口 
  },
  toSearch() {
    wx.navigateTo({ url: '/page/search/search' })
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