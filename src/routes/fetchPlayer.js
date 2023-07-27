'use strict'
const GetPlayer = require('./requests/getPlayer')
const CheckCache = require('./requests/checkCache')
module.exports = async(opt = {})=>{
  try{
    let opts = {...{collection: 'playerCache'},...opt}
    let obj = await CheckCache(opts, {allyCode: +opt.allyCode})
    if(!obj){
      let payload = {}
      if(opts.allyCode){
        payload.allyCode = +opts.allyCode
      }else{
        if(opts.playerId) payload.playerId = opts.playerId
      }
      opts.returnPlayers = true
      if(opt.token) MSG.WebHookMsg(opts.token, {content: 'Pulling new data...'}, 'PATCH')
      obj = await GetPlayer(payload, opts)
    }
    return obj
  }catch(e){
    console.error(e)
  }
}
