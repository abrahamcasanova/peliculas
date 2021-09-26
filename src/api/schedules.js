import request from '@/utils/request'

export function getSchedule() {
  return request({
    url: 'api/schedules',
    method: 'get'
    // params: { token }
  })
}

export function saveSchedule(data) {
  return request({
    url: 'api/schedules',
    method: 'post',
    data
  })
}

export function updateSchedule(data, id) {
  return request({
    url: 'api/schedules/' + id,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function deleteSchedule(id) {
  return request({
    url: 'api/schedules/' + id,
    method: 'delete'
  })
}
