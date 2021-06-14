import request from '@/utils/request'

export function getBranches() {
  return request({
    url: 'api/branch/getAll',
    method: 'get'
    // params: { token }
  })
}
