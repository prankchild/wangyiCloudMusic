import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 表单内容发生改变的回调
  handleInput(event) {
    let type = event.currentTarget.id
    this.setData({
      [type]: event.detail.value
    })
  },
  async login() {
    let { phone, password } = this.data
    // 手机号验证
    if (!phone) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能为空'
      })
      return
    }
    // 正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        icon: 'none',
        title: '手机号有误,请重新输入'
      })
      return
    }
    if (!password) {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空'
      })
      return
    }

    let result = await request('/login/cellphone', { phone, password, isLogin: true })
    if (result.code === 200) {
      wx.showToast({
        title: '登录成功'
      })

      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      wx.reLaunch({
        url: '/page/personal/personal'
      })
    } else if (result.code === 400) {
      wx.showToast({
        icon: 'none',
        title: '手机号有误,请重新输入'
      })
    } else if (result.code === 502) {
      wx.showToast({
        icon: 'none',
        title: '密码有误'
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '登录失败,请重新登录'
      })
    }
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