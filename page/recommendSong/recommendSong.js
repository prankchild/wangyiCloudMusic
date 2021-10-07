// page/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0  // 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    if (!wx.getStorageSync('userInfo')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({ url: '/pages/login/login' })
        }
      })
    }
    this.setData({
      day: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate(),
      month: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
    })
    this.getRecommendList()

    // 订阅来自 songDetail 页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let { recommendList, index } = this.data
      if (type === 'pre') {
        (index === 0) && (index = recommendList.length)
        index -= 1
      } else {
        (index === recommendList.length - 1) && (index = -1)
        index += 1
      }

      let musicId = recommendList[index].id
      this.setData({
        index
      })
      PubSub.publish('musicId', musicId)
    })
  },
  // 获取推荐歌曲
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },
  // 跳转到SongDetail
  toSongDetail(e) {
    let { song, index } = e.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      // url: '/page/songDetail/songDetail?song=' + JSON.stringify(song)
      url: '/page/songDetail/songDetail?musicId=' + song.id
    })
    //  + JSON.stringify(song)
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