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

import { deleteDoc, getDoc, doc, onSnapshot, collection, addDoc, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";



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
const db = getFirestore(app);
const storage = getStorage(app);


// Set persistence
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Persistence set to 'local'");
        
    })
    .catch((error) => {
        
        console.error("Error setting persistence:", error);
    });

    const checkAuthState = (callback) => {
        onAuthStateChanged(auth, user => {
            callback(user); // Pass the user object to the callback function
        });
    };

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
      signOut(auth).then(() => {
          // Sign-out successful.
          console.log('User signed out');
       document.getElementById("signOut").style.display = "none";
       document.getElementById("logInBtn").style.display = "block";
       document.getElementById("signUpBtn").style.display = "block";
       document.querySelector('a[href="#AI-Enhance-section"]').click();
        
      }).catch((error) => {
          
          console.error('Sign out error', error);
      });
 
}


function validateEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}


// Assumes user is already logged in
async function uploadImageReference(imageUrl, type) {
    if (!auth.currentUser) {
        console.log("No user logged in");
        return;
    }
    
    // Assuming you have a way to generate or specify an image name
    const imageName = `image_${Date.now()}`; // Example image name generation

    try {
        // Handle the complete process of uploading and saving the image reference
        await handleImageUpload(imageUrl, imageName, type);
    } catch (error) {
        console.error("Error handling image upload:", error);
    }
}

  
  function loadUserImages() {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user logged in");
        return;
    }

    const imagesGrid = document.getElementById('imagesGrid');
    imagesGrid.innerHTML = ''; // Clear the grid first

    // Set up a real-time listener
    const imagesRef = collection(db, "users", user.uid, "images");
    onSnapshot(imagesRef, (querySnapshot) => {
      imagesGrid.innerHTML = ''; // Clear existing images before appending new ones
      querySnapshot.forEach((doc) => {
        const imageData = doc.data();
        // Creating a wrapper div for each image for better styling and control
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        const imgElement = document.createElement('img');
        imgElement.src = imageData.url;
        imgElement.classList.add('grid-image');
        imgElement.addEventListener('click', () => expandImage(imageData.url, imageData.type, imageData.name));

        const typeElement = document.createElement('p');
        typeElement.textContent = `Type: ${imageData.type}`;
        typeElement.classList.add('image-info');

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.classList.add('download-btn');
        downloadButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from triggering the image expansion
            downloadImage(imageData.url, imageData.name);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from triggering other events
            deleteImage(doc.id); // Pass the document ID to the delete function
        });




        imageWrapper.appendChild(imgElement);
        imageWrapper.appendChild(typeElement);
        imageWrapper.appendChild(downloadButton);
        imageWrapper.appendChild(deleteButton);
        imagesGrid.appendChild(imageWrapper);
      });
    }, (error) => {
      console.error("Error getting images:", error);
    });
}


function expandImage(imageUrl, imageType, imageName) {
    
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modal-img');
    const modalType = document.getElementById('modal-type');
    const modalDownloadBtn = document.getElementById('modal-download-btn');

    modal.style.display = 'block';
    modalImg.src = imageUrl;
    modalType.textContent = `Type: ${imageType}`;
    
    modalDownloadBtn.onclick = function() {
        downloadImage(imageUrl, imageName);
    };
}

function downloadImage(imageUrl, imageName) {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = imageName || 'downloaded_image';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function deleteImage(docId) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
       
        const docRef = doc(db, "users", auth.currentUser.uid, "images", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { storagePath } = docSnap.data();
            
          
            if (storagePath) {
                const fileRef = storageRef(storage, storagePath);
                await deleteObject(fileRef);
                console.log("Image deleted from Cloud Storage");
            }

           
            await deleteDoc(docRef);
            console.log("Document successfully deleted from Firestore");
            loadUserImages(); 
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error removing document or image: ", error);
    }
}

  
// Function to fetch and convert the temporary URL to a Blob
async function fetchImageAsBlob(temporaryUrl) {
    const response = await fetch(temporaryUrl);
    const blob = await response.blob();
    return blob;
}

// Function to upload image to Firebase Cloud Storage and return the permanent URL
async function uploadImageToCloudStorage(imageBlob, imageName) {
    const imageRef = storageRef(storage, `images/${imageName}`);
    await uploadBytes(imageRef, imageBlob);
    const permanentUrl = await getDownloadURL(imageRef);
    return permanentUrl;
}

// Main function to handle the upload and URL saving process
async function handleImageUpload(temporaryUrl, imageName, type) {
    try {
        // Download the image from the temporary URL
        const imageBlob = await fetchImageAsBlob(temporaryUrl);

        // Upload the image to Firebase Cloud Storage
        const permanentUrl = await uploadImageToCloudStorage(imageBlob, imageName);

        // Save the permanent URL to Firestore
        await addDoc(collection(db, "users", auth.currentUser.uid, "images"), {
            url: permanentUrl,
            user: auth.currentUser.uid,
            type: type,
            storagePath: `images/${imageName}`,
            timestamp: serverTimestamp()
        });

        console.log("Image saved with permanent URL:", permanentUrl);
    } catch (error) {
        console.error("Error uploading image:", error);
    }
}


  
export {loadUserImages, uploadImageReference, userSignUp, userSignIn, setupSignOut, checkAuthState };
