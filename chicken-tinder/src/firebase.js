// const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
// const { getAuth, GoogleAuthProvider } = require('firebase/auth');
import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIlI1jJ3g44LE5KqD_fkhSvupzVuyAp6A",
  authDomain: "softwaredesign-5c0fc.firebaseapp.com",
  projectId: "softwaredesign-5c0fc",
  storageBucket: "softwaredesign-5c0fc.appspot.com",
  messagingSenderId: "503738090005",
  appId: "1:503738090005:web:d975877d06aebe6dcd041c",
  measurementId: "G-QP1CHLFRPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//const serviceAccount = require('./ServiceAccountKey.json');

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {db, auth, provider}; 
// async function addAccount (user) {
//     console.log("GETS TO FB")

//     try {
//         const coll = db.collection("Test");

//         await coll.doc(user.user).set({
//             email: user.user,
//             password: user.password
//         });
//         console.log("RETURN TRUE");
//         return true;
//     }
//     catch (err){
//         console.log(err);
//         console.log("RETURN FALSE");
//         return false;
//     }

// }

// module.exports = {addAccount}