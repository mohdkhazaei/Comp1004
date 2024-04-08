//UIManager.js

// Imports from firebase-config.js for user and image management functionalities.
import { loadUserImages, getUserName , uploadImageReference, userSignUp, userSignIn, setupSignOut, checkAuthState } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', setup);

// Initial setup: Checks authentication state and sets up UI accordingly.
function setup() {

    checkAuthState(user => updateUIBasedOnAuth(user));
    setupEventListeners();
}

// Sets up all event listeners for UI elements.
function setupEventListeners() {
    // Basic UI interaction handlers
    setupNavLinks();
    setupStartEnhancingButton();
    setupEnhanceImagesButton();
    setupFileInputChange();
    resetFileInputAndPreview();
    setupDragAndDrop();
    setupAISlider();
    handleSignIn();
    handleSignUp();
    setupDownloadButton();
    setupUpscaleControls();
   
     // Authentication modal interaction
    const modal = document.getElementById('imageModal');
    modal.querySelector('.close').addEventListener('click', () => modal.style.display = 'none');

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
   
    // Sign-in, sign-up, and sign-out functionalities
    document.getElementById('signIn').addEventListener('click', handleSignIn);
    document.getElementById('signUp').addEventListener('click', handleSignUp);
    document.getElementById('signOut').addEventListener('click', () => {
        setupSignOut();
        document.getElementById("navbar-username").style.display = "none";
    });


    // Toggling between sign-in and sign-up forms and handling guest mode
    document.querySelectorAll(".toggle-forms").forEach(element => {
        element.addEventListener("click", toggleForms);
    });

    document.querySelectorAll(".continue-as-guest").forEach(element => {
        element.addEventListener("click", continueAsGuest);
    });

     // Show auth forms when respective buttons are clicked
     document.getElementById('logInBtn').addEventListener('click', showLoginForm);
     document.getElementById('signUpBtn').addEventListener('click', showSignupForm);
    
    
    // Display user's images section
    document.getElementById('yourImagesBtn').addEventListener('click', function(e) {
        e.preventDefault();
    
        // Hide all sections
        document.querySelectorAll('.container').forEach(section => {
            section.classList.add('hidden');
        });
    
        // Deactivate all nav links
        document.querySelectorAll('.nav-link, .nav-button').forEach(link => {
            link.classList.remove('active');
        });
    
        // Show the "Your Images" section
        document.getElementById('yourImagesSection').classList.remove('hidden');
    
       
        this.classList.add('active');
    });
}

// Navigation setup: Allows for smooth navigation between different sections of the app via navbar links.
function setupNavLinks() {

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.container');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default page jump.

            const sectionId = this.getAttribute('href').substring(1);  // Extract section ID.
            const targetSection = document.getElementById(sectionId);

            // Hide all sections and mark the clicked link as active.
            sections.forEach(section => section.classList.add('hidden'));
            navLinks.forEach(link => link.classList.remove('active'));

            if (targetSection) {
                targetSection.classList.remove('hidden');
            } else {
                console.error('Section not found:', sectionId);
            }
            // Mark the clicked nav link as active
            this.classList.add('active');
        });
    });
}

// Shows login form and hides signup form.
function showLoginForm() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("auth-overlay").style.display = "block";
}

// Shows signup form and hides login form.
function showSignupForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("auth-overlay").style.display = "block";
}

// Toggles between displaying the sign-up and login forms.
function toggleForms() {
    const signUpForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    
    if (signUpForm.style.display === "none") {
        signUpForm.style.display = "block";
        loginForm.style.display = "none";
    } else {
        signUpForm.style.display = "none";
        loginForm.style.display = "block";
    }
}

// Hides authentication overlay, effectively continuing as a guest.
function continueAsGuest() {
    document.getElementById("auth-overlay").style.display = "none";
    
}

// Handles user sign-in process.
function handleSignIn() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!email || !password) {
        console.log('Input fields are empty.');
        return;
    }
    // Attempts to sign in the user with provided credentials.
    showLoadingIndicator();
    userSignIn(email, password).then(handleAuthSuccess).catch(handleAuthError);
}

// Handles user sign-up process.
function handleSignUp() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    if (!email || !password) {
        console.log('Input fields are empty.');
        return;
    }
    // Attempts to create a new user with provided credentials.
    showLoadingIndicator();
    userSignUp(email, password).then(handleAuthSuccess).catch(handleAuthError);
}

