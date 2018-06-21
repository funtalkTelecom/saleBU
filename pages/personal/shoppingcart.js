// pages/personal/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carttype: 'hm',
    products: [{
      id: 1, amount: 1, price: 200, select: true, type: 1
    }, {
        id: 2, amount: 1, price: 300, select: true, type: 1
    }, {
      id: 3, amount: 9, price: 2000, select: true, type: 2
    }, {
      id: 4, amount: 500, price: 10, select: true, type: 2
    }],
    hmCart: [],
    bkCart: [],
    totalmoney:0,
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
    this.getTotalMoney(this.data.hmCart);
  },

  nav: function (e) { //nav切换
    let carttype = e.currentTarget.dataset.type;
    if (carttype=='hm'){
      this.getTotalMoney(this.data.hmCart)
    } else if (carttype == 'bk'){
      this.getTotalMoney(this.data.bkCart)
    }
    this.setData({
      carttype: carttype
    })
  },
  topay: function () {  //去下单
    if(this.data.totalmoney!=0){
      wx.navigateTo({
        url: 'payorder',
      })
    }else {
      wx.showModal({
        content: '请勾选需要结算的商品',
        showCancel: false,
      });
    }
    
  },
  select: function (e) {  //单选
    const index = e.currentTarget.dataset.index;//角标
    let type = this.data.carttype//类型
    if (type == 'hm') {
      var hmCart=this.data.hmCart;
      hmCart[index].select = !hmCart[index].select;
      var flag=this.forCartSelect(hmCart);
      this.getTotalMoney(hmCart);
      this.setData({
        hmCart: hmCart,
        selectAllHMState: flag
      })
    } else if (type = 'bk') {
      var bkCart = this.data.bkCart;
      bkCart[index].select = !bkCart[index].select;
      var flag = this.forCartSelect(bkCart);
      this.getTotalMoney(bkCart);
      this.setData({
        bkCart: bkCart,
        selectAllBKState: flag
      })
    }

  },
  jia: function (e) { //加
    const index = e.currentTarget.dataset.index;
    let bkCart = this.data.bkCart;
    let amount = bkCart[index].amount;
    amount++;
    bkCart[index].amount = amount;
    this.getTotalMoney(bkCart);
    this.setData({
      bkCart: bkCart
    })
  },
  jian: function (e) { //减
    const index = e.currentTarget.dataset.index;
    let bkCart = this.data.bkCart;
    let amount = bkCart[index].amount;
    if (amount > 1) {
      amount--
    }
    bkCart[index].amount = amount;
    this.getTotalMoney(bkCart);
    this.setData({
      bkCart: bkCart
    })

  },
  sureDel: function (e) { //长按删除提示框
    var page = this;
    wx.showModal({
      content: '确定删除该商品？',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        //点了删除，正真的删除
        if (res.confirm) {
          let index= e.currentTarget.dataset.index;
          let type = page.data.carttype;
          if (type == "hm") {
            let hmCart = page.data.hmCart;
            hmCart.splice(index, 1);
            page.getTotalMoney(hmCart);
            var flag = page.forCartSelect(hmCart);
            page.setData({
              hmCart:hmCart,
              selectAllHMState:flag
            })
          } else if (type == "bk") {
            let bkCart = page.data.bkCart;
            bkCart.splice(index, 1);
            page.getTotalMoney(bkCart);
            var flag = page.forCartSelect(bkCart);
            page.setData({
              bkCart: bkCart,
              selectAllBKState: flag
            })
          }
        } 
      }
    });
  },
  getTotalMoney:function(arr){//获取总价格
    let totalHM = 0;
    arr.forEach(function (item) {
      if (item.select) {
         totalHM += item.price * item.amount
      }
    })
    this.setData({
      totalmoney: totalHM
    })
  },
  init: function () {//数据初始化
    let products = this.data.products;
    let hmCart = products.filter(function (e) { return e.type == 1 })
    let bkCart = products.filter(function (e) { return e.type == 2 })
    var hmflag=this.forCartSelect(hmCart);
    var bkflag=this.forCartSelect(bkCart);
    this.setData({
      hmCart: hmCart,
      bkCart: bkCart,
      selectAllHMState: hmflag,
      selectAllBKState: bkflag
    })
  },
  selsctAll: function () { //全选和全取消
    let type = this.data.carttype;
    if (type == "hm") {
      let selectAllHMState = this.data.selectAllHMState;
      selectAllHMState = !selectAllHMState;
      this.data.hmCart.forEach(e => { e.select = selectAllHMState})
      this.getTotalMoney(this.data.hmCart);
      this.setData({
        selectAllHMState: selectAllHMState,
        hmCart: this.data.hmCart
      })
    } else if (type == "bk") {
      let selectAllBKState = this.data.selectAllBKState;
      selectAllBKState = !selectAllBKState;
      this.data.bkCart.forEach(e => { e.select = selectAllBKState })
      this.getTotalMoney(this.data.bkCart);
      this.setData({
        selectAllBKState: selectAllBKState,
        bkCart: this.data.bkCart
      })
    } 
  },
  inputNum:function(e){ //输入框选数量
    let index=e.currentTarget.dataset.index;
    let amount = e.detail.value;
    let bkCart=this.data.bkCart;
    bkCart[index].amount = amount;
    this.getTotalMoney(bkCart);
  },
  forCartSelect:function(arr){ //判断是否全选
    var flag = true;
    if(arr.length==0){
      return false;
    }
    for (var i = 0; i < arr.length; i++) {
      if (!arr[i].select) {
        flag = false;
        break
      }
    }
    return flag;
  }
})