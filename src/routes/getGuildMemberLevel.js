'use strict'
const ProcessAPIRequest = require('./requests/processAPIRequest')
module.exports = async({allyCode, playerId})=>{
  try{
    let res = 0, guildId, pObj, guild, pId = playerId
    if(!pId){
      pObj = (await mongo.find('playerCache', playerId ? {_id: playerId}:{allyCode: allyCode}))[0]
      if(!pObj) pObj = await ProcessAPIRequest('player', {allyCode: allyCode?.toString()})
      if(pObj?.playerId) pId = pObj.playerId
      if(pObj?.guildId) guildId = pObj.guildId
    }
    if(!guildId && !pObj){
      let pObj = await ProcessAPIRequest('player', {allyCode: allyCode?.toString(), playerId: pId})
      if(pObj.guildId){
        guildId = pObj.guildId
        pId = pObj.playerId
      }
    }
    if(guildId && pId){
      guild = (await mongo.find('guildCache', {_id: guildId}))[0]
      if(!guild){
        const tempGuild = await ProcessAPIRequest('guild', {guildId: guildId, includeRecentGuildActivityInfo: false})
        if(tempGuild?.guild) guild = tempGuild.guild
      }
    }
    if(guild?.member && pId){
      let member = guild.member.find(x=>x.playerId === pId)
      if(member) res = +member.memberLevel
    }
    return {level: res}
  }catch(e){
    console.error(e);
  }
}
