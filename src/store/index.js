import Vue from 'vue';
import Vuex from 'vuex';

// Modules
// import ecommerceStoreModule from '@/views/apps/e-commerce/eCommerceStoreModule';
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
import users from './users';
import course from './course';
import auth from './auth';
import counter from './counters';
import ticket from './tickets';
import transferPayment from './tickets/transferPayment';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        app,
        appConfig,
        verticalMenu,
        Users: users,
        Course: course,
        Auth: auth,
        Ticket: ticket,
        Counter: counter,
        TransferPayment: transferPayment
            // 'app-ecommerce': ecommerceStoreModule
    },
    strict: process.env.DEV
});