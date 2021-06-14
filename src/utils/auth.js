import Cookies from 'js-cookie'

const TokenKey = 'token'
const IdUser = 'id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setId(id) {
  return Cookies.set(IdUser, id)
}

export function getId() {
  return Cookies.get(IdUser)
}

export function removeId() {
  return Cookies.remove(IdUser)
}
