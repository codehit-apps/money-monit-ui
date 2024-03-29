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
  return `${env("VUE_APP_API_URL")}${path}`
}

export const env = function (name) {
  return process.env[name]
}

export const apiHeaders = function(appScope) {
  const headers = new Headers()
  headers.append('x-access-token', authToken())
  headers.append('Content-Type', 'application/json')
  return headers
}

export const pad = function (num) {
  var s = '0000' + num;
  return s.substr(s.length-4);
}

export const dupObj = function (obj) {
  return Object.assign({}, obj)
}