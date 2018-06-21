var BASEAPI_URL = 'http://116.62.62.137:9801/all/'
// var requestHandler = {
//   params: {},
//   // success: function (res) {
//   //   // success
//   // },
//   // fail: function () {
//   //   // fail
//   // },
//   url:""
// }

// //GET请求
// function GET(requestHandler) {
//   request('GET', requestHandler)
// }
// //POST请求
// function POST(requestHandler) {
//   request('POST', requestHandler)
// }
// function request(method, requestHandler) {
//   //注意：可以对params加密等处理
//   var params = requestHandler.params;
//   var uri = requestHandler.url;
//   // wx.request({
//   //   url: API_URL + uri,
//   //   data: params,
//   //   method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
//   //   // header: {}, // 设置请求的 header
//   //   success: function (res) {
//   //     //注意：可以对参数解密等处理
//   //     requestHandler.success(res)
//   //   },
//   //   fail: function () {
//   //     requestHandler.fail()
//   //   },
//   //   complete: function () {
//   //     // complete
//   //   }
//   // })
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: BASEAPI_URL + uri,
//       data: params,
//       header: { 'content-type': 'application/json' },
//       method: method,
//       dataType: 'json',
//       // responseType: 'text',
//       success: resolve,
//       fail: reject,
//       complete: function (res) { },
//     })
//   })
// }
module.exports=(url,type,data)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: BASEAPI_URL+url,
      data: data,
      header: { 'content-type': 'application/json' },
      method: type,
      dataType: 'json',
      // responseType: 'text',
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}
// module.exports = {
//   GET: GET,
//   POST: POST
// }