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
   state: {
      allTickets: null
   },
   mutations: {
      mAllTicket(state, payload) {
         state.allTickets = payload;
      }
   },
   actions: {
      GET_SINGLE_USER({ commit }, payload) {
         return new Promise(async (resolve, reject) => {
            const userRef = collection(db, 'Tickets');

            try {
               const q = query(userRef, where(`${payload.field}`, '==', `${payload.value}`));
               let fetcheData = await getDocs(q);
               let user = fetcheData.docs[0];

               if (user) {
                  resolve({ ...user.data(), id: user.id });
                  return;
               }
               resolve([]);
            } catch (err) {
               console.log(err);
               reject(err);
            }
         });
      },

      GET_TICKETS({ commit }, payload) {
         return new Promise(async (resolve, reject) => {
            const listOfTickets = collection(db, 'Tickets');

            try {
               const q = query(
                  listOfTickets,
                  limit(50),
                  orderBy('created_at', 'desc'),
                  where('status', '==', 1),
                  where(payload.field, '==', payload.value)
               );
               let fetcheData = await getDocs(q);
               let filteredTicketObject = fetcheData.docs.map(doc => ({ ...doc.data(), id: doc.id }));

               commit('mAllTicket', filteredTicketObject);

               resolve(filteredTicketObject);
            } catch (err) {
               console.log(err);
               reject(err);
            }
         });
      },
      SEARCH_TICKETS({ commit }, payload) {
         // ;
         return new Promise(async (resolve, reject) => {
            const listOfTickets = collection(db, 'Tickets');

            try {
               const q = query(
                  listOfTickets,
                  limit(50),
                  orderBy('f_name', 'asc'),
                  orderBy('created_at', 'desc'),
                  where('status', '==', 1),
                  where('is_root', '==', false),
                  where('f_name', '>=', payload.searchString),
                  where('f_name', '<', payload.searchString + '\uf8ff')
               );
               let fetcheData = await getDocs(q);
               let filteredTicketObject = fetcheData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
               console.log(filteredTicketObject);

               resolve(filteredTicketObject);
            } catch (err) {
               console.log(err);
               reject(err);
            }
         });
      },
      CREATE_TICKET({ commit }, payload) {
         return new Promise(async (resolve, reject) => {
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
      allTicketGetter(state) {
         return state.allTickets;
      }
   }
};
