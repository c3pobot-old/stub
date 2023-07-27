'use strict'
const { eachLimit } = require('async');
const QueryArenaPlayer = require('./queryArenaPlayer')
const MAX_SYNC = +process.env.MAX_CLIENT_SYNC || 15
module.exports = (players = [], detailsOnly = false)=>{
  return new Promise(async(resolve)=>{
    try{
      let array = []
      eachLimit(players, MAX_SYNC, async(player)=>{
        const obj = await QueryArenaPlayer({allyCode: player.allyCode, playerId: player.playerId}, detailsOnly)
        if(obj?.allyCode) array.push(obj)
      })
      .then(()=>{
        resolve(array)
      })
      .catch((err)=>{
        console.error(err);
        resolve()
      })
    }catch(e){
      console.error(e);
      resolve()
    }
  })
}