//handler for successful authentication actions (sign-in or sign-up).
function handleAuthSuccess() {
    document.getElementById("navbar-username").style.display = "block";
    updateUserNameInUI();
    hideLoadingIndicator();
}

//error handler for authentication actions.
function handleAuthError(error) {
    console.error("Authentication error:", error.message);
    alert(`Authentication failed: ${error.message}`);
    hideLoadingIndicator();
}





// Updates the UI based on the user's authentication state.
async function updateUIBasedOnAuth(user) {
    if (user === undefined) {
        // Firebase is still initializing, show loading UI or return early without changing the current state
        showLoadingIndicator();
        console.log("Auth state is initializing...");

        
        return;
    } else{
        hideLoadingIndicator();
        console.log("Updating UI based on auth state...", user);
    }
    
    
    if (user) {
        // User is signed in
        updateUserNameInUI();
        loadUserImages();
        document.getElementById("navbar-username").style.display = "block";
        document.getElementById("yourImagesBtn").style.display = "block";
        document.getElementById("signOut").style.display = "block";
        document.getElementById("logInBtn").style.display = "none";
        document.getElementById("signUpBtn").style.display = "none";

        
        
    } else {
        // No user is signed in
        document.getElementById('imagesGrid').innerHTML = '';
        document.getElementById("yourImagesBtn").style.display = "none";
        document.getElementById("signOut").style.display = "none";
        document.getElementById("logInBtn").style.display = "block";
        document.getElementById("signUpBtn").style.display = "block";
        
    }
}

// Updates the user's name in the UI.
async function updateUserNameInUI(){

    const name = await getUserName();
    if (name) {
        displayUserName(name);
    }
    
}
function displayUserName(name) {
    
    document.getElementById('username').textContent = name;

}

// Sets up interaction for the AI upscaling section, including uploading images for enhancement.
function setupUpscaleControls() {
    // Retrieve UI elements for upscaling interaction.
    let upscaleButton = document.getElementById('upscaleBtn');
    let aiEnhanceUploadButton = document.getElementById('ai-enhance-upload');
    let aiEnhanceUploadButton2 = document.getElementById('ai-enhance-upload2');
    let aiEnhanceFileInput = document.getElementById('ai-enhance-file-input');
    let aiDownloadUpscaledBtn = document.getElementById('ai-download-upscaled-btn');
    let upscaledImageUrl; 

    // Initiate image enhancement process on button click.
    upscaleButton.addEventListener('click', async () => {
        showLoadingIndicator();
        // Calls function to enhance the image and updates the UI with the result.
       upscaledImageUrl = await EnhanceImage(upscaledImageUrl);
        hideLoadingIndicator();
    });
    
    // Triggers download of the upscaled image.
    aiDownloadUpscaledBtn.addEventListener('click', () =>{ 
        downloadUpscaledImage(upscaledImageUrl);
    });

    // Open file dialog to select an image for upscaling.
    [aiEnhanceUploadButton, aiEnhanceUploadButton2].forEach(button => {
        button.addEventListener('click', () => aiEnhanceFileInput.click());
    });

    // Process the selected file for AI enhancement.
    aiEnhanceFileInput.addEventListener('change', handleAIEnhanceFileInputChange);
}

