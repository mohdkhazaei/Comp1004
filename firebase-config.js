//firebase-config.js

// Import necessary Firebase modules for app, authentication, firestore database, and storage services
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
import { setDoc, deleteDoc, getDoc, doc, onSnapshot, collection, addDoc, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";



// Firebase configuration object containing the app's Firebase project settings
const firebaseConfig = {
    apiKey: "AIzaSyCtEceXO0VbyGgKYr18wMEW6ta8LpS3dPQ",
    authDomain: "comp1004-a5199.firebaseapp.com",
    projectId: "comp1004-a5199",
    storageBucket: "comp1004-a5199.appspot.com",
    messagingSenderId: "348763445507",
    appId: "1:348763445507:web:5363396b4926394ca83136",
    measurementId: "G-G973F3C7X9"
  };

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


    // Configure Firebase authentication to use browser local storage for persistence
    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            console.log("Persistence set to 'local'");
            
        })
        .catch((error) => {
            
            console.error("Error setting persistence:", error);
        });

    // Check authentication state and execute a callback function with the user data
    const checkAuthState = (callback) => {
        onAuthStateChanged(auth, user => {
            callback(user); // Pass the user object to the callback function
        });
    };

    // Fetches and returns the current user's name from the Firestore database
    async function getUserName(){
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const docSnap = await getDoc(userRef);
        
                if (docSnap.exists()) {
                    return docSnap.data().name; // Return the user's name
                } else {
                    console.log("Document does not exist!");
                    return null;
                }
            } else {
                console.log("No user logged in");
                return null;
            }
        }
    
    // Registers a new user with email and password, and stores additional user data in Firestore    
    async function userSignUp() {
        
        // Inputs are fetched and trimmed of whitespace
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const name = document.getElementById('signup-name').value.trim(); // Fetch the name
    
        if (!validateEmail(email) || password === '' || name === '') {
            alert('Please enter a valid email, password, and name.');
            return;
        }
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);
    
            // Store user data including name in Firestore under 'users' collection, document ID being the user's UID
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email
            });
    
            alert("Your account has been created!");

         // UI updates following successful signup
         document.getElementById("auth-overlay").style.display = "none";
         document.getElementById("signOut").style.display = "block";
         document.getElementById("logInBtn").style.display = "none";
         document.getElementById("signUpBtn").style.display = "none";
    
        } catch (error) {
            console.error("Signup error:", error);
            alert("Signup failed: " + error.message);
        }
    }


    

  // Signs in a user with the provided email and password
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

// Signs out the currently logged-in user
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

// Validates email format using regular expression
function validateEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}


// Uploads an image to Firebase Storage and saves a reference in Firestore
async function uploadImageReference(imageUrl, type) {

    if (!auth.currentUser) {
        console.log("No user logged in");
        return;
    }
    
    
    const imageName = `image_${Date.now()}`; 

    try {
        // Handle the complete process of uploading and saving the image reference
        await handleImageUpload(imageUrl, imageName, type);
    } catch (error) {
        console.error("Error handling image upload:", error);
    }
}

  // Loads and displays user's images from Firestore in real-time
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

    // Listen to changes in the 'images' collection of the current user
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
        imgElement.addEventListener('click', () => expandImage(imageData.url, imageData.type, imageData.name)); // Expand the image on click

        const typeElement = document.createElement('p');
        typeElement.textContent = `Type: ${imageData.type}`;
        typeElement.classList.add('image-info');

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.classList.add('download-btn');
        downloadButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click from triggering the image expansion
            downloadImage(imageData.url, imageData.name); // Pass the image URL to the download function
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

// Function to expand an image in a modal
function expandImage(imageUrl, imageType) {
    
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modal-img');
    const modalType = document.getElementById('modal-type');


    modal.style.display = 'block';
    modalImg.src = imageUrl;
    modalType.textContent = `Type: ${imageType}`;
}

// Function to download an image from a URL (does not download properly due to CORS policy restrictions)
function downloadImage(imageUrl) {
    const a = document.createElement('a'); 
    a.href = imageUrl;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to delete an image from Firestore and Cloud Storage
async function deleteImage(docId) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
       
        const docRef = doc(db, "users", auth.currentUser.uid, "images", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { storagePath } = docSnap.data(); // Get the image's storage path
            
          
            if (storagePath) {
                const fileRef = storageRef(storage, storagePath); // Create a reference to the image in Cloud Storage
                await deleteObject(fileRef); // Delete the image from Cloud Storage
                console.log("Image deleted from Cloud Storage");
            }

           
            await deleteDoc(docRef); // Delete the image reference from Firestore
            console.log("Document successfully deleted from Firestore");
            loadUserImages(); 
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error removing document or image: ", error);
    }
}

// Function to fetch an image as a Blob from a URL
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

// Uploads the image Blob to Firebase Storage and saves a reference URL in Firestore
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


  // Export functions for external use
export {getUserName, loadUserImages, uploadImageReference, userSignUp, userSignIn, setupSignOut, checkAuthState };
