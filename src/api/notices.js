import request from '@/utils/request'

export function getNotices(api) {
  return request({
    url: `api/notices/getAll?api_key=${api}`,
    method: 'get'
    // params: { token }
  })
}

export function updateNotice(data) {
  return request({
    url: 'api/auth/notices/update',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function saveNotice(data) {
  return request({
    url: 'api/auth/notices',
    method: 'post',
    data
  })
}

export function deleteNotice(id) {
  return request({
    url: 'api/auth/notices/' + id,
    method: 'delete'
  })
}

