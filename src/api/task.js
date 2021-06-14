import request from '@/utils/request'

export function saveTask(data) {
  return request({
    url: 'api/task',
    method: 'post',
    data
  })
}

export function updateTask(data, id) {
  return request({
    url: 'api/task/' + id,
    method: 'put',
    data
  })
}

export function getAll() {
  return request({
    url: 'api/task/getAll',
    method: 'get'
  })
}
