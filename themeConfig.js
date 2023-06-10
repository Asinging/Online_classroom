// Theme Colors
// Initially this will be blank. Later on when app is initialized we will assign bootstrap colors to this from CSS variables.
export const $themeColors = {};

// App Breakpoints
// Initially this will be blank. Later on when app is initialized we will assign bootstrap breakpoints to this object from CSS variables.
export const $themeBreakpoints = {};

const isAdminIn = JSON.parse(localStorage.getItem('isAdminIn') || 'false');

// APP CONFIG
export const $themeConfig = {
   app: {
      appName: 'Wealth Think', // Will update name in navigation menu (Branding)
      // eslint-disable-next-line global-require
      appLogoImage: require('@/assets/images/logo/logo.svg') // Will update logo in navigation menu (Branding)
   },
   layout: {
      isRTL: false,
      skin: isAdminIn ? 'semi-dark' : 'light', // light, dark, bordered, semi-dark
      // skin: 'semi-dark', // light, dark, bordered, semi-dark
      routerTransition: 'zoom-fade', // zoom-fade, slide-fade, fade-bottom, fade, zoom-out, none
      type: 'vertical', // vertical, horizontal
      contentWidth: 'full', // full, boxed
      menu: {
         hidden: false,
         isCollapsed: false
      },
      navbar: {
         // ? For horizontal menu, navbar type will work for navMenu type
         type: isAdminIn ? 'sticky' : 'floating', // static , sticky , floating, hidden
         backgroundColor: isAdminIn ? 'dark' : 'primary' // BS color options [primary, success, etc]
      },
      footer: {
         type: isAdminIn ? 'sticky' : 'static' // static, sticky, hidden
      },
      customizer: false,
      enableScrollToTop: true
   }
};
