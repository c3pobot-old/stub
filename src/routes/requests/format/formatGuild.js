'use strict'
module.exports = async(obj, members = [])=>{
  try{
    obj.updated = Date.now()
    obj.id = obj.profile.id
    obj.name = obj.profile.name
    await HP.CalcGuildStats(obj, members)
  }catch(e){
    console.error(e);
  }
}
