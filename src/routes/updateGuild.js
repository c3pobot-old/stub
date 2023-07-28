'use strict'
const { eachLimit } = require('async');
const FormatGuild = require('./requests/format/formatGuild')

const GetGuildId = require('./requests/getGuildId')
const QueryGuild = require('./requests/queryGuild')
const FormatPlayer = require('./requests/format/formatPlayer')
const QueryPlayer = require('./requests/queryPlayer')
const MAX_SYNC = +process.env.MAX_CLIENT_SYNC || 15
const GetPlayer = async(player = {})=>{
  try{
    let obj = await QueryPlayer({playerId: player.playerId})
    if(obj?.rosterUnit?.length >= 0){
      let stats = HP.CalcRosterStats(obj.rosterUnit, obj.allyCode, true)
      if(stats?.omiCount){
        obj = {...obj,...stats}
        await FormatPlayer(obj)
        if(obj.gp){
          mongo.set('playerCache', {_id: obj.playerId}, obj)
          return obj
        }
      }
    }
  }catch(e){
    throw(e)
  }
}
const GetPlayers = async(players = [])=>{
  try{
    let res = [], i = players.length
    while(i--) res.push(GetPlayer(players[i]))
    await Promise.all(res)
    return res
  }catch(e){
    throw(e)
  }
}
module.exports = async(opt={})=>{
  try{
    let guild, members = []
    let guildId = await GetGuildId(opt)
    if(guildId){
      guild = await QueryGuild(guildId, true)
      if(guild?.guild?.member?.length > 0){
        guild = guild.guild
        guild.member = guild.member?.filter(x=>x.memberLevel > 0)
      }
    }
    if(guild?.member?.length > 0) members = await GetPlayers(guild.member)
    if(guild?.member?.length > 0 && guild?.member?.length == members?.length){
      await FormatGuild(guild, members)
      mongo.rep('guildCache', {_id: guildId}, guild)
    }
    guild = null
    members = null
  }catch(e){
    console.error(e);
  }
}
