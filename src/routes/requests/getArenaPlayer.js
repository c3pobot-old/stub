'use strict'
const QueryArenaPlayer = require('./queryArenaPlayer')
const FormatArenaPlayer = require('./format/formatArenaPlayer')
module.exports = async(opt = {})=>{
  try{
    const obj = await QueryArenaPlayer(opt)
    if(obj?.allyCode) return await FormatArenaPlayer(obj)
  }catch(e){
    console.error(e)
  }
}
