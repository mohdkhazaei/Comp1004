import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";


import {
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    setPersistence, 
    browserLocalPersistence 
  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCtEceXO0VbyGgKYr18wMEW6ta8LpS3dPQ",
    authDomain: "comp1004-a5199.firebaseapp.com",
    projectId: "comp1004-a5199",
    storageBucket: "comp1004-a5199.appspot.com",
    messagingSenderId: "348763445507",
    appId: "1:348763445507:web:5363396b4926394ca83136",
    measurementId: "G-G973F3C7X9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);

    setPersistence(auth, browserLocalPersistence);

  export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut };
