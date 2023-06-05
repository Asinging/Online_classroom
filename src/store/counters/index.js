import { db } from '@/config/firebase.js';

import { getCountFromServer, collection, query, where } from 'firebase/firestore';
export default {
    namespaced: true,
    state: {
        adminCounter: 0,
        userCounter: 0,
        subscriberCounter: 0,
        productCounter: 0
    },
    mutations: {
        mUserCount(state, val) {
            state.userCounter = val;
        },
        mAdminCount(state, val) {
            state.adminCounter = val;
        },
        mSubscriberCount(state, val) {
            state.subscriberCounter = val;
        },
        mProductCount(state, val) {
            state.productCounter = val;
        }
    },
    actions: {
        COUNTER({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                console.log();
                try {
                    // const coll = collection(db, `${payload.collection}`);
                    const coll = collection(db, 'Users');
                    // const q = query(coll, where(`${payload.field}`, '==', `${payload.value}`));
                    const q = query(coll, where('user_type', '==', '2'));
                    const snapshot = await getCountFromServer(q);
                    let count = snapshot.data().count;
                    console.log('count: ', count);
                    commit(`${payload.mutationName}`, count);
                    resolve(count);
                } catch (err) {
                    reject(err);
                }
            });
        }
    },
    getters: {
        adminCounterGetter(state) {
            return state.adminCounter;
        },
        userCounterGetter(state) {
            return state.userCounter;
        },
        subscriberCounterGetter(state) {
            return state.subscriberCounter;
        },
        productCounterGetter(state) {
            return state.productCounter;
        }
    }
};