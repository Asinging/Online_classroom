import { storage, db } from '@/config/firebase.js';

import { ref, uploadBytes } from 'firebase/storage';
import { writeBatch, addDoc, collection } from 'firebase/firestore';
const batch = writeBatch(db);

import { v4 } from 'uuid';

export default {
   namespaced: true,
   state: {},
   mutations: {},
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
               debugger;
               reject(err);
            }
         });
      }
   },
   getters: {}
};
