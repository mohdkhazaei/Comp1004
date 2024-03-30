//firebase-config.js
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

// Firebase configuration
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

// Set persistence
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to 'local'");
        
    })
    .catch((error) => {
        
        console.error("Error setting persistence:", error);
    });


    async function userSignUp() {
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
  
      if (!validateEmail(email) || password === '') {
          alert('Please enter a valid email and password.');
          return;
      }
      
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log("User signed up:", userCredential.user);
          alert("Your account has been created!");
          
         
          document.getElementById("auth-overlay").style.display = "none";
          document.getElementById("signOut").style.display = "block";
           document.getElementById("logInBtn").style.display = "none";
           document.getElementById("signUpBtn").style.display = "none";
      } catch (error) {
          console.error("Signup error:", error);
          alert("Signup failed: " + error.message);
      }
  }


  async function userSignIn() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!validateEmail(email) || password === '') {
        alert('Please enter a valid email and password.');
        return;
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);
        alert("You have signed in successfully!");
        
       
        document.getElementById("auth-overlay").style.display = "none";
         document.getElementById("signOut").style.display = "block";
         document.getElementById("logInBtn").style.display = "none";
         document.getElementById("signUpBtn").style.display = "none";
    } catch (error) {
        console.error("Sign-in error:", error);
        alert("Sign-in failed: " + error.message);
    }
}


function setupSignOut() {
  document.getElementById('signOut').addEventListener('click', () => {
      signOut(auth).then(() => {
          // Sign-out successful.
          console.log('User signed out');
       document.getElementById("signOut").style.display = "none";
       document.getElementById("logInBtn").style.display = "block";
       document.getElementById("signUpBtn").style.display = "block";
        
      }).catch((error) => {
          
          console.error('Sign out error', error);
      });
  });
}


function validateEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

const checkAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};
  
export { userSignUp, userSignIn, setupSignOut, checkAuthState };
