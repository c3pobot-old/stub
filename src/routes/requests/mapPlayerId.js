'use strict'
module.exports = (obj = {})=>{
  try{
    if(obj.allyCode && obj.playerId) reds.set('pId-'+obj.playerId, {playerId: obj.playerId, allyCode: obj.allyCode})
  }catch(e){
    console.error(e);
  }
}
