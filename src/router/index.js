import Vue from 'vue';
import VueRouter from 'vue-router';

// Routes
import { canNavigate } from '@/libs/acl/routeProtection';
import { isUserLoggedIn, getUserData, getHomeRouteForLoggedInUser } from '@/auth/utils';
import apps from './routes/apps';
import dashboard from './routes/dashboard';

import pages from './routes/pages';

import others from './routes/others';

import store from '@/store';

Vue.use(VueRouter);
let isAdmin = JSON.parse(localStorage.getItem('isAdminIn') || 'false');
// let isAdmin = store.getters['appConfig/whoIsinGetter'];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   scrollBehavior() {
      return { x: 0, y: 0 };
   },
   routes: [
      {
         path: '/',
         redirect: {
            name: isAdmin ? 'dashboard-ecommerce' : 'dashboard-analytics'
         }
      },
      ...apps,
      ...dashboard,
      ...pages,

      ...others,
      {
         path: '*',
         redirect: 'error-404'
      }
   ]
});
router.beforeEach((to, _, next) => {
   let isAdmin = store.getters['appConfig/whoIsinGetter'];
   let userData = JSON.parse(localStorage.getItem('userData') || 'false');

   if (_.path !== '/login' && !userData && to.path !== '/login') {
      return next('/login');
   }
   if (to.path === '/') {
      return next({
         name: isAdmin ? 'dashboard-ecommerce' : 'dashboard-analytics'
      });
   }

   next();
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
   // Remove initial loading
   const appLoading = document.getElementById('loading-bg');
   if (appLoading) {
      appLoading.style.display = 'none';
   }
});

export default router;
