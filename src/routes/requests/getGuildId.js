'use strict'
const ProcessAPIRequest = require('./processAPIRequest')
module.exports = async(opt = {})=>{
  try{
    let guildId = opt.guildId
    if(!guildId){
      if(opt.id > 999999){
        let pObj = await ProcessAPIRequest('player', {allyCode: opt.id.toString()})
        if(pObj.guildId) guildId = pObj.guildId
      }else{
        guildId = opt.id
      }
    }
    return guildId
  }catch(e){
    console.error(e)
  }
}
