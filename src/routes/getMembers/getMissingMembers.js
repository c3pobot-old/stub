'use strict'
const GetPlayer = require('../requests/getPlayer')
const { eachLimit } = require('async')
const MAX_SYNC = +process.env.MAX_CLIENT_SYNC || 15
module.exports = async(guildId, collection, member = [], foundMembers = [], projection = {})=>{
  try{
    if(member?.length > 0){
      let count = 0
      const foundIds = foundMembers?.map(x=>x.playerId)
      const missingMembers = member.filter(x=>!foundIds.includes(x.playerId))
      if(missingMembers?.length > 0){
        await eachLimit(missingMembers, MAX_SYNC, async(player)=>{
          await GetPlayer({playerId: player?.playerId, allyCode: player?.allyCode}, {returnPlayers: false, collection: collection})
        })
      }
    }
  }catch(e){
    console.error(e);
  }
}
