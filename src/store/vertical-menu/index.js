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
      adminAppSideBarMenuListGetter(state) {
         return state.adminNavMenuItems;
      },
      clientAppSideBarMenuListGetter(state) {
         return state.clientNavMenuItems.map(item => {
            if (item.title === 'Courses') {
               item.tag = '10';
            }
            return item;
         });
      }
   }
};
