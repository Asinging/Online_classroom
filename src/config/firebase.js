// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
   apiKey: 'AIzaSyB7StPI-jfDZY2vUgw1W4Ixi17wYjvS-_c',
   authDomain: 'online-classroom-e9519.firebaseapp.com',
   projectId: 'online-classroom-e9519',
   storageBucket: 'online-classroom-e9519.appspot.com',
   messagingSenderId: '657026357375',
   appId: '1:657026357375:web:be0c71a1bfb23c7978474a',
   measurementId: 'G-NW0W0R3MF5'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
