'use strict'
const { eachLimit } = require('async');
const FormatGuild = require('./requests/format/formatGuild')

const GetGuildId = require('./requests/getGuildId')
const QueryGuild = require('./requests/queryGuild')
const FormatPlayer = require('./requests/format/formatPlayer')
const QueryPlayer = require('./requests/queryPlayer')
const MAX_SYNC = +process.env.MAX_CLIENT_SYNC || 15
const GetPlayers = (players = [])=>{
  return new Promise(resolve=>{
    let count = 0
    eachLimit(players, MAX_SYNC, async(player)=>{
      let obj = await QueryPlayer({ playerId: player.playerId, allyCode: player.allyCode })
      if(obj?.rosterUnit?.length >= 0){
        let stats = await HP.CalcRosterStats(obj.rosterUnit, obj.allyCode, true)
        if(stats?.omiCount){
          obj = {...obj,...stats}
          await FormatPlayer(obj)
          if(obj.gp){

            await mongo.set('playerCache', {_id: obj.playerId}, obj)
            count++
          }
        }
      }
      obj = null
    })
    .then(()=>{
      resolve(count)
    })
    .catch(err=>{
      console.error(err)
      resolve()
    })
  })
}
module.exports = async(opt={})=>{
  try{
    let guild, members
    const guildId = await GetGuildId(opt)
    if(guildId){
      guild = await QueryGuild(guildId, true)
      if(guild?.guild?.member?.length > 0) guild = guild.guild
    }
    if(guild?.member?.length > 0){
      const memberCount = await GetPlayers(guild.member)
      if(memberCount == +guild.member.length) members = await mongo.find('playerCache', {guildId: guildId}, { playerId: 1, gp: 1, gpChar: 1, gpShip: 1, zetaCount: 1, sixModCount: 1, omiCount: 1 })
    }
    if(guild?.member?.length > 0 && guild?.member?.length == members?.length){
      await FormatGuild(guild, members)
      await mongo.rep('guildCache', {_id: guildId}, guild)
    }
    guild = null
    members = null
  }catch(e){
    console.error(e);
  }
}
