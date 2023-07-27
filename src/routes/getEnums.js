'use strict'
const got = require('got')
module.exports = async()=>{
  try{
    return await got(process.env.CLIENT_URL+'/enums', {
      method: 'GET',
      decompress: true,
      responseType: 'json',
      resolveBodyOnly: true
    })
  }catch(e){
    console.error(e);
  }
}
