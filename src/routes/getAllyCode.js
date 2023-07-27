'use strict'
const QueryArenaPlayer = require('./requests/queryArenaPlayer')
module.exports = async(opt = {})=>{
  try{
    const obj = await QueryArenaPlayer(opt, true)
    if(obj?.allyCode) return +obj.allyCode
  }catch(e){
    console.error(e)
  }
}
