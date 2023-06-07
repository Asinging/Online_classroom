export default [{
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
        children: [{
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
        title: 'Media',
        icon: 'TvIcon',
        tag: 'updated',
        tagVariant: 'light-warning',
        children: [{
                title: 'List',
                route: 'course-list',
                icon: 'ListIcon'
            },
            {
                title: 'Upload Course',
                route: { name: 'upload-course', params: { newUpload: true, edit: false, id: 1 } },
                icon: 'UploadIcon'
            },
            {
                title: 'watch',
                route: { name: 'app-view-course', params: { id: 21 } },
                icon: 'VideoIcon'
            }
        ]
    },

    {
        title: 'Tickets',
        icon: 'FileIcon',
        tag: '',
        tagVariant: 'light-warning',

        route: 'app-tickets'
    },
    {
        title: 'Logout',
        icon: 'LockIcon',
        tag: '',
        tagVariant: 'light-warning',

        route: 'auth-logout'
    }
];