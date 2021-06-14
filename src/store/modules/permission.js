import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSIONS: (state, routes) => {
    // state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async generateRoutes({ commit }, data) {
    const routes = []
    if (data.roles.includes('admin')) {
      data.routes = JSON.stringify(asyncRoutes)
    }

    /* if (data.roles.includes('admin')) {
      // const route = JSON.parse(data.routes)
      const _options = asyncRoutes// .concat(route)
      data.routes = JSON.stringify(_options)
    } */

    JSON.parse(data.routes).forEach(function(route) {
      const finded = asyncRoutes.find(element => element.path === route.path)
      if (finded) {
        if (finded.children) {
          const originalChildren = finded.children
          finded.children = []
          const childrens = route.children.map(item => {
            if (item.name && originalChildren.find(element => element.name === item.name)) {
              return originalChildren.find(element => element.name === item.name)
            }
          })
          finded.children = childrens
        }
        routes.push(finded)
      }
    })

    return new Promise(resolve => {
      let accessedRoutes
      if (data.roles.includes('admin')) {
        accessedRoutes = routes || []
      } else {
        accessedRoutes = filterAsyncRoutes(routes, data.roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_PERMISSIONS', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
