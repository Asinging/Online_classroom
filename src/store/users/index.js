import { storage, db } from '@/config/firebase.js';
import { v4 } from 'uuid';
import { ref, uploadBytes, deleteObject } from 'firebase/storage';

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
        users: [],
        signInUser: null,
        singleUser: null
    },
    mutations: {
        mAllUser(state, val) {
            state.users = val;
        },
        mSingleUserById(state, payload) {
            state.singleUser = payload;
        }
    },
    actions: {
        DELETE_PROFILE_UPLOAD({}, payload) {
            return new Promise((resolve, reject) => {
                let objectRef = ref(storage, payload.path);
                deleteObject(objectRef)
                    .then(resp => {
                        console.log(resp);
                        resolve(resp);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
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
                const docRef = doc(db, 'Users', payload.id);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        resolve({...docSnap.data(), id: docSnap.id });
                        commit('mSingleUserById', {...docSnap.data(), id: docSnap.id });
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
        CREATE_USER({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                try {
                    let docRef = null;
                    if (payload.createUserWithEmail) {
                        docRef = await setDoc(doc(db, 'Users', `${payload.data.user_UID}`), payload.data);
                    } else {
                        docRef = await addDoc(collection(db, 'Users'), payload.data);
                    }
                    resolve(docRef);
                } catch (err) {
                    reject(err);
                }
            });
        },
        USER_PROFILE_UPLOAD({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                try {
                    const storageRef = ref(storage, `course/coverArt/${payload.image.name + v4()}`);
                    let response = await uploadBytes(storageRef, payload.image);

                    resolve(response);
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
        },
        singleUserGetter(state) {
            return state.singleUser;
        }
    }
};