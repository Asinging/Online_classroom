export default [
   {
      header: 'HOME | ADMIN'
   },
   {
      title: 'Dashboards',
      icon: 'HomeIcon',
      tag: 'new',
      tagVariant: 'light-warning',
      route: 'dashboard-ecommerce'
   },

   {
      title: 'User',
      icon: 'UserIcon',
      children: [
         {
            title: 'List',
            route: 'apps-users-list'
         },
         {
            title: 'View',
            route: { name: 'apps-users-view', params: { id: 21 } }
         },
         {
            title: 'Edit',
            route: { name: 'apps-users-edit', params: { id: 21 } }
         }
      ]
   },
   {
      title: 'Upload ',
      icon: 'UploadIcon',
      tag: 'updated',
      tagVariant: 'light-warning',
      children: [
         {
            title: 'List',
            route: 'course-list',
            icon: 'TrendingUpIcon'
         },
         {
            title: 'Upload Course',
            route: { name: 'upload-course' },
            icon: 'UploadIcon'
         },
         {
            title: 'watch',
            route: { name: 'watch-course', params: { id: 21 } },
            icon: 'TvIcon'
         }
      ]
   },

   {
      title: 'Tickets',
      icon: 'FileIcon',
      tag: '',
      tagVariant: 'light-warning',

      route: 'courses'
   },
   {
      title: 'Logout',
      icon: 'LockIcon',
      tag: '',
      tagVariant: 'light-warning',

      route: 'auth-logout'
   }
];
