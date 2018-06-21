
// var API_URL = 'http://116.62.62.137:9801/all/'
var header = getApp().globalData.header; 
var API_URL = getApp().globalData.API_URL;


var requestHandler = {
  params: {},
  success:  (res)=> {
    // success
  },
  fail:  () =>{
    // fail
  },
}

//GET请求
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  header['content-type'] = "application/x-www-form-urlencoded"
  request('POST', requestHandler)
}
//PUT请求
function PUT(requestHandler) {
  header['content-type']="application/x-www-form-urlencoded"
  request('PUT', requestHandler)
}
//DELETE请求
function DELETE(requestHandler) {
  header['content-type'] = "application/x-www-form-urlencoded"
  request('DELETE', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  params.__sessid = wx.getStorageSync("token");
  var uri = requestHandler.url;
  wx.request({
    url: API_URL+uri,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header, // 设置请求的 header
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      // complete
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE
}