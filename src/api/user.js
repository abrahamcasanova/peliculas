import { filterAsyncRoutes } from '@/store/modules/permission'
import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/api/auth/login',
    withCredentials: false,
    method: 'post',
    data
  })
}

export function getUsers() {
  return request({
    url: 'api/user/getAll',
    method: 'get'
    // params: { token }
  })
}

export function updateUser(data) {
  return request({
    url: 'api/user/' + data.id,
    method: 'put',
    data
  })
}

export function saveUser(data) {
  return request({
    url: 'api/user',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: 'api/user/' + id,
    method: 'delete'
  })
}

export function getInfo(token, id) {
  if (id) {
    return request({
      url: 'api/user/' + id,
      method: 'get'
      // params: { token }
    })
  }
}

export function logout(data) {
  return request({
    url: '/api/auth/logout',
    method: 'get',
    data
  })
}
