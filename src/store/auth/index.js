import { auth } from '@/config/firebase.js';

import {
   signInWithEmailAndPassword,
   signInWithPopup,
   GoogleAuthProvider,
   createUserWithEmailAndPassword,
   signOut
} from 'firebase/auth';
export default {
   namespaced: true,
   state: {
      currentUser: null
   },
   mutations: {},
   actions: {
      SIGN_UP({}, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               let user = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

               resolve(user);
            } catch (error) {
               console.log(error);
               reject(error);
            }
         });
      },
      SIGN_IN({}, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               let user = await signInWithEmailAndPassword(auth, payload.email, payload.password);

               resolve(user);
            } catch (error) {
               console.log(error);
               reject(error);
            }
         });
      },
      LOG_OUT({}) {
         return new Promise(async (resolve, reject) => {
            try {
               let logoutUser = await signOut(auth);
               console.log(logoutUser);
               resolve(logoutUser);
            } catch (error) {
               console.log(error);
               reject(error);
            }
         });
      },
      SIGN_IN_WITH_GOOGLE({ commit }) {
         return new Promise(async (resolve, reject) => {
            try {
               let provider = new GoogleAuthProvider();
               let response = signInWithPopup(auth, provider);
               resolve(response);
            } catch (err) {
               reject(err);
            }
         });
      }
   },

   getters: {}
};
