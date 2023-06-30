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
   mutations: {
      mCurrentUser(state, payload) {
         state.currentUser = payload;
      }
   },
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
                     avatar: 'https://example.com/jane-q-user/profile.jpg'
                  }).catch(err => {
                     reject(err);
                  });
                  resolve(user);
               })
               .catch(err => {
                  reject(err);
               });
         });
      },
      SIGN_IN({ commit }, payload) {
         return new Promise(async (resolve, reject) => {
            try {
               let user = await signInWithEmailAndPassword(authentication, payload.email, payload.password);

               return resolve(user);
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

               // dispatch('Users/GET_SINGLE_USER_BY_Id', { id: response.id });

               resolve(response);
            } catch (err) {
               reject(err);
            }
         });
      }
   },

   getters: {
      currentUserGetter(state) {
         return state.currentUser ? state.currentUser : JSON.parse(localStorage.getItem('userData'));
      }
   }
};
