'use strict'
const fetch = require('node-fetch');
const parseResoponse = require('./parseResoponse')
const SignPostRequest = require('./signPostRequest')
const sleep = (ms = 100)=>{
  return new Promise(resolve=>{
    setTimeout(resolve, ms)
  })
}
const reportRetry = (count, uri, err)=>{
  try{
    let msg = 'Retry '+count+' for '+uri
    if(err?.error) msg += ' : '+err.error+' '+err.type
    if(err?.body?.code) msg += ' : '+err.body.code
    if(err?.body?.message) msg += ' : '+err.body.message
    console.error(msg)
  }catch(e){
    console.error(e);
  }
}
const postRequest = async(uri, payload = {}, identity = null)=>{
  try{
    let headers = {"Content-Type": "application/json"}, method = 'POST', body = { payload: payload }
    if(identity) body.identity = identity
    SignPostRequest('/'+uri, headers, body, method)
    const obj = await fetch(process.env.CLIENT_URL+'/'+uri, {
      headers: headers,
      timeout: 30000,
      method: 'POST',
      body: JSON.stringify(body),
      compress: true
    })
    return await parseResoponse(obj)
  }catch(e){
    if(e.name){
      return {error: e.name, message: e.message, type: e.type}
    }else{
      if(e?.status){
        console.log(e.status)
        return await parseResoponse(e)
      }
      console.error(e)
    }
  }
}
const apiRequest = async(uri, payload = {}, identity = null, count = 0)=>{
  try{
    if(uri){
      const res = await postRequest(uri, payload, identity)
      if((res?.body?.code === 6 && count < 4) || (res?.error === 'FetchError' && count < 4) || (res?.status === 400 && res?.body?.message && !res?.body?.code && count < 4)){
        count++
        //reportRetry(count, uri, payload, res)
        //await sleep()
        return await apiRequest(uri, payload, count)
      }
      return res
    }
  }catch(e){
    console.error(e);
  }
}
module.exports = async(uri, payload = {}, identity = null)=>{
  try{
    let res = await apiRequest(uri, payload, identity)
    if(res?.body?.message && res?.body?.code !== 5) console.error(uri+' : Code : '+res.body.code+' : Msg : '+res.body.message)
    if(res?.body) return res.body
    if(res?.error) console.error(console.log(uri+' : '+res.error+' '+res.type))
  }catch(e){
    console.error(e);
  }
}
