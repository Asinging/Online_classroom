import { db } from '@/config/firebase.js';

import {
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    collection,
    query,
    orderBy,
    limit,
    where,
    doc,
    updateDoc
} from 'firebase/firestore';
export default {
    namespaced: true,
    state: {
        allPayments: null
    },
    mutations: {
        mAllPayments(state, payload) {
            state.allPayments = payload;
        }
    },
    actions: {

        MAKE_TRANSFER({ commit }, payload) {

            return new Promise(async(resolve, reject) => {
                try {
                    let docRef = await addDoc(collection(db, 'Money_Transfers'), payload.data);

                    resolve(docRef);
                } catch (err) {
                    console.log(err)
                    reject(err);
                }
            });
        },

        UPDATE_SINGLE_PAYMENT({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                const docRef = doc(db, 'Money_Transfers', payload.id);
                try {
                    const docSnap = updateDoc(docRef, payload.data);
                    resolve(docSnap);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },
        GET_SINGLE_PAYMENT_BY_Id({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                const docRef = doc(db, 'Money_Transfers', payload.id);
                try {
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        if (docSnap.id === authentication.currentUser.uid) {
                            let obj = docSnap.data();
                            let localData = setLocalstorage(authentication.currentUser, obj);

                            commit('Auth/mCurrentUser', localData, { root: true });
                        }
                        commit('mSingleUserById', {...docSnap.data(), id: docSnap.id });

                        resolve({...docSnap.data(), id: docSnap.id });
                    } else {
                        resolve(false);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        },

        GET_PAYMENTS({ commit }, payload) {

            return new Promise(async(resolve, reject) => {
                const listOfPayment = collection(db, 'Money_Transfers');

                try {
                    const q = query(
                        listOfPayment,
                        limit(50),

                        orderBy('created_at', 'desc'),
                        where('status', '==', 1),

                    );
                    let fetcheData = await getDocs(q);
                    let filteredPaymentObject = fetcheData.docs.map(doc => ({...doc.data(), id: doc.id }));

                    commit('mAllPayments', filteredPaymentObject);

                    resolve(filteredPaymentObject);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },
        SEARCH_PAYMENTS({ commit }, payload) {
            // ;
            return new Promise(async(resolve, reject) => {
                const listOfPayment = collection(db, 'Money_Transfers');

                try {
                    const q = query(
                        listOfPayment,
                        limit(50),
                        orderBy('trans_token', 'asc'),
                        orderBy('created_at', 'desc'),
                        where('status', '==', 1),
                        where('is_root', '==', false),
                        where('trans_token', '>=', payload.searchString),
                        where('trans_token', '<', payload.searchString + '\uf8ff')
                    );
                    let fetcheData = await getDocs(q);
                    let filteredPaymentObject = fetcheData.docs.map(doc => ({...doc.data(), id: doc.id }));

                    resolve(filteredPaymentObject);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },


    },

    getters: {
        allPaymentGetter(state) {
            return state.allPayments || []
        }
    }
};