import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
// page/songDetail/songDetail.js 
const appInstance = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 音乐是否播放
    isPlay: false,
    song: [],
    musicId: '',
    currentTime: '00:00', // 音乐实时时间
    durationTime: '00:00', // 音乐总时间
    currentWidth: 0 // 音乐进度条的实时长度
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改当前页面音乐状态为Ture
      this.setData({
        isPlay: true
      })
    }
    // 监听系统控制音乐播放和暂停的状态
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换下一首音乐 并且自动播放
      PubSub.publish('switchType', 'next')
      // 将进度条长度调整为0
      this.changePlayState(false)
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
    // 监听实时播放时间
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  // 根据 musicId 获取 数据
  async getMusicInfo(musicId) {
    let songData = await request(`/song/detail`, { ids: musicId })
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({ title: this.data.song.name })
  },

  // 点击播放/暂停的回调
  handlemusicPlay() {
    let isPlay = !this.data.isPlay
    let { musicId, musicLink } = this.data
    this.musicControl(isPlay, musicId, musicLink)
  },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    // 音乐播放
    if (isPlay) {
      if (!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', { id: musicId })
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else { // 暂停音乐
      this.backgroundAudioManager.pause()
    }
  },
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    // 修改全局音乐播放状态
    appInstance.globalData.isMusicPlay = isPlay
  },

  // 切换歌曲的回调
  handleSwitch(e) {
    let type = e.currentTarget.id
    // 关闭当前播放音乐
    this.backgroundAudioManager.stop()
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
    PubSub.subscribe('musicId', (msg, musicId) => {
      this.getMusicInfo(musicId)
      // 自动播放当前音乐
      this.musicControl(true, musicId)
      PubSub.unsubscribe('musicId')
    })
  },

  hadleUpdateProcess(e) {
    console.log(e);
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