'use strict'
const sorter = require('json-array-sorter')
const QueryPlayer = require('./queryPlayer')

const FormatPlayer = require('./format/formatPlayer')
module.exports = async(payload = {}, opt = {})=>{
  try{
    let collection = opt.collection || 'playerCache'
    let obj = await QueryPlayer(payload)
    if(obj?.rosterUnit?.length >= 0){
      let stats = await HP.CalcRosterStats(obj.rosterUnit, obj.allyCode, true)
      if(stats?.omiCount){
        obj = {...obj,...stats}
        await FormatPlayer(obj)
        if(obj.gp){
          mongo.set(collection, {_id: obj.playerId}, obj)
          return obj
        }
      }
    }
  }catch(e){
    console.error(e?.message)
    console.error('Get Player Error')
  }
}
