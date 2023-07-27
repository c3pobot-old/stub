'use strict'
const got = require('got')
const SignPostRequest = require('./signPostRequest')
const postRequest = async(uri, payload = {}, identity = null )=>{
  try{
    if(uri){
      let headers = {}, method = 'POST', body = { payload: payload }
      if(identity) body.identity = identity
      SignPostRequest('/'+uri, headers, body, method)
      return await got(process.env.CLIENT_URL+'/'+uri, {
        headers: headers,
        method: method,
        json: body,
        retry: 0,
        timeout: 30000,
        decompress: true,
        responseType: 'json',
        resolveBodyOnly: true
      })
    }
  }catch(e){
    if(e?.response?.body){
      if(+process.env.DEBUG){
        console.error(uri+' : '+e?.response?.body.code)
        console.error(uri+' : '+e?.response?.body.message)
      }else{
        //if(e?.response?.body.code != 6 && e?.response?.body.code != 5) console.error(uri+' : '+e?.response?.body.message)
        if(e?.response?.body.code != 5) console.error(uri+' : Code : '+e?.response?.body?.code+' : Msg : '+e?.response?.body.message)
      }
      return e?.response?.body
    }else{
      console.error(uri+' : '+e?.message)
    }
  }
}
const apiRequest = async(uri, payload = {}, identity = null, count = 0)=>{
  try{
    if(uri){
      const obj = await postRequest(uri, payload, identity)
      if(obj?.code == 6 && count < 11){
        count++
        return await apiRequest(uri, payload, identity, count)
      }
      return obj
    }
  }catch(e){
    console.error(e);
  }
}
module.exports = apiRequest
