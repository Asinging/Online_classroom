export default [{
        path: '/dashboard',
        name: 'dashboard-analytics',

        component: () =>
            import ('@/views/dashboard/analytics/Analytics.vue')
    },
    {
        path: '/admin/dashboard',
        name: 'dashboard-ecommerce',

        component: () =>
            import ('@/views/dashboard/ecommerce/Ecommerce.vue')
    }
];