import request from '@/utils/request'

export function getMovieSchedule() {
  return request({
    url: 'api/movies-schedules',
    method: 'get'
    // params: { token }
  })
}

export function saveMovieSchedule(data) {
  return request({
    url: 'api/movies-schedules',
    method: 'post',
    data
  })
}

export function updateMovieSchedule(data, id) {
  return request({
    url: 'api/movies-schedules/' + id,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function deleteMovieSchedule(id) {
  return request({
    url: 'api/movies-schedules/' + id,
    method: 'delete'
  })
}
