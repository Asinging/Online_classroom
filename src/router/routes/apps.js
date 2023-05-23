export default [
    // *===============================================---*
    // *--------- EMAIL & IT'S FILTERS N LABELS -------------------------------*
    // *===============================================---*
    {
        path: '/admin/apps/email',
        name: 'apps-email',
        component: () =>
            import ('@/views/apps/email/Email.vue'),
        meta: {
            contentRenderer: 'sidebar-left',
            contentClass: 'email-application'
        }
    },
    {
        path: '/admin/apps/email/:folder',
        name: 'apps-email-folder',
        component: () =>
            import ('@/views/apps/email/Email.vue'),
        meta: {
            contentRenderer: 'sidebar-left',
            contentClass: 'email-application',
            navActiveLink: 'apps-email'
        },
        beforeEnter(to, _, next) {
            if (['sent', 'draft', 'starred', 'spam', 'trash'].includes(to.params.folder)) next();
            else next({ name: 'error-404' });
        }
    },
    {
        path: '/apps/email/label/:label',
        name: 'apps-email-label',
        component: () =>
            import ('@/views/apps/email/Email.vue'),
        meta: {
            contentRenderer: 'sidebar-left',
            contentClass: 'email-application',
            navActiveLink: 'apps-email'
        },
        beforeEnter(to, _, next) {
            if (['personal', 'company', 'important', 'private'].includes(to.params.label)) next();
            else next({ name: 'error-404' });
        }
    },

    // *===============================================---*
    // *--------- USER ---- ---------------------------------------*
    // *===============================================---*
    {
        path: '/admin/admin/apps/users/list',
        name: 'apps-users-list',
        component: () =>
            import ('@/views/apps/user/users-list/UsersList.vue')
    },
    {
        path: '/admin/apps/users/view/:id',
        name: 'apps-users-view',
        component: () =>
            import ('@/views/apps/user/users-view/UsersView.vue')
    },
    {
        path: '/admin/apps/users/edit/:id',
        name: 'apps-users-edit',
        component: () =>
            import ('@/views/apps/user/users-edit/UsersEdit.vue')
    }
];