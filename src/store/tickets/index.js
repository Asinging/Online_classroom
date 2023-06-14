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
      SEARCH_TICKET({ commit }, payload) {
         // ;
         return new Promise(async (resolve, reject) => {
            const listOfTickets = collection(db, 'Tickets');
            try {
               const q = query(
                  listOfTickets,
                  limit(50),
                  orderBy('subject', 'asc'),
                  orderBy('created_at', 'desc'),
                  where('status', '==', 1),
                  where('subject', '>=', payload.searchString),
                  where('subject', '<', payload.searchString + '\uf8ff')
               );
               let fetcheData = await getDocs(q);
               let filteredTicketObject = fetcheData.docs.map(doc => ({ ...doc.data(), id: doc.id }));

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
