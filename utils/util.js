const unknownError = '未知错误'
function request(url,data,method = "GET", responseType = "text", showErrorToast = true){
    return new Promise((resolve,reject) => {
      wx.request({
        url: url,
        data: data,
        method: method,
        responseType: responseType,
        success: function(res){
          if(!res){
            if(showErrorToast){
              pxshowErrorToast(unknownError,1500)
            }
            return false;
          }else{
            resolve(res);
          }
        },
        fail: function(error){
          if(showErrorToast){
            pxshowErrorToast('error',1500);
          }
          reject(error);
        }
      })
    })
}

function pxshowErrorToast(text = '',duration = 2000){
  wx.showToast({
    title: text,
    duration : duration,
    icon: 'none'
  })
}


function getwang(num){
  let temp = num.toString().split('');
  temp.splice(temp.length - 3 , 3);
  return temp.slice(0,temp.length - 1).join('') + '.' + temp[temp.length - 1] + '万';
}
function getNumber(num){
  num = num.toString().length > 4 ? getwang(num) : num 
  return num;
}


// 时间转为  00:00;
// 传入时间 一小时内
function timeformat(time,state){
  if(Object.prototype.toString.call(time) != '[object Number]'){
    return false;
  }
  time = time.toFixed(0);
  let minutes = 0;
  let seconds = 0;
  if(time >= 60){
    minutes =  Math.floor((time / 60));
    seconds = (time % 60);
  } else {
    seconds = time
  }
  return `${addzero(minutes)}:${addzero(seconds)}`;
}

function addzero(time){
  return time >= 10 ? time : '0' + time
}
function debounce(fn, wait) {
  let timer;
  return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
          fn.apply(this, arguments)   // 把参数传进去
      }, wait);
  }
}

/**
 * copy,
 */
function copy(data){
  return JSON.parse(JSON.stringify(data));
}
/**
 * 判断 两个数据是否一致,
 * pre: 前一状态数据
 * cur: 当前数据
 */
function equalArray (arr1, arr2, deepCheck) {
  if (arr1 === arr2) {
      return true;
  };
  // 长度不等，不用继续判断
  if (arr1.length !== arr2.length) {
      return false;
  };
  // 浅度检查
  if (!deepCheck) {
      return arr1.toString() === arr2.toString();
  };
  // 判断每个基本数据类型是否一样
  let type1, type2; // 数组每一项的数据类型
  for (let i = 0; i < arr1.length; i++) {
      type1 = type(arr1[i]);
      type2 = type(arr2[i]);

      // 数据类型不一样，无需判断
      if (type1 !== type2) {
          return false;
      };

      if (type1 === "Array") {
          if (!equalArray(arr1[i], arr2[i], true)) {
              return false;
          };
      }else if (type1 === 'Object') {
          if (!equalObject(arr1[i], arr2[i], true)) {
              return false;
          };
      }else if (arr1[i] !== arr2[i]) {
          return false;
      };

  };
  return true;
}

function equalObject (obj1, obj2, deepCheck) {
  if (obj1 === obj2) {
      return true;
  };
  // 属性总数不等，直接返回false
  let size1 = 0;
  for (let key in obj1){
      size1++;
  }
  let size2 = 0;
  for (let key in obj2){
      size2++;
  }
  if (size1 !== size2) {
      return false;
  };
  
  if (!deepCheck) { // 浅度判断
      for (let key in obj1){
          if (obj1[key] !== obj2[key]) {
              return false;
          };
      }
      return true;
  };
  let type1,type2;
  for (let key in obj1){
      type1 = type(obj1[key]);
      type2 = type(obj2[key]);
      if (type1 !== type2) {
          return false;
      };
      if (type1 === "Object") {
          if (!equalObject(obj1[key], obj2[key], true)) {
              return false;
          };
      }else if (type1 === "Array") {
          if (!equalArray(obj1[key], obj2[key],true)) {
              return false;
          };
      }else if (obj1[key] !== obj2[key]) {
          return false;
      };
  }
  return true;

}

function type (data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}

module.exports = {
  request,
  pxshowErrorToast,
  getwang,
  timeformat,
  debounce,
  equalArray
}