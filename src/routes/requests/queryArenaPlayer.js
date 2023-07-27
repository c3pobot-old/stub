'use strict'
const ProcessAPIRequest = require('./processAPIRequest')
module.exports = async(opt = {}, detailsOnly = false)=>{
  try{
    const payload = { playerDetailsOnly: detailsOnly, allyCode: opt.allyCode?.toString(), playerId: opt.playerId }
    if(payload.playerId) delete payload.allyCode
    if(payload.allyCode || payload.playerId) return await ProcessAPIRequest('playerArena', payload)
  }catch(e){
    console.error(e)
  }
}
