import { db } from '@/config/firebase.js';

import {
    getDocs,
    getDoc,
    addDoc,
    collection,
    query,
    orderBy,
    limit,
    where,
    and,
    or,
    doc,
    updateDoc,
    auth
} from 'firebase/firestore';
export default {
    namespaced: true,
    state: {
        users: [],
        signInUser: null
    },
    mutations: {
        mAllUser(state, val) {
            state.users = val;
        },
        mSignInUser(state) {


            state.signInUser = `${auth?.currentUser?.uuid}`
        }
    },
    actions: {
        UPDATE_SINGLE_USER({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                const docRef = doc(db, 'Users', payload.id);
                try {
                    const docSnap = updateDoc(docRef, payload.data);

                    resolve(docSnap);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },
        GET_SINGLE_USER_BY_Id({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                debugger
                const docRef = doc(db, 'Users', payload.id);
                try {
                    const docSnap = await getDoc(docRef);

                    resolve({...docSnap.data(), id: docSnap.id });
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },
        GET_SINGLE_USER({ commit }, payload) {

            return new Promise(async(resolve, reject) => {
                const userRef = collection(db, 'Users');

                try {
                    const q = query(
                        userRef,
                        where(`${payload.field}`, '==', `${payload.value}`),

                    );
                    let fetcheData = await getDocs(q);
                    let user = fetcheData.docs[0]

                    debugger
                    if (user) {

                        resolve({...user.data(), id: user.id });
                        return
                    }
                    resolve([])

                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },

        GET_USERS({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                const listOfUsers = collection(db, 'Users');

                try {
                    const q = query(
                        listOfUsers,
                        limit(50),
                        orderBy('is_root', 'desc'),
                        orderBy('created_at', 'desc'),
                        where('status', '==', 1),
                        where('is_root', '!=', true)
                    );
                    let fetcheData = await getDocs(q);
                    let filteredUserObject = fetcheData.docs.map(doc => ({...doc.data(), id: doc.id }));

                    commit('mAllUser', filteredUserObject);

                    resolve(filteredUserObject);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },
        SEARCH_USERS({ commit }, payload) {
            // ;
            return new Promise(async(resolve, reject) => {
                const listOfUsers = collection(db, 'Users');

                try {
                    const q = query(
                        listOfUsers,
                        limit(50),
                        orderBy('f_name', 'asc'),
                        orderBy('created_at', 'desc'),
                        where('status', '==', 1),
                        where('is_root', '==', false),
                        where('f_name', '>=', payload.searchString),
                        where('f_name', '<', payload.searchString + '\uf8ff')
                    );
                    let fetcheData = await getDocs(q);
                    let filteredUserObject = fetcheData.docs.map(doc => ({...doc.data(), id: doc.id }));
                    console.log(filteredUserObject);

                    resolve(filteredUserObject);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },
        CREATE_USER({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                try {
                    const docRef = await addDoc(collection(db, 'Users'), payload.data);
                    resolve(docRef);
                } catch (err) {
                    reject(err);
                }
            });
        }
    },
    getters: {
        allUserGetter(state) {
            return state.users;
        },
        getSignInUser(state) {
            return state.signInUser;
        }
    }
};