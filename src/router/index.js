import Vue from 'vue'
import Router from 'vue-router'
// import request from '@/utils/request'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
/*
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
*/

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const asyncRoutes =
[
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock'
    },
    children: [
      /* {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission' }
      },*/
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission'
        }
      }
    ]
  },
  /* {
    path: '/tasks',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    name: 'TasksIndex',
    meta: {
      title: 'task',
      icon: 'mdi mdi-calendar-check-outline'
    },
    children: [
      {
        path: 'new-task',
        component: () => import('@/views/tasks/newTask'),
        name: 'newTask',
        meta: { title: 'newTask', icon: 'mdi mdi-playlist-plus' }
      },
      {
        path: 'index',
        component: () => import('@/views/tasks/tasks'),
        name: 'Task',
        meta: { title: 'taskList', icon: 'mdi mdi-card-text' }
      }
    ]
  },*/
  {
    path: '/users',
    component: Layout,
    meta: { noShowSubMenu: true, title: 'users', icon: 'mdi mdi-account-group', affix: false,
      permissions: [
        'edit-user',
        'delete-user',
        'show-user'
      ]
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/users/users'),
        name: 'List',
        meta: { title: 'users', icon: 'mdi mdi-account-group', affix: false },
        children: [
          {
            path: 'show-user',
            name: 'show-user',
            meta: { title: 'showUser', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'edit-user',
            name: 'edit-user',
            meta: { title: 'editUser', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'delete-user',
            name: 'delete-user',
            meta: { title: 'deleteUser', icon: 'mdi mdi-playlist-plus', type: 'action' }
          }
        ]
      }
    ]
  },
  {
    path: '/customers',
    component: Layout,
    meta: { noShowSubMenu: true, title: 'customers', icon: 'mdi mdi-account-supervisor-circle', affix: false,
      permissions: [
        'edit-customer',
        'delete-customer',
        'show-customer'
      ]
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/customers/customers'),
        name: 'ListCustomer',
        meta: { title: 'customers', icon: 'mdi mdi-account-supervisor-circle', affix: false },
        children: [
          {
            path: 'show-customer',
            name: 'show-customer',
            meta: { title: 'showCustomer', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'edit-customer',
            name: 'edit-customer',
            meta: { title: 'editCustomer', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'delete-customer',
            name: 'delete-customer',
            meta: { title: 'deleteCustomer', icon: 'mdi mdi-playlist-plus', type: 'action' }
          }
        ]
      }
    ]
  },
  {
    path: '/catalogos',
    component: Layout,
    redirect: '/catalogos/page',
    alwaysShow: true, // will always show the root menu
    name: 'Catalogs',
    meta: { title: 'catalogs', icon: 'mdi mdi-folder',
      permissions: [
        'show-movies',
        'edit-movies',
        'delete-movies',
        'show-schedules',
        'edit-schedules',
        'delete-schedules'
      ]
    },
    children: [
      {
        path: 'peliculas',
        component: () => import('@/views/catalogs/movies'),
        name: 'Movies',
        meta: { title: 'Peliculas', icon: 'mdi mdi-filmstrip',
          permissions: [
            'show-movies',
            'edit-movies',
            'delete-movies'
          ]
        },
        children: [
          {
            path: 'show-movies',
            name: 'show-movies',
            meta: { title: 'showPaymentsType', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'edit-movies',
            name: 'edit-movies',
            meta: { title: 'editPaymentsType', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'delete-movies',
            name: 'delete-movies',
            meta: { title: 'deletePaymentsType', icon: 'mdi mdi-playlist-plus', type: 'action' }
          }
        ]
      },
      {
        path: 'turnos',
        component: () => import('@/views/catalogs/schedule'),
        name: 'Turnos',
        meta: { title: 'Turnos', icon: 'mdi mdi-clock-outline',
          permissions: [
            'show-schedules',
            'edit-schedules',
            'delete-schedules'
          ]
        },
        children: [
          {
            path: 'show-schedules',
            name: 'show-schedules',
            meta: { title: 'showSchedule', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'edit-schedules',
            name: 'edit-schedules',
            meta: { title: 'editSchedule', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'delete-schedules',
            name: 'delete-schedules',
            meta: { title: 'deleteSchedule', icon: 'mdi mdi-playlist-plus', type: 'action' }
          }
        ]
      }
    ]
  }
  /* {
    path: '/notices',
    component: Layout,
    meta: { noShowSubMenu: true, title: 'notices', icon: 'mdi mdi-account-group', affix: false,
      permissions: [
        'edit-notice',
        'delete-notice',
        'show-notices'
      ]
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/notices/notices'),
        name: 'Notices',
        meta: { title: 'notices', icon: 'documentation', affix: false },
        children: [
          {
            path: 'show-notice',
            name: 'show-notice',
            meta: { title: 'showNotice', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'edit-notice',
            name: 'edit-notice',
            meta: { title: 'editNotice', icon: 'mdi mdi-playlist-plus', type: 'action' }
          },
          {
            path: 'delete-notice',
            name: 'delete-notice',
            meta: { title: 'deleteNotice', icon: 'mdi mdi-playlist-plus', type: 'action' }
          }
        ]
      }
    ]
  }*/
  /*
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },
  */

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  /*
  chartsRouter,
  //nestedRouter,
  //tableRouter,
  */
  /*
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'mergeHeader' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'pdf', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }

  */
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
