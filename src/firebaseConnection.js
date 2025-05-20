// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCivjFw4MczOsTiDeHRxIwzG0wSFvI1t94",
  authDomain: "hangar-18-1fdcc.firebaseapp.com",
  projectId: "hangar-18-1fdcc",
  storageBucket: "hangar-18-1fdcc.firebasestorage.app",
  messagingSenderId: "122933716346",
  appId: "1:122933716346:web:aa0c56562c4ee62ac862c3",
  measurementId: "G-NLDQBH4DL7"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(FirebaseApp);

export {db};