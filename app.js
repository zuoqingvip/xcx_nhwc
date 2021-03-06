//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that=this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 登录
              wx.login({
                success: r => {
                  var userInfo = res.userInfo;
                  console.log(res)
                  // 发送 c 到后台换取 openId, sessionKey, unionId
                  this.ajaxRequest('member/getUserInfo', 'POST', { 'code': r.code, 'userInfo': userInfo },function(e){
                    that.globalData.userID = e.data.data.id
                  })
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  ajaxRequest:function(urlParams,reqType,reqData,callback){
    var that=this;
    var jsonData;
    wx.request({
      url: that.globalData.baseUrl+urlParams,
      data: reqData,
      method: reqType,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (typeof callback === "function") { //是函数    其中 FunName 为函数名称
          callback(res)
        }
      },
      fail: function (res) {
        if (typeof callback === "function") { //是函数    其中 FunName 为函数名称
          callback(res)
        }
      }
    })
   
  },
  globalData: {
    userInfo: null,
    userID:null,
    baseUrl:'https://api.zsxcx.com/api/'
  }
})