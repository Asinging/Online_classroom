import { authentication } from '@/config/firebase.js';

import {
   signInWithEmailAndPassword,
   signInWithPopup,
   GoogleAuthProvider,
   createUserWithEmailAndPassword,
   signOut,
   sendPasswordResetEmail,
   updateProfile,
   getAuth
} from 'firebase/auth';
// const auth = getAuth();
// console.log(auth);
// console.log(authentication);
export default {
   namespaced: true,
   state: {
      currentUser: null
   },
   mutations: {},
   actions: {
      FORGOT_PASSWORD({}, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               let result = await sendPasswordResetEmail(authentication, payload.userEmail);
               resolve(result);
            } catch (err) {
               reject(err);
               console.log(err);
            }
         });
      },
      SIGN_UP({}, payload) {
         return new Promise(async (resolve, reject) => {
            createUserWithEmailAndPassword(authentication, payload.email, payload.password)
               .then(async user => {
                  await updateProfile(authentication.currentUser, {
                     displayName: payload.displayName,
                     photoURL: 'https://example.com/jane-q-user/profile.jpg'
                  }).catch();
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
               reject(JSON.parse(JSON.stringify(error)));
            }
         });
      },
      LOG_OUT({}) {
         return new Promise(async (resolve, reject) => {
            try {
               let logoutUser = await signOut(authentication);

               resolve(logoutUser);
            } catch (error) {
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
