export default [{
        header: 'CLIENT'
    },
    {
        title: 'Home',
        icon: 'HomeIcon',
        route: 'welcome',
        key: 'home'
    },
    {
        title: 'Dashboards',
        icon: 'GridIcon',

        tagVariant: 'light-warning',

        route: 'dashboard-analytics'
    },
    {
        title: 'Classroom',
        icon: 'BookIcon',


        route: 'courses-card'
    },

    {
        title: 'Raise Ticket',
        icon: 'ChevronsUpIcon',
        tag: '',

        route: 'app-raise-ticket'
    },
    {
        title: 'Mentorship',
        icon: 'LayersIcon',
        tag: '',

        route: 'telegram-class'
    },
    {
        title: 'Support Team',
        icon: 'ShoppingBagIcon',
        tag: '',

        route: 'support-team'
    },
    {
        title: 'Logout',
        icon: 'LockIcon',
        tag: '',

        route: 'auth-logout'
    }
];