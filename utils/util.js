const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const orderText = status => {
  var statusText;
  if (status==1){
    statusText ="待付款"
  } else if(status == 2 || status == 3){
    statusText = "待发货"
  } else if (status == 4 || status == 5){
    statusText = "待收货"
  } else if (status == 6) {
    statusText = "已完成"
  }

  return statusText;
}

const epSaleGoodFormatTime = epSaleGood => {
  let newTime = new Date().getTime();
  let endTime = epSaleGood.gEndTime;
  let startTime = epSaleGood.gStartTime;
  let date = null;
  if (startTime - newTime > 0) {
    let time = (startTime - newTime) / 1000;
    date = parseIntTime(time);
    date[4] = "即将开始"
  } else if (endTime - newTime > 0) {
    let time = (endTime - newTime) / 1000;
    date = parseIntTime(time);
    date[4] = "拍卖中";
    epSaleGood.gSatus = 2
  } else {//活动已结束，全部设置为'00'
    date = ['00', '00', '00', '00', "已结束"];
    epSaleGood.gSatus = 3
  }
  epSaleGood.date = date;
  return epSaleGood;
}
const activeObjFormatTime = activeObj => {
  let newTime = new Date().getTime();
  let endTime = activeObj.endTime;
  let startTime = activeObj.startTime;
  let date = null;
  if (startTime - newTime > 0) {
    let time = (startTime - newTime) / 1000;
    date = parseIntTime(time);
    date[4] = "即将开始"
  } else if (endTime - newTime > 0) {
    let time = (endTime - newTime) / 1000;
    date = parseIntTime(time);
    date[4] = "拍卖中";
    activeObj.gSatus = 2
  } else {//活动已结束，全部设置为'00'
    date = ['00', '00', '00', '00', "已结束"];
    activeObj.gSatus = 3
  }
  activeObj.date = date;
  return activeObj;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const parseIntTime = time => {
  let day = parseInt(time / (60 * 60 * 24), 10);
  let hou = parseInt(time % (60 * 60 * 24) / 3600, 10);
  let min = parseInt(time % (60 * 60 * 24) % 3600 / 60, 10);
  let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60, 10);
  return [day, hou, min, sec].map(formatNumber);
}
module.exports = {
  activeObjFormatTime: activeObjFormatTime,
  formatTime: formatTime,
  epSaleGoodFormatTime: epSaleGoodFormatTime,
  orderText: orderText
}
