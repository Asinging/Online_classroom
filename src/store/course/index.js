import { storage, db } from '@/config/firebase.js';

import { ref, uploadBytes } from 'firebase/storage';
import { writeBatch, addDoc, collection, query, limit, where, orderBy, getDocs } from 'firebase/firestore';
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
         return new Promise(async (resolve, reject) => {
            try {
               const storageRef = ref(storage, `course/coverArt/${payload.image.name + v4()}`);
               let response = await uploadBytes(storageRef, payload.image);

               resolve(response);
            } catch (err) {
               reject(err);
            }
         });
      },
      UPLOAD_VIDEO({ commit }, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               // docRef = await addDoc(collection(db, 'Users'), payload.data);
               const docRef = await addDoc(collection(db, 'courses'), payload.course);

               resolve(docRef);
            } catch (err) {
               reject(err);
            }
         });
      },

      UPLOAD_VIDEOS_CONTENT({ commit }, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               resolve(resp);
            } catch (err) {
               reject(err);
            }
         });
      },

      GET_COURSES({ commit }, payload) {
         return new Promise(async (resolve, reject) => {
            const listOfCourses = collection(db, 'courses');

            try {
               const q = query(listOfCourses, limit(50), orderBy('created_at', 'desc'), where('status', '==', 1));
               let fetcheData = await getDocs(q);
               let filteredUserObject = fetcheData.docs.map(doc => ({ ...doc.data(), id: doc.id }));

               commit('mAllCourses', filteredUserObject);

               resolve(filteredUserObject);
            } catch (err) {
               console.log(err);
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
