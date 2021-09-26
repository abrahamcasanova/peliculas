import request from '@/utils/request'

export function getCustomers() {
  return request({
    url: 'api/customers/getAll',
    method: 'get'
    // params: { token }
  })
}

export function updateCustomer(data) {
  return request({
    url: 'api/customers/' + data.id,
    method: 'put',
    data
  })
}

export function destroyCustomer(id) {
  return request({
    url: 'api/customers/' + id,
    method: 'delete'
  })
}

export function saveCustomer(data) {
  return request({
    url: 'api/customers',
    method: 'post',
    data
  })
}
