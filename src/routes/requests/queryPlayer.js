'use strict'
const ProcessAPIRequest = require('./processAPIRequest')
module.exports = async(obj = {})=>{
  try{
    const payload = { allyCode: obj.allyCode?.toString(), playerId: obj.playerId }
    if(payload.playerId) delete payload.allyCode
    if(payload.allyCode || payload.playerId) return await ProcessAPIRequest('player', payload)
  }catch(e){
    console.error(e)
  }
}
