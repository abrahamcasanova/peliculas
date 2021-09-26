import store from '@/store'
// import { asyncRoutes } from '@/router'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkSpecificPermission(value) {
  // console.log(_permissions)
  if (value) {
    var roles = store.getters && store.getters.userRoutes
    if (!roles) { roles = JSON.parse(localStorage.getItem('routes')) }
    if (!roles) { return false }

    const permissionRoles = value
    const onlyPermissions = roles.filter(element => element.meta && element.meta.permissions)
    let hasPermission = onlyPermissions.some(role => {
      return role.meta.permissions.includes(permissionRoles)
    })
    // second check
    if (!hasPermission) {
      onlyPermissions.some(role => {
        role.children.forEach(function(children) {
          if (children.meta && children.meta.permissions) {
            hasPermission = children.meta.permissions.includes(permissionRoles)
            return hasPermission
          } else {
            return false
          }
        })
      })
    }
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor'] custom...."`)
    return false
  }
}
