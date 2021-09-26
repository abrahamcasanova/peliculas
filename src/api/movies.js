import request from '@/utils/request'

export function getMovies() {
  return request({
    url: 'api/movies',
    method: 'get'
    // params: { token }
  })
}

export function saveMovie(data) {
  return request({
    url: 'api/movies',
    method: 'post',
    data
  })
}

export function updateMovie(data, id) {
  return request({
    url: 'api/movies/' + id,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function deleteMovie(id) {
  return request({
    url: 'api/movies/' + id,
    method: 'delete'
  })
}
