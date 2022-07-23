import { errors } from './error'
import './encrypt'
import { showError, showWarning } from './notifications';
import { getAuthToken, getRefreshToken } from './auth';
import { store } from '../index'
import { setRefreshToken, setAuthToken, logout } from '../modules/authentication/authActions';

export const search = (key) => {
  for (var i = 0; i < errors.length; i++) {
    if (errors[i].key === key) {
      return errors[i].value;
    }
  }
}


export const getTenant = () => {
  if (window.location.origin.includes('localhost')) return 'nhy12'
  return window.location.origin.split('.')[0]
    .replace('http://', '')
    .replace('https://', '')
    .replace(':3000', '')
}

const performRefreshToken = () => {
  const body = {
    accessToken: getAuthToken(),
    refreshToken: getRefreshToken(),
  }

  return callMasterApi('/authsrvc/auth/pub/refreshToken', 'POST', body, true)
  .then(e => {
    if (e.success) {
      const token = e.data.token
      const refreshToken = e.data.refreshToken

      store.dispatch(setRefreshToken(refreshToken))
      store.dispatch(setAuthToken(token))
      window.location.reload()
    } else return Promise.reject('Invalid Auth: HTTP 403')
  })
  .catch(() => {
    store.dispatch(logout())
    document.cookie = `samlOneTimeToken` + "=; Max-Age=0";
    document.cookie = `tenantId` + "=; Max-Age=0";
    localStorage.clear();
    localStorage.setItem('logout',true);
    // showError('Session expired. Please login again')
    window.location = "/#/auth"
  })
}

export async function callApi(endpoint, method = 'get', body, token, hideErrors) {
  const headers = {
    'Accept': 'application/json',
  }

  if (body) headers['content-type'] = 'application/json'
  if(process.env.NODE_ENV === 'development') headers['clientip'] = '0.0.0.0'

  const localToken = token || getAuthToken()
  //  await localStorage.getItem('token')
  headers['Authorization'] = `Bearer ${localToken}`
  // headers['user'] = await localStorage.getItem('user')

  return fetch(endpoint, {
    headers,
    method,
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (response.status === 503) {
          !hideErrors && showError('Server is down: HTTP 503', '503')
        return Promise.reject('Server is down: HTTP 503')
      }

      if (response.status === 403) {
        // attempt to refresh the token here..
        return performRefreshToken()
      }

      if (response.status === 500) {
        return response.json()
        .then(json => {
          if (json && json.errorCode) {
            // add error code mapping over here
            const value = search(json.errorCode);
            const message = value ? value : json.errorCode
              !hideErrors && showError(message, json.errorCode)

          } else  !hideErrors && showError('Internal Server Error: HTTP 500', '500')
          return Promise.reject(json)
        })
      }

      if (response.status === 208) {
          !hideErrors && showError('User status is active. Contact Cymmetri administrator. : HTTP 208', '208')
        return Promise.reject('Active User')
      }

      if (!response.ok) return response.json()
        .then(json => {
          // add error code mapping over here
          const value = search(json.errorCode);
          const message = value ? value : json.errorCode
          if(json.errorCode === 'MFASRVC.QUESTION_NOT_REGISTERED'){
            !hideErrors && showWarning(message, json.errorCode)
          } else if (json.errorCode === 'SSOCONFIGSRVC.SSO_CONFIG_NOT_FOUND'){
            // !hideErrors && showWarning(message, json.errorCode)
            // TODO: Need to be handled from backend
          } else if (json.errorCode === 'SSOCONFIGSRVC.SAML_CONFIG_NOT_FOUND'){
            // !hideErrors && showWarning(message, json.errorCode)
            // TODO: Need to be handled from backend
          } else if (json.errorCode === 'SSOCONFIGSRVC.OPENID_CLIENT_NOT_FOUND'){
            // !hideErrors && showWarning(message, json.errorCode)
            // TODO: Need to be handled from backend
          } else if (json.errorCode === 'SSOCONFIGSRVC.API_CONFIG_NOT_FOUND'){
            // !hideErrors && showWarning(message, json.errorCode)
            // TODO: Need to be handled from backend
          } else if (json.errorCode === 'SSOCONFIGSRVC.NOT_FOUND'){
            // !hideErrors && showWarning(message, json.errorCode)
            // TODO: Need to be handled from backend
          } else {
            !hideErrors && showError(message, json.errorCode)
          }
          return Promise.reject(json)
        })
        .then(json => Promise.reject(json))
      return response.json()
    })
}


