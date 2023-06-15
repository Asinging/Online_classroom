export default [
   {
      path: '/support-team/two-four-seven',
      name: 'support-team',
      component: () => import('@/views/pages/support'),
      meta: {
         pageTitle: 'Contacts',
         breadcrumb: [
            {
               text: 'Support'
            },
            {
               text: 'Team',
               active: true
            }
         ]
      }
   },
   {
      path: '/class/global-online-class',
      name: 'telegram-class',
      component: () => import('@/views/pages/classroom'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read'
      }
   },
   {
      path: '/logout',
      name: 'auth-logout',
      component: () => import('@/views/pages/authentication/Logout.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read'
      }
   },

   {
      path: '/payment-methods',
      name: 'payment',
      component: () => import('@/views/pages/authentication/payment.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read'
      }
   },
   {
      path: '/account-init',
      name: 'auth-init',
      component: () => import('@/views/pages/authentication/init.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read'
      }
   },
   {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read'
      }
   },
   {
      path: '/login',
      name: 'auth-login',
      component: () => import('@/views/pages/authentication/Login.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         redirectIfLoggedIn: true
      }
   },

   {
      path: '/register',
      name: 'auth-register',
      component: () => import('@/views/pages/authentication/Register.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read',
         redirectIfLoggedIn: true
      }
   },

   {
      path: '/forgot-password',
      name: 'auth-forgot-password',
      component: () => import('@/views/pages/authentication/ForgotPassword-v1.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         redirectIfLoggedIn: true
      }
   },
   {
      path: '/pages/authentication/reset-password-v1',
      name: 'auth-reset-password-v1',
      component: () => import('@/views/pages/authentication/ResetPassword-v1.vue'),
      meta: {
         layout: 'full'
      }
   },

   {
      path: '/pages/miscellaneous/coming-soon',
      name: 'misc-coming-soon',
      component: () => import('@/views/pages/miscellaneous/ComingSoon.vue'),
      meta: {
         layout: 'full'
      }
   },
   {
      path: '/pages/miscellaneous/not-authorized',
      name: 'misc-not-authorized',
      component: () => import('@/views/pages/miscellaneous/NotAuthorized.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth'
      }
   },
   {
      path: '/pages/miscellaneous/under-maintenance',
      name: 'misc-under-maintenance',
      component: () => import('@/views/pages/miscellaneous/UnderMaintenance.vue'),
      meta: {
         layout: 'full'
      }
   },
   {
      path: '/pages/miscellaneous/error',
      name: 'misc-error',
      component: () => import('@/views/pages/miscellaneous/Error.vue'),
      meta: {
         layout: 'full'
      }
   }
];
