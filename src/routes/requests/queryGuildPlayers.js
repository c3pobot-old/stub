'use strict'
const GetGuildId = require('./getGuildId')
const QueryArenaPlayers = require('./queryArenaPlayers')
module.exports = async(opt = {})=>{
  try{
    const guildId = await GetGuildId(opt)
    if(guildId){
      const gObj = await QueryGuild(guildId, false)
      if(gObj?.guild?.member?.length > 0){
        const members = await QueryArenaPlayers(gObj.guild.member, true)
      }
    }
  }catch(e){
    console.error(e)
  }
}
