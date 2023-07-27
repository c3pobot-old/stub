'use strict'
const { eachLimit } = require('async');
const GetArenaPlayer = require('./getArenaPlayer')
const MAX_SYNC = +process.env.MAX_CLIENT_SYNC || 15
module.exports = (payload = { players: [] })=>{
  return new Promise(async(resolve)=>{
    try{
      let array = []
      eachLimit(payload.players, MAX_SYNC, async(player)=>{
        const obj = await GetArenaPlayer({ allyCode: player?.allyCode?.toString(), playerId: player?.playerId })
        if(obj?.allyCode) array.push(obj)
      })
      .then(()=>{
        resolve(array)
      })
      .catch(err=>{
        console.error(err)
        resolve()
      })
    }catch(e){
      console.error(e);
      resolve()
    }
  })
}
