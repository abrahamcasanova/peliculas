import request from '@/utils/request'

export function getAllInsurances() {
  return request({
    url: 'api/insurances/getAll',
    method: 'get'
  })
}
