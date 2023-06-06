export default [
   {
      path: '/all/tickets',
      name: 'app-ticket',
      component: () => import('@/views/apps/upload/Index.vue'),
      meta: {
         resource: 'Auth',
         pageTitle: 'Tickets',
         breadcrumb: [
            {
               text: 'All'
            },
            {
               text: 'Issues'
            }
         ]
      }
   },
   {
      path: '/admin/upload-course',
      name: 'upload-course',
      component: () => import('@/views/apps/upload/Index'),
      meta: {
         resource: 'Auth',
         pageTitle: 'Upload',
         breadcrumb: [
            {
               text: 'Upload'
            },
            {
               text: 'Course material'
            }
         ]
      }
   },
   {
      path: '/admin/list-course',
      name: 'course-list',
      component: () => import('@/views/apps/upload/upload-list/UploadList.vue'),
      meta: {
         resource: 'Auth',
         pageTitle: 'Course',
         breadcrumb: [
            {
               text: 'List'
            },
            {
               text: 'Course material'
            }
         ]
      }
   },
   {
      path: '/admin/watch-course',
      name: 'watch-course',
      component: () => import('@/views/apps/upload/upload-watch/Index.vue'),
      meta: {
         resource: 'Auth',
         pageTitle: 'Course',
         breadcrumb: [
            {
               text: 'Watch'
            },
            {
               text: 'course'
            }
         ]
      }
   },
   //    {
   //       path: '/all/courses',
   //       name: 'courses',
   //       component: () => import('@/views/apps/upload/upload-list/UploadList'),
   //       meta: {
   //          resource: 'Auth',
   //          pageTitle: 'Courses',
   //          breadcrumb: [
   //             {
   //                text: 'All'
   //             },
   //             {
   //                text: 'Course'
   //             }
   //          ]
   //       }
   //    },
   // *===============================================---*
   // *--------- EMAIL & IT'S FILTERS N LABELS -------------------------------*
   // *===============================================---*

   {
      path: '/admin/apps/email',
      name: 'apps-email',
      component: () => import('@/views/apps/email/Email.vue'),
      meta: {
         contentRenderer: 'sidebar-left',
         contentClass: 'email-application'
      }
   },
   {
      path: '/admin/apps/email/:folder',
      name: 'apps-email-folder',
      component: () => import('@/views/apps/email/Email.vue'),
      meta: {
         contentRenderer: 'sidebar-left',
         contentClass: 'email-application',
         navActiveLink: 'apps-email'
      },
      beforeEnter(to, _, next) {
         if ([ 'sent', 'draft', 'starred', 'spam', 'trash' ].includes(to.params.folder)) next();
         else next({ name: 'error-404' });
      }
   },
   {
      path: '/apps/email/label/:label',
      name: 'apps-email-label',
      component: () => import('@/views/apps/email/Email.vue'),
      meta: {
         contentRenderer: 'sidebar-left',
         contentClass: 'email-application',
         navActiveLink: 'apps-email'
      },
      beforeEnter(to, _, next) {
         if ([ 'personal', 'company', 'important', 'private' ].includes(to.params.label)) next();
         else next({ name: 'error-404' });
      }
   },

   // *===============================================---*
   // *--------- USER ---- ---------------------------------------*
   // *===============================================---*

   {
      path: '/admin/apps/users/list',
      name: 'apps-users-list',
      component: () => import('@/views/apps/user/users-list/UsersList.vue'),
      meta: {
         pageTitle: 'Users',
         breadcrumb: [
            {
               text: 'All users'
            },
            {
               text: 'List'
            }
         ]
      }
   },
   {
      path: '/admin/apps/users/view/:id',
      name: 'apps-users-view',
      component: () => import('@/views/apps/user/users-view/UsersView.vue'),

      meta: {
         pageTitle: 'User Overview',
         breadcrumb: [
            {
               text: 'User'
            }
         ]
      }
   },
   {
      path: '/admin/apps/users/edit/:id',
      name: 'apps-users-edit',
      component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
      meta: {
         pageTitle: 'Edit User',
         breadcrumb: [
            {
               text: 'User'
            }
         ]
      }
   }
];
