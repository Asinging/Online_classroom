export default [
   {
      header: 'HOME | ADMIN'
   },
   {
      title: 'Dashboards',
      icon: 'HomeIcon',
      tag: 'new',
      tagVariant: 'light-warning',
      route: 'dashboard-ecommerce',
      key: 'dashboard'
   },

   {
      title: 'User',
      icon: 'UserIcon',
      key: 'user',
      children: [
         {
            title: 'List',
            route: 'apps-users-list',
            key: 'userList'
         },
         {
            title: 'View',
            route: { name: 'apps-users-view', params: { id: 21 } },
            key: 'userView'
         },
         {
            title: 'Edit',
            route: { name: 'apps-users-edit', params: { id: 21 } },
            key: 'userEdit'
         }
      ]
   },
   {
      title: 'Media',
      icon: 'TvIcon',
      tag: 'updated',
      tagVariant: 'light-warning',
      key: 'media',
      children: [
         {
            title: 'List',
            route: 'course-list',
            icon: 'ListIcon',
            key: 'mediaList'
         },
         {
            title: 'Upload Course',
            route: { name: 'upload-course', params: { newUpload: true, edit: false, id: 1 } },
            icon: 'UploadIcon',
            key: 'mediaUpload'
         },
         {
            title: 'watch',
            route: { name: 'app-view-course', params: { id: 21 } },
            icon: 'VideoIcon',
            key: 'mediaWatch'
         }
      ]
   },

   // {
   //     title: 'Tickets',
   //     icon: 'FileIcon',
   //     tag: '',
   //     tagVariant: 'light-warning',

   //     route: 'app-tickets'
   // },
   {
      title: 'Logout',
      icon: 'LockIcon',
      tag: '',
      tagVariant: 'light-warning',

      route: 'auth-logout'
   }
];
