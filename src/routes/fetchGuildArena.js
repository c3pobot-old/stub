'use strict'
const GetArenaPlayers = require('./requests/getArenaPlayers')
const QueryGuild = require('./requests/queryGuild')
module.exports = async(opt = {})=>{
  try{
    if(opt.guildId){
      const obj = await QueryGuild(opt.guildId)
      if(obj?.guild?.member?.length > 0) return await GetArenaPlayers({players: obj.guild.member})
    }
  }catch(e){
    console.error(e)
  }
}
