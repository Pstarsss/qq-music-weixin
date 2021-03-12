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
  var temp = num.toString().split('');
  temp.splice(temp.length - 3 , 3);
  return temp.slice(0,temp.length - 1).join('') + '.' + temp[temp.length - 1] + '万';
}
function getNumber(num){
  num = num.toString().length > 4 ? getwang(num) : num 
  return num;
}

module.exports = {
  request,
  pxshowErrorToast,
  getwang
}