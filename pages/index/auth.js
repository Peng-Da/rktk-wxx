const app = app || getApp();
const zutils = require('../../utils/zutils.js');

Page({
  data: {
    authActive: false
  },

  onLoad: function (e) {
    this.nexturl = decodeURIComponent(e.nexturl || '/pages/index/index');
    wx.setNavigationBarTitle({ title: '软考必备' });

    let that = this;
    wx.login({
      success: function (res) {
        that.__loginCode = res.code;
        that.setData({ authActive: true });
      }
    })
  },

  storeUserInfo: function (e) {
    let info_res = e.detail;
    if (info_res.errMsg != 'getUserInfo:ok') {
      this.setData({ authText: '重新授权' })
      return;
    }
    this.setData({ authText: '请稍后', authActive: false })
    console.log('存储info - ' + JSON.stringify(info_res));
    let that = this;
    let _data = {
      code: that.__loginCode,
      data: info_res
    };
    zutils.post(that, 'u/wx/login/', _data, function (res) {
      console.log('auth--' + JSON.stringify(res))
      app.GLOBAL_DATA.USER_INFO = info_res.userInfo;
      app.GLOBAL_DATA.USER_INFO.token = res.data.token
      wx.setStorage({
        key: 'USER_INFO',
        data: app.GLOBAL_DATA.USER_INFO,
        success: function () {
          if (that.nexturl == 'back') wx.navigateBack()
          else app.gotoPage(that.nexturl, true)
        }
      })

    
    // let _data = { code: that.__loginCode, iv: res.iv, data: res.encryptedData };
    // zutils.post(app, 'api/user/wxx-login?noloading', _data, function (res) {
    //   app.GLOBAL_DATA.USER_INFO = res.data.data;
    //   wx.setStorage({
    //     key: 'USER_INFO', data: app.GLOBAL_DATA.USER_INFO,
    //     success: function () {
    //       if (that.nexturl == 'back') wx.navigateBack()
    //       else app.gotoPage(that.nexturl, true)
    //     }
    //   });
    });
  },

  goback() {
    wx.navigateBack()
  }
})