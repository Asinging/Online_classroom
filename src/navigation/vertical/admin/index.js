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
        title: 'Upload ',
        icon: 'UploadIcon',
        tag: '',
        tagVariant: 'light-warning',

        route: 'courses'
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

        route: 'courses'
    }
];