import { storage, db } from '@/config/firebase.js';

import { ref, uploadBytes } from 'firebase/storage';
import {
    writeBatch,
    addDoc,
    doc,
    getDoc,
    collection,
    query,
    limit,
    where,
    orderBy,
    getDocs,
    updateDoc
} from 'firebase/firestore';
const batch = writeBatch(db);

import { v4 } from 'uuid';

export default {
    namespaced: true,
    state: {
        allCourses: null
    },
    mutations: {
        mAllCourses(state, payload) {
            state.allCourses = payload;
        }
    },
    actions: {
        UPLOAD_COVER_PICTURE({ commit }, payload) {
            console.log(payload)

            return new Promise(async(resolve, reject) => {
                try {
                    const storageRef = ref(storage, `course/coverArt/${payload.courseId}/${payload.image.name + v4()}`);
                    let response = await uploadBytes(storageRef, payload.image);

                    console.log(response)
                    resolve(response);
                } catch (err) {
                    console.log(err)
                    reject(err);
                }
            });
        },
        UPLOAD_VIDEO({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                try {
                    // docRef = await addDoc(collection(db, 'Users'), payload.data);
                    const docRef = await addDoc(collection(db, 'courses'), payload.course);

                    resolve(docRef);
                } catch (err) {
                    reject(err);
                }
            });
        },

        GET_COURSES({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                const listOfCourses = collection(db, 'courses');

                try {
                    const q = query(
                        listOfCourses,
                        limit(50),
                        orderBy('created_at', 'asc'),
                        where('status', '==', 1),
                        where('intro_video', '==', 0)
                    );
                    let fetcheData = await getDocs(q);
                    let filteredUserObject = fetcheData.docs.map(doc => ({...doc.data(), id: doc.id }));

                    commit('mAllCourses', filteredUserObject);

                    resolve(filteredUserObject);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },
        SEARCH_COURSES({ commit }, payload) {
            // ;
            return new Promise(async(resolve, reject) => {
                const listOfCourses = collection(db, 'courses');

                try {
                    const q = query(
                        listOfCourses,
                        limit(50),
                        orderBy('title', 'asc'),
                        orderBy('created_at', 'desc'),
                        where('status', '==', 1),
                        where('intro_video', '==', 0),
                        where('title', '>=', payload.searchString),
                        where('title', '<', payload.searchString + '\uf8ff')
                    );
                    let fetcheData = await getDocs(q);;
                    let filteredUserObject = fetcheData.docs.map(doc => ({...doc.data(), id: doc.id }));

                    resolve(filteredUserObject);
                } catch (err) {;
                    console.log(err);
                    reject(err);
                }
            });
        },
        // UPDATE_COURSE
        UPDATE_SINGLE_COURSE({ commit }, payload) {

            return new Promise(async(resolve, reject) => {
                const docRef = doc(db, 'courses', payload.id);
                try {
                    const docSnap = updateDoc(docRef, payload.data);

                    resolve(docSnap);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        },

        GET_SINGLE_COURSE_BY_Id({ commit }, payload) {
            return new Promise((resolve, reject) => {
                const docRef = doc(db, 'courses', payload.id);

                getDoc(docRef)
                    .then(docSnap => {
                        if (docSnap.exists()) {
                            resolve({...docSnap.data(), id: docSnap.id });
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            });
        },

        GET_SINGLE_COURSE({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                const courseRef = collection(db, 'courses');
                try {
                    const q = query(courseRef, where(payload.field, '==', payload.value), where('status', '==', 1));

                    let fetcheData = await getDocs(q);

                    if (fetcheData.docs.length) {
                        let course = fetcheData.docs[0];

                        resolve({...course.data(), id: course.id });
                        return;
                    }
                    resolve([]);
                } catch (err) {
                    reject(err);
                }
            });
        }
    },
    getters: {
        allCourseGetter(state) {
            return state.allCourses;
        }
    }
};