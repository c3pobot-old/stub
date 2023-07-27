'use strict'
module.exports = (obj, method)=>{
  if(obj.response && obj.response.body){
    if(obj.response.body.code != 5){
      if(method) console.log(method+' client error')
      console.log('Error Code : '+obj.response.body.code )
      if(obj.response.body.code != 3) console.log('Error Message : '+obj.response.body.message);
    }
  }else{
    if(method) console.log(method+' client error')
  }
}
