import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import ecommerceStoreModule from '@/views/apps/e-commerce/eCommerceStoreModule';
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
import users from './users';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app,
        appConfig,
        verticalMenu,
        Users: users,
        'app-ecommerce': ecommerceStoreModule
    },
    strict: process.env.DEV
});