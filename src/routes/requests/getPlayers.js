'use strict'
const { eachLimit } = require('async');
const GetPlayer = require('./getPlayer')
const CheckCache = require('./checkCache')
const MAX_SYNC = +process.env.MAX_CLIENT_SYNC || 15
const getCacheKey = (opt = {})=>{
  try{
    if(opt.allyCode) return {allyCode: +opt.allyCode}
    if(opt.playerId) return {playerId: opt.playerId}
  }catch(e){
    console.error(e);
  }
}
const GetPlayerData = async(player = {}, options = {})=>{
  try{
    let pObj
    if(options.getFromCache){
      const cacheKey = await getCacheKey(player)
      if(cacheKey) pObj = await CheckCache({collection: 'playerCache', projection: options.projection}, cacheKey)
    }
    if(!pObj) pObj = await GetPlayer({ playerId: player.playerId, allyCode: player.allyCode }, options)
    return pObj
  }catch(e){
    console.error(e);
  }
}
module.exports = ( players = [], opt = {})=>{
  return new Promise(async(resolve)=>{
    try{
      let array = [], count = 0, opts = {...{collection: 'playerCache', getFromCache: true, returnPlayers: true},...opt}
      eachLimit(players, MAX_SYNC, async(player)=>{
        const obj = await GetPlayerData(player, opts)
        if(obj?.gp) array.push(obj)
      })
      .then(()=>{
        if(opts.returnPlayers){
          resolve(array)
        }else{
          resolve(+(array?.length || 0))
        }
      })
      .catch((err)=>{
        console.error(err)
        resolve()
      })
    }catch(e){
      console.error(e);
      resolve()
    }
  })
}
