'use strict'
const ProcessAPIRequest = require('./processAPIRequest')
module.exports = async(guildId, includeActivity = false)=>{
  try{
    if(guildId) return await ProcessAPIRequest('guild', {guildId: guildId, includeRecentGuildActivityInfo: includeActivity})
  }catch(e){
    console.error(e)
  }
}
