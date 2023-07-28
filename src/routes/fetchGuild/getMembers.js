'use strict'
const GetPlayer = require('../requests/getPlayer')
const getCachePlayers = async(memberIds = [], project)=>{
  try{
    if(project) project.playerId = 1
    return await mongo.find('playerCache', {_id: { $in: memberIds}}, project)
  }catch(e){
    console.error(e);
  }
}
const getNewPlayers = async(missingMembers = [])=>{
  try{
    let res = [], players = [], i = missingMembers.length
    const getGuildPlayer = async(player = {})=>{
      try{
        let obj = await GetPlayer({playerId: player.playerId, allyCode: player.allyCode?.toString()}, { collection: 'playerCache' })
        if(obj) players.push(obj)
      }catch(e){
        throw(e)
      }
    }
    while(i--) res.push(getGuildPlayer(missingMembers[i]))
    await Promise.all(res)
    return players
  }catch(e){
    console.error(e);
  }
}
module.exports = async(guildId, member = [], projection)=>{
  try{
    let foundMemberIds = [], memberIds = member.map(x=>x.playerId)
    let res = await getCachePlayers(memberIds, projection)
    if(res?.length === member.length) return res
    if(res?.length > 0 ) foundMemberIds = res.map(x=>x.playerId)
    let missingMembers = member.filter(x=>!foundMemberIds.includes(x.playerId))
    let missing = await getNewPlayers(missingMembers)
    if(missing?.length > 0) res = res.concat(missing)
    if(res?.length === member?.length) return res
  }catch(e){
    console.error(e);
  }
}
