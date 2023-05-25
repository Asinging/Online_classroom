import { storage } from '@/config/firebase.js';

import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        UPLOAD_COVER_PICTURE({ commit }, payload) {
            return new Promise(async(resolve, reject) => {
                try {
                    const storageRef = ref(storage, `course/coverArt/${payload.image.name + v4()}`);
                    let response = await uploadBytes(storageRef, payload.image);
                    resolve(response);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        }
    },
    getters: {}
};