'use stric'
const QueryArenaPlayers = require('./requests/queryArenaPlayers')
module.exports = async(opt = {})=>{
  try{
    return await QueryArenaPlayers(opt.players, opt.detailsOnly)
  }catch(e){
    console.error(e);
  }
}
