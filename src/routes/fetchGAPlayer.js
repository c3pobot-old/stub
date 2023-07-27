'use strict'
const GetPlayer = require('./requests/getPlayer')
module.exports = async(opt = {})=>{
  try{
    let payload = {opponent: +opt.opponent}, opts = {...{collection: 'playerCache'},...opt}
    if(opts.id > 999999){
      payload.allyCode = +opts.id
    }else{
      payload.playerId = opts.id
    }
    let obj = (await mongo.find('gaCache', payload))[0]
    if(!obj){
      if(opt.token) MSG.WebHookMsg(opt.token, {content: 'Pulling new data...'}, 'PATCH')
      delete payload.opponent
      opts.returnPlayers = true
      obj = await GetPlayer(payload, opts)
      if(obj){
        obj.opponent = +opts.opponent
        await mongo.rep('gaCache', {_id: opts.opponent+'-'+obj.playerId}, obj)
      }
    }
    return obj
  }catch(e){
    console.error(e)
  }
}
