'use strict'
const GetMissingMembers = require('./getMissingMembers')
module.exports = async(guildId, collection, member = [], projection = {})=>{
  try{
    let members = await mongo.find(collection, {guildId: guildId}, projection)
    //console.log('found '+members?.length+' for '+guildId+' in '+collection)
    if(members?.length === member?.length) return members
    //console.log(guildId+' is missing '+(member?.length - members?.length)+' members')
    await GetMissingMembers(guildId, collection, member, members, projection)
    //console.log('pulled members for '+guildId)
    let newMembers = await mongo.find(collection, {guildId: guildId}, projection)
    //console.log('Now I found '+newMembers?.length+' for '+guildId+' in '+collection)
    if(newMembers?.length === member?.length) return newMembers
  }catch(e){
    console.error(e);
  }
}
