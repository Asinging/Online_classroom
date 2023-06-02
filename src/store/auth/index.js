import { authentication } from '@/config/firebase.js';

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
            //    try {
            //       let user = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

            //       resolve(user);
            //    } catch (error) {
            //       console.log(error);
            //       reject(error);
            //    }

            createUserWithEmailAndPassword(authentication, payload.email, payload.password)
               .then(async user => {
                  resolve(user);
               })
               .catch();
         });
      },
      SIGN_IN({}, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               let user = await signInWithEmailAndPassword(authentication, payload.email, payload.password);

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
               let logoutUser = await signOut(authentication);
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
               let response = signInWithPopup(authentication, provider);
               resolve(response);
            } catch (err) {
               reject(err);
            }
         });
      }
   },

   getters: {}
};
