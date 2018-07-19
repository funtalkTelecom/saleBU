
// var API_URL = 'http://116.62.62.137:9801/all/'
var header = getApp().globalData.header; 
var API_URL = getApp().globalData.API_URL;
var methodNum;


var requestHandler = {
  params: {},
  success:  (res)=> {
    // success
  },
  fail:  (res) =>{
    // fail
  },
  complete:  (res)=> {
   
  }
}

//GET请求
function GET(requestHandler) {
  methodNum=0;
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  methodNum = 1;
  header['content-type'] = "application/x-www-form-urlencoded"
  request('POST', requestHandler)
}
//PUT请求
function PUT(requestHandler) {
  methodNum = 2;
  header['content-type']="application/x-www-form-urlencoded"
  request('PUT', requestHandler)
}
//DELETE请求
function DELETE(requestHandler) {
  methodNum = 3;
  header['content-type'] = "application/x-www-form-urlencoded"
  request('DELETE', requestHandler)
}
function BarTitle(title){
  wx.setNavigationBarTitle({
    title: title +"--靓号优选"
  })
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  params.__sessid = wx.getStorageSync("token");
  params.__app = "xcx";
  var uri = requestHandler.url;
  wx.request({
    url: API_URL+uri,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header, // 设置请求的 header
    success: function (res) {
      //注意：可以对参数解密等处理
      
      if(res.data.code==3000){
        wx.login({
          success: res => {
            if (res.code) {
              wx.request({
                url: API_URL + 'get_open_id',
                data: { getcode: res.code },
                // header: {},
                method: 'GET',
                dataType: 'json',
                // responseType: 'text',
                success: function (res) {
                  wx.setStorageSync('token', res.data.data.__sessid)
                  wx.setStorageSync('consumer_id', res.data.data.consumer_id)
                  getApp().globalData.header.Cookie = 'JSESSIONID=' + wx.getStorageSync("token");
                  if (methodNum==0){
                    request("GET", requestHandler)
                  } else if (methodNum == 1){
                    request("POST", requestHandler)
                  } else if (methodNum == 2) {
                    request("PUT", requestHandler)
                  } else if (methodNum == 3) {
                    request("DELETE", requestHandler)
                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        });
       
        
      }else{
        requestHandler.success(res)
      }
      // request("GET", requestHandler)

    },
    fail: function (res) {
      requestHandler.fail(res)
    },
    complete:function (res){
      if (requestHandler.complete){
        requestHandler.complete(res)
      }
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
  PUT: PUT,
  DELETE: DELETE,
  BarTitle: BarTitle
}