export async function callMasterApi(endpoint, method = 'get', body, isRefreshCall = false) {
  const headers = {
    'Accept': 'application/json',
  }

  if (body) headers['content-type'] = 'application/json'

  return fetch(endpoint, {
    headers,
    method,
    body: JSON.stringify(body),
  }).then((response) => {
    // if (response.status === 403) return Promise.reject('')

    if (response.status === 403) {
      // showError('Token could not be verified')
      showError('Token could not be verified','403')
      return(
        localStorage.clear(),
        window.location = "/#/auth"
      )
    }

    if (response.status === 503) {
      showError('Server is down: HTTP 503', '503')
      return Promise.reject('Server is down: HTTP 503')
    }

    if (response.status === 500) {
      return response.json()
      .then(json => {
        if (json && json.errorCode) {
          // add error code mapping over here
          const value = search(json.errorCode);
          const message = value ? value : json.errorCode
          showError(message, json.errorCode)
        } else showError('Internal Server Error: HTTP 500', '500')
        return Promise.reject(json)
      })
    }

    if (response.status === 208) {
      showError('User status is active. Contact Cymmetri administrator. : HTTP 208', '208')
      return Promise.reject('Active User')
    }

    if (!response.ok) return response.json()
      .then(json => {
        // add error code mapping over here
        let errorCode = isRefreshCall ? json.errorCode+'_TOKEN': json.errorCode;
        // const value = search(json.errorCode);
        const value = search(errorCode);
        const message = value ? value : json.errorCode
        showError(message, errorCode)
        return Promise.reject(json)
      })
      .then(json => Promise.reject(json))
    return response.json()
  })
}


export async function callLoginApi(endpoint, method = 'get', body) {
  const headers = {
    'Accept': 'application/json',
    'tenant': getTenant(),
  }

  if (body) headers['content-type'] = 'application/json'
  headers['user'] = await localStorage.getItem('user')

  return fetch(endpoint, {
    headers,
    method,
    body: JSON.stringify(body),
  }).then((response) => {

    if (response.status === 403) return performRefreshToken()

    if (!response.ok) return response.json()
      .then(json => {
        const value = search(json.errorCode);
        const message = value ? value : json.errorCode
        showError(message, json.errorCode)
        return json
      })
      .then(json => Promise.reject(json))
    return response.json()
  })
}

export async function callFileApi(endpoint, method, body) {
  const formData = new FormData()
  formData.append('file', body)

  return fetch(endpoint, {
    headers: {
      'content-type': 'multipart/form-data',
      // Authorization: `Bearer ${token}`,
    },
    method,
    body: formData,
  }).then((response) => {
    if (!response.ok) return response.json().then(json => Promise.reject(json))
    return response.json()
  })
}

export async function callAppImageApi(endpoint, method, body) {
  const formData = new FormData()
  formData.append('multipartFile', body)
  const localToken = getAuthToken()
  return fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${localToken}`,
    },
    method,
    body: formData,
  }).then((response) => {
    if (!response.ok) return response.json().then(json => Promise.reject(json))
    return response.json()
  })
}

export async function callImageApi(appId) {
  return new Promise((resolve, reject) => {
    const key = `appImage:${appId}`

    // check the cache
    if (localStorage.getItem(key)) {
      try {
        const item = JSON.parse(localStorage.getItem(key))
        // 1 day cache
        if ((Number(item.date) + (86400 * 1000)) > Date.now()) return resolve(item.image)
      } catch (error) {
        // ignore any other error
      }
    }

    return callApi(`/provsrvc/applicationTenant/getApp/icon/${appId}`, 'GET')
      .then(e => {
        if (e.success && e.data && e.data.icon && e.data.icon.data) {
          const image = e.data.icon.data
          localStorage.setItem(key, JSON.stringify({ date: Date.now(), image }))
          return resolve(image)
        }

        localStorage.setItem(key, JSON.stringify({ date: Date.now(), image: null }))
        return resolve(null)
      })
      .catch(reject)
  })
    .then(icon => {
      const img = icon ? `data:image/jpeg;base64,${icon}` : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNi42NiA0LjUybDIuODMgMi44My0yLjgzIDIuODMtMi44My0yLjgzIDIuODMtMi44M005IDV2NEg1VjVoNG0xMCAxMHY0aC00di00aDRNOSAxNXY0SDV2LTRoNG03LjY2LTEzLjMxTDExIDcuMzQgMTYuNjYgMTNsNS42Ni01LjY2LTUuNjYtNS42NXpNMTEgM0gzdjhoOFYzem0xMCAxMGgtOHY4aDh2LTh6bS0xMCAwSDN2OGg4di04eiIvPjwvc3ZnPg=='
      return img
    })
}

export async function callMasterImageApi(appId) {
  return new Promise((resolve, reject) => {
    const key = `appImage:${appId}`

    return callApi(`/provsrvc/applicationMaster/getApp/icon/${appId}`, 'GET')
      .then(e => {
        if (e.success && e.data && e.data.icon && e.data.icon.data) {
          const image = e.data.icon.data
          localStorage.setItem(key, JSON.stringify({ date: Date.now(), image }))
          return resolve(image)
        }

        localStorage.setItem(key, JSON.stringify({ date: Date.now(), image: null }))
        return resolve(null)
      })
      .catch(reject)
  })
    .then(icon => {
      const img = icon ? `data:image/jpeg;base64,${icon}` : 'data:image/png;base64,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'
      return img
    })
}
