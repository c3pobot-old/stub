'use strict'
const ClientRoutes = require('./routes')
const ProcessAPIRequest = require('./routes/requests/processAPIRequest')
module.exports.post = async(method, opt = {}, identity = null)=>{
  try{
    let tempObj
    if(method){
      if(ClientRoutes[method]){
        return await ClientRoutes[method](opt, identity)
      }else{
        return await ProcessAPIRequest(method, opt, identity)
      }
    }
  }catch(e){
    console.error(e)
  }
}
module.exports.oauth = require('./oauth')
module.exports.Google = require('./google')
