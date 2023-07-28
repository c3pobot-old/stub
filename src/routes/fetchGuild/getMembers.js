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
    let res = [], i = missingMembers.length
    while(i--) res.push(GetPlayer({playerId: missingMembers[i].playerId, allyCode: missingMembers[i].allyCode?.toString()}, { collection: 'playerCache' }))
    await Promise.all(res)
    return res
  }catch(e){
    console.error(e);
  }
}
module.exports = async(guildId, member = [], projection)=>{
  try{
    let foundMemberIds = [], memberIds = member.map(x=>x.playerId)
    let res = await getCachePlayers(memberIds, project)
    if(res?.length === member.length) return members
    if(res?.length > 0 ) foundMemberIds = res.map(x=>x.playerId)
    let missingMembers = member.filter(x=>!foundMemberIds.includes(x.playerId))
    let missing = await getNewPlayers(missingMembers)
    if(missing?.length > 0) res = res.concat(missing)
    if(res?.length === member?.length) return res
  }catch(e){
    console.error(e);
  }
}
