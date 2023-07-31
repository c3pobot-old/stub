'use strict'
const ProcessAPIRequest = require('./routes/requests/processAPIRequest')
const Google = require('./google')
const CodeAuth = require('./codeAuth')
const reAuthCodes = {
  4: 'SESSIONEXPIRED',
  5: 'AUTHFAILED',
  11: 'UNAUTHORIZED',
  51: 'FORCECLIENTRESTART',
  55: 'PRIORITYFORCECLIENTRESTART'
}
const GetGoogleAuth = async(uid, accessToken)=>{
  try{
    return await ProcessAPIRequest('authGoogle', {oauthToken: accessToken, guestId: uid})
  }catch(e){
    console.error(e)
  }
}
const GetGuestAuth = async(uid)=>{
  try{
    return await ProcessAPIRequest('authGuest', { uid: uid})
  }catch(e){
    console.error(e)
  }
}
const GetAuthObj = async (uid, obj = {}) => {
  if(obj.authId && obj.authToken && obj.authToken !== '' && uid){
    const tempObj = {
      auth: {
        authId: obj.authId,
        authToken: obj.authToken,
      },
      deviceId: uid,
      androidId: uid,
      platform: 'Android'
    }
    await mongo.set('identity', {_id: uid}, tempObj)
    return tempObj
  }else{
    return(obj)
  }
}
const GetIdentity = async (uid, type, newIdentity = false) => {
  let obj, auth, ssaid
  if (newIdentity) {
    if(type == 'google'){
      const accessToken = await Google.GetAccessToken(uid);
      if (accessToken){
        if(accessToken?.error){
          return accessToken
        }else{
          auth = await GetGoogleAuth(uid, accessToken);
        }
      }
    }
    if(type == 'facebook'){
      const encrypted_ssaid = (await mongo.find('facebook', {_id: uid}))[0]
      if(encrypted_ssaid) ssaid = await Google.Decrypt(encrypted_ssaid.ssaid)
      if(ssaid){
        auth = await GetGuestAuth(ssaid)
      }else{
        console.log('FB credenitals lost for '+uid)
      }
    }
    if(type == 'codeAuth'){
      if(uid) auth = await CodeAuth(uid)
    }
  } else {
    const tempAuth = (await mongo.find('identity', {_id: uid}, {_id:0, TTL: 0}))[0]
    if(tempAuth?.auth?.authId && tempAuth?.auth?.authToken) auth = tempAuth?.auth
  };
  return await GetAuthObj(uid, auth)
}
module.exports = async(obj, method, dObj, payload, loginConfirmed = null)=>{
  try{

    let data, status = 'ok', forceNewIdentity = false, msg2send = 'Using this command will temporarly log you out of the game on your device.\n Are you sure you want to do this?'
    if(loginConfirmed === 'no'){
      return {msg2send: 'Command Canceled'}
    }
    if(loginConfirmed === 'yes'){
      forceNewIdentity =  true
      loginConfirmed = 'no'
    }

    let identity = await GetIdentity(dObj.uId, dObj.type, forceNewIdentity)
    if(identity?.error) return ({status: 'error', error: 'invalid_grant'})
    if(identity?.description) return({status: 'error', error: identity?.description})
    if(identity?.auth?.authId && identity?.auth?.authToken) data = await ProcessAPIRequest(method, payload, identity)
    if((!data || (data?.code && reAuthCodes[data?.code])) && loginConfirmed != 'no'){
      await HP.ConfirmButton(obj, msg2send)
      return
    }
    if(data){
      if(data.code){
        return ({status: status, error: data})
      }else{
        return ({status: status, data: data})
      }
    }
  }catch(e){
    console.error(e)
  }
}
