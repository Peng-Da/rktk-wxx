const app = app || getApp();
const zutils = require('../../utils/zutils.js');

Page({
  data: {
  },

  onLoad: function () {
    var that = this;
    app.getUserInfo(function () {
      that.listSubject();
    });
  },

  onShow: function () {
    if (zutils.array.in(app.GLOBAL_DATA.RELOAD_SUBJECT, 'Subject')) {
      zutils.array.erase(app.GLOBAL_DATA.RELOAD_SUBJECT, 'Subject');
      this.listSubject();
    }
  },

  listSubject: function () {
    var that = this;
    zutils.post(app, 'api/subject/list', function (res) {
      if (res.data.error_code > 0) {
        that.setData({
          showNosubject: true
        })
        wx.navigateTo({
          url: 'subject-choice?source=first'
        });
        return;
      }

      var _data = res.data.data;
      wx.setNavigationBarTitle({
        title: _data.subject
      });
      _data.showNosubject = false;
      that.setData(_data);
    });
  },

  onShareAppMessage: function (e) {
    var d = app.warpShareData('/pages/question/subject-list');
    if (this.data.subject) d.title = this.data.subject + '题库';
    else d.title = '软考题库';
    console.log(d);
    return d;
  }
});