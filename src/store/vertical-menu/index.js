import { $themeConfig } from '@themeConfig';
import adminNavMenuItems from '@/navigation/vertical/admin';
import clientNavMenuItems from '@/navigation/vertical/client';

export default {
   namespaced: true,
   state: {
      isVerticalMenuCollapsed: $themeConfig.layout.menu.isCollapsed,
      adminNavMenuItems: adminNavMenuItems,
      clientNavMenuItems: clientNavMenuItems
   },
   mutations: {
      UPDATE_VERTICAL_MENU_COLLAPSED(state, val) {
         state.isVerticalMenuCollapsed = val;
      }
   },
   actions: {},
   getters: {
      adminAppSideBarMenuListGetter(state, getters, rootState, rootGetters) {
         let currentUserId = rootGetters['Auth/currentUserGetter'].id;
         return state.adminNavMenuItems.map(item => {
            if (item.key === 'user') {
               item.children.map(element => {
                  if (element.key === 'userView') {
                     element.route.params.id = currentUserId;

                     return element;
                  }
                  if (element.key === 'userEdit') {
                     element.route.params.id = currentUserId;
                     return element;
                  }
               });
            }
            return item;
         });
      },
      clientAppSideBarMenuListGetter(state) {
         return state.clientNavMenuItems.map(item => {
            if (item.title === 'Courses') {
               item.tag = '' + ' ' + item.tag;
            }
            return item;
         });
      }
   }
};
