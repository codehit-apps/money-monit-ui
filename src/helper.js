import TxnManager from './txn_manager'

export const hashify = function (s) {
  for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
      h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
  return (h ^ h >>> 16) >>> 0;
}

export const tokenKey = function () {
  return hashify(navigator.userAgent)
}

export const isAuthenticated = function () {
  const token = authToken()
  return token != null && (new String(token)).trim() != ""
}

export const markAuthenticated = function (token) {
  localStorage.setItem(tokenKey(), token)
}

export const logout = function () {
  localStorage.removeItem(tokenKey())
}

export const authToken = function () {
  return localStorage.getItem(tokenKey())
}

export const pesoFormatter = function () {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
}

export const dateFormatter = function () {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'short', day: 'numeric' })
}

export const txnManager = new TxnManager()

export const api = function (path) {
  return `${env("VUE_APP_API_URL")}/api${path}`
}

export const env = function (name) {
  return process.env[name]
}

export const apiHeaders = function(appScope) {
  const headers = new Headers()
  headers.append(env("VUE_APP_API_ID_HEADER"), env("VUE_APP_API_ID_VALUE"))
  if (appScope != null) {
    headers.append(env("VUE_APP_API_SCOPE_HEADER"), env(`VUE_APP_${appScope}_API_SCOPE_VALUE`))
  }
  headers.append('x-codehit-client-domain',env("VUE_APP_API_CLIENT_DOMAIN_VALUE") )
  headers.append('x-codehit-auth-token', authToken())
  headers.append('Content-Type', 'application/json')
  return headers
}