// Process AI Enhancement file selection and update UI to reflect changes.
function handleAIEnhanceFileInputChange(event) {
    
    const file = event.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }

    
    const reader = new FileReader();
    reader.onload = (e) => {
        // Display the selected image in both "before" and "after" placeholders initially.
        document.querySelector('.image-before').src = e.target.result;
        document.querySelector('.image-after').src = e.target.result;

        // Adjust UI elements to show the image and controls for upscaling.
        document.getElementById('ai-enhance-upload').style.display = 'none';
        document.getElementById('ai-enhancer-controls').style.display = 'block';
        document.querySelector('.Image-container').style.display = 'block';
        document.querySelector('.upscale-controls').style.display = 'block';
    };
    reader.readAsDataURL(file);
}
    
    // Handles the upscaling of an image using an external API.
    async function EnhanceImage(upscaledImageUrl) {

        const fileInput = document.getElementById('ai-enhance-file-input');

        if (fileInput.files.length === 0) {
            console.error("No file selected.");
            return;
        }

        const file = fileInput.files[0];

        // Prepare the form data with the image file.
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            // Make a POST request to the DeepAI API with the image.
            const response = await fetch('https://api.deepai.org/api/torch-srgan', {
                method: 'POST',
                headers: {
                    'Api-Key': 'bb3f9569-05cb-4c72-b8fa-fd535b2ecf6a'
                },
                body: formData,
            });
    
            // Check for a successful response.
            if (!response.ok) {
                // Attempt to parse error details from response
                const errorData = await response.json();
                console.error('Failed to upscale image:', errorData);
                throw new Error(`Failed to upscale image: ${errorData.detail || response.status}`);
            }

            // Process the successful response.
            const data = await response.json();
            upscaledImageUrl = data.output_url; // Update the URL with the new upscaled image URL.
            document.getElementById('image-after').src = upscaledImageUrl; // Update the UI with the upscaled image.

            // Upload the upscaled image to the storage bucket.
            uploadImageReference(upscaledImageUrl, 'upscaled');

        } catch (error) {
            console.error('Error upscaling image:', error);
        }
        return upscaledImageUrl; // Return the new upscaled image URL for further processing or use.
    }
    
    
    
    // Initiates download of the upscaled image.
    function downloadUpscaledImage(upscaledImageUrl) {

        showLoadingIndicator();
        
        // Check if there's an upscaled image to download; if not, alert the user.
        if (!upscaledImageUrl) {
            alert("No upscaled image available for download.");
            return;
        }
    
        // Fetch the image, then Create a Blob URL from the upscaled image URL and trigger download.
        fetch(upscaledImageUrl)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
    
                // Attempt to extract a file extension, otherwise default to jpg
                const fileExtension = upscaledImageUrl.split('.').pop() || 'jpg';
                link.download = `upscaled_image.${fileExtension}`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); 
                URL.revokeObjectURL(blobUrl); // Clean up the Blob URL.


                hideLoadingIndicator();
            })
            .catch(error => {
                console.error('Error downloading the image:', error);
                alert('Failed to download the image.');
            });
    }
    
    // Slider setup for comparing before and after AI enhancement.
    function setupAISlider() {

        // Dynamically update the slider position as the user interacts with it.
        const slider = document.querySelector('.Comparison-Slider');

        slider.addEventListener('input', (e) => {
        const container = document.querySelector('.slider-container');
        container.style.setProperty('--position', `${e.target.value}%`);
    });
    }

    // Drag and drop setup: Allows users to drag and drop images for processing.
    function setupDragAndDrop() {
        const dropArea = document.getElementById('drop-area');
    
        // Setup event listeners for drag and drop functionality.

        // Prevent default behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, e => e.preventDefault());
        });
    
        // Highlight effect when dragging images over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'));
        });
        
        // Remove highlight effect when dragging images out or dropping them
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'));
        });
    
        // Handle file drop
        dropArea.addEventListener('drop', e => {
            const dt = e.dataTransfer;
            const files = dt.files;
    
            if (files.length) {
                handleFileInputChange({ target: { files: files } }); // Reuse the file input change handler
            }
        });
    }


    // Clears the file input after use and resets related UI elements.
    function resetFileInputAndPreview() {
        let imagePreview = document.getElementById('image-preview');
        let enhanceFileInput = document.getElementById('enhance-file-input');
        enhanceFileInput.value = ''; // Clear file input value
        imagePreview.src = ''; // Clear image preview source
      
    }

    // When the "Start Enhancing" button is clicked, automatically navigate to the AI Enhance section.
    function setupStartEnhancingButton() {

        let startEnhancingButton = document.getElementById('start-enhancing');

        startEnhancingButton.addEventListener('click', () => {
            document.querySelector('a[href="#AI-Enhance-section"]').click();

        });
    }

    // Setup buttons for image selection. This makes the file input interaction more intuitive.
    function setupEnhanceImagesButton() {

        const enhanceImagesClickHandler = () => {
            document.getElementById('enhance-file-input').click();
        };
        
          // Both buttons share the same handler for simplicity.
        document.getElementById('enhance-images').addEventListener('click', enhanceImagesClickHandler);
        document.getElementById('enhance-images2').addEventListener('click', enhanceImagesClickHandler);
       
    }
    
    // Initializes file input change listener to handle new image uploads for enhancement.
    function setupFileInputChange() {
        document.getElementById('enhance-file-input').addEventListener('change', handleFileInputChange);
    }
    

    // Setup the download button functionality, allowing users to download the processed image in a chosen format.
    function setupDownloadButton() {

        // Elements for controlling the output format and quality of the download.
        let outputFormat = document.getElementById('downloadFormat');
        let qualitySlider = document.getElementById('qualitySlider');
        let qualityValue = document.getElementById('qualityValue');

        // Display current quality value next to the slider.
        qualitySlider.oninput = function() {
            qualityValue.textContent = this.value;
        };

        // On clicking the download button, process the image with selected settings and initiate download.
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', async () => {
                const format = outputFormat.value;
                const quality = qualitySlider.value;
                await downloadProcessedImage(format, quality);
            });
        } else {
            console.error('Download button not found');
        }
    }

    // Manages file selection, validates the file type, and updates UI accordingly.
    async  function handleFileInputChange(event) {

        const files = event.target.files;
        if (files.length === 0) {
            console.log('No file selected.');
            return;
        }
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('Error: The file is not an image.');
            return;
        }
    
        showLoadingIndicator(); // Visually indicate processing is happening.
    
        const uploadedFilePath = await uploadFileAndGetPath(file);
        if (uploadedFilePath) {
            // Save the path for later use (e.g., downloading).
            localStorage.setItem('uploadedFilePath', uploadedFilePath);
        }
    
        updateImagePreviewAndShowOptions(file); // Show the selected image in the UI.
        hideLoadingIndicator(); // Stop the loading indicator.
        event.target.value = ''; // Clear the file input to allow re-uploads.

    }

    // Uploads the selected file and returns its path for future reference.
    async  function uploadFileAndGetPath(file) {
        try {
            let uploadManager = new Bytescale.UploadManager({
                apiKey: "public_12a1yo32ypxc9cCHXZj5kuS1ZzDh"
            });

            // The upload method expects an object with a 'data' property containing the file
            const uploadResponse = await uploadManager.upload({ data: file });

            if (uploadResponse.fileUrl && uploadResponse.filePath) {
              
                console.log(`File uploaded: ${uploadResponse.fileUrl}`);
                return uploadResponse.filePath; 

            } else {
                console.error('Upload response did not contain fileUrl or filePath');
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error; // Re-throw to handle it outside.
        }
    }

    // Updates the UI with the selected image and shows options for further actions.
    function updateImagePreviewAndShowOptions(file) {

        // Hide the Enhance Image section
        document.getElementById('Convert-to-section').classList.add('hidden');
        
        // Update the image preview
        const imgPreview = document.getElementById('image-preview');
        imgPreview.src = URL.createObjectURL(file);

        // Show the image preview and enhancement options
        document.getElementById('enhance-options').classList.remove('hidden');
    }


    // Shows and hides a loading indicator for better user feedback during processing.
    function showLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }
    function hideLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    // Processes the uploaded image according to the selected format and quality, then initiates download.
    async  function downloadProcessedImage(format, quality) {

        const storedFilePath = localStorage.getItem('uploadedFilePath');
        if (!storedFilePath) {
            alert('No file path found. Please upload an image first.');
            return;
        }

        showLoadingIndicator(); // Signal that work is being done.

        try {
            // Process the file with the selected quality and format
            const blob = await processFile("public_12a1yo32ypxc9cCHXZj5kuS1ZzDh", "12a1yo3", storedFilePath, format, quality);
            
            // Initiate download
            const downloadLink = document.createElement('a'); 
            downloadLink.href = window.URL.createObjectURL(blob); // Create a URL for the blob
            downloadLink.download = `processed_image.${format}`;  
            uploadImageReference(downloadLink.href, 'converted to ' + format); // Upload the processed image to the storage bucket.
            document.body.appendChild(downloadLink); 
            downloadLink.click(); // Trigger the download
            document.body.removeChild(downloadLink); 

        } catch (error) {
            console.error('Error processing and downloading file:', error);
            alert('Error processing and downloading file. Please try again.');
        }

        // Hide loading indicator after processing and downloading
        hideLoadingIndicator();

    }
    
    // Calls an ByteScale API to transform the image file based on user-selected options.
    async function processFile(apiKey, accountId, storedFilePath, outputFormat, quality) {

        try {
            const fileApi = new Bytescale.FileApi({
                    apiKey: apiKey
                });
            
                // Prepare the transformation parameters
            const transformationParams = {
                    f: outputFormat,
                    q: parseInt(quality, 10),
                };

            const response = await fileApi.processFile({
                accountId: accountId,
                filePath: storedFilePath,
                transformation: "image",
                transformationParams: transformationParams
            });
            return response.blob(); // Return the processed image blob for download.
        } catch (error) {
            console.error("Error processing file:", error);
            throw error; // Allow caller to handle the error.
        }
      }
















