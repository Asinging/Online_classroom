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
    state: {},
    mutations: {},
    actions: {
        GET_SINGLE_USER_BY_Id({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                const docRef = doc(db, 'Users', payload.id);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        resolve({...docSnap.data(), id: docSnap.id });
                    } else {
                        // docSnap.data() will be undefined in this case
                        console.log('No such document!');
                        resolve(false);
                    }
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
                    const q = query(userRef, where(`${payload.field}`, '==', `${payload.value}`));
                    let fetcheData = await getDocs(q);
                    let user = fetcheData.docs[0];

                    if (user) {
                        resolve({...user.data(), id: user.id });
                        return;
                    }
                    resolve([]);
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
        CREATE_TICKET({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                try {
                    let docRef = await addDoc(collection(db, 'Tickets'), payload.data);
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