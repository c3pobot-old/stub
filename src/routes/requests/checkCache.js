'use strict'
module.exports = async(opts = {}, key = {})=>{
  try{
    let obj = (await mongo.find(opts.collection, key, opts.projection))[0]
    return obj
  }catch(e){
    console.error(e);
  }
}
