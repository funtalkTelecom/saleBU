// pages/index/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phones: [
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 },
      { phone: 17001150202, price: 2000, desc: 189 },
      { phone: 17001020202, price: 5000, desc: 189 }
    ],
    lhType:-1,
    yysType:-1,
    searchPhone:"",
    flag:false,
    more:false,
    lianghao:[
      { lable: 'AABB', value: '1' },
      { lable: 'ABAB', value: '2' },
      { lable: 'ABCD', value: '3' },
      { lable: 'AAA*', value: '4' },
      { lable: 'AAAA', value: '5' },
      { lable: 'ABBA', value: '6' },
      { lable: 'AAAB', value: '7' },
      { lable: 'ABBB', value: '8' },
      { lable: 'ABCC', value: '9' },
      { lable: 'ABCB', value: '10' },
      { lable: 'ABCA', value: '11' },
      { lable: 'ABBC', value: '12' },
      ],
    count:4
  },

  selectlh(e){
    var type=e.currentTarget.dataset.type
    this.setData({
      lhType: type
    })
  },
  selectyys(e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      yysType: type
    })
  },
  inputSearch:function(e){
    this.setData({
      searchPhone: e.detail.value
    });
  },
  doSearch:function(){
    // this.setData({
    //   flag:true
    // })
    wx.navigateTo({
      url: "/pages/index/search-result"
    })
  },
  morebut:function(){
    let more =this.data.more;
    more=!more;
    let count;
    if (more){
      count= this.data.lianghao.length
    }else{
      count=4
    }
    this.setData({
      more: more,
      count: count
    })
  }

})