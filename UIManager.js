//UIManager.js

import { loadUserImages, uploadImageReference, userSignUp, userSignIn, setupSignOut, checkAuthState } from './firebase-config.js';

let navLinks = document.querySelectorAll('.nav-link');
let sections = document.querySelectorAll('.container');
let startEnhancingButton = document.getElementById('start-enhancing');
let enhanceFileInput = document.getElementById('enhance-file-input');
let imagePreview = document.getElementById('image-preview');
let handleFileInputChangeBound = handleFileInputChange.bind(this);

// Additional elements for AI Enhance
let aiEnhanceUploadButton = document.getElementById('ai-enhance-upload');
let aiEnhanceUploadButton2 = document.getElementById('ai-enhance-upload2');
let aiEnhanceFileInput = document.getElementById('ai-enhance-file-input');
let aiEnhanceBeforeImage = document.querySelector('.image-before');
let aiEnhanceAfterImage = document.querySelector('.image-after');
let compareSlider = document.getElementById('Comparison-Slider');

let upscaleButton = document.getElementById('upscaleBtn');
let aiDownloadUpscaledBtn = document.getElementById('ai-download-upscaled-btn');
let upscaledImageUrl; // To store upscaled image URL

let uploadManager = new Bytescale.UploadManager({
    apiKey: "public_12a1yo32ypxc9cCHXZj5kuS1ZzDh"
});

let outputFormat = document.getElementById('downloadFormat');
let qualitySlider = document.getElementById('qualitySlider');
let qualityValue = document.getElementById('qualityValue');

qualitySlider.oninput = function() {
    qualityValue.textContent = this.value;
};

document.addEventListener('DOMContentLoaded', () => {
    setup();
    
});

function setup() {
    checkAuthState(updateUIBasedOnAuth);
    setupEventListeners();
     setupNavLinks();
    setupStartEnhancingButton();
    setupEnhanceImagesButton();
    setupFileInputChange();
    resetFileInputAndPreview();
    setupDragAndDrop();
    setupAISlider();
  
    setupDownloadButton();
    setupUpscaleControls();
   
    
    const modal = document.getElementById('imageModal');
    const closeButton = document.querySelector('.close');
    
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
   

    
    
    
}

function setupEventListeners() {


    const signInButton = document.getElementById('signIn');
    const signUpButton = document.getElementById('signUp');
    const signOutButton = document.getElementById('signOut');

    signInButton.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        userSignIn(email, password);
    });

    signUpButton.addEventListener('click', () => {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        userSignUp(email, password);
    });

    signOutButton.addEventListener('click', () => {
        setupSignOut();
    });
    // Setup event listeners for toggling forms and continuing as guest
    document.querySelectorAll(".toggle-forms").forEach(element => {
        element.addEventListener("click", toggleForms);
    });

    document.querySelectorAll(".continue-as-guest").forEach(element => {
        element.addEventListener("click", continueAsGuest);
    });

    document.getElementById('logInBtn').addEventListener('click', () => {
        // Show login form and hide signup form
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("login-form").style.display = "block";
        document.getElementById("auth-overlay").style.display = "block";
    });
    
    document.getElementById('signUpBtn').addEventListener('click', () => {
        // Show signup form and hide login form
        document.getElementById("login-form").style.display = "none";
        document.getElementById("signup-form").style.display = "block";
        document.getElementById("auth-overlay").style.display = "block";
    });
    
    

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

function continueAsGuest() {
    const authOverlay = document.getElementById("auth-overlay");
    authOverlay.style.display = "none";
    
}

function updateUIBasedOnAuth(user) {
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
        loadUserImages();
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



function setupUpscaleControls() {

    aiEnhanceFileInput.addEventListener('change', handleAIEnhanceFileInputChange);

    upscaleButton.addEventListener('click', async () => {
        showLoadingIndicator();
        await EnhanceImage();
        hideLoadingIndicator();
    });
    

    aiDownloadUpscaledBtn.addEventListener('click', () =>{ 
        downloadUpscaledImage();
    });

    aiEnhanceUploadButton.addEventListener('click', () => {
        aiEnhanceFileInput.click();
    });

    aiEnhanceUploadButton2.addEventListener('click', () => {
        aiEnhanceFileInput.click();
    });
}


function setupDownloadButton() {
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





function setupNavLinks() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default anchor action

            const sectionId = this.getAttribute('href').substring(1); // Remove the '#' from the href
            const targetSection = document.getElementById(sectionId);

            // Hide all sections
            sections.forEach(section => {
                section.classList.add('hidden');
            });

            // Deactivate all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });

            // Show the target section
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


    function handleAIEnhanceFileInputChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Update the source for the before and after images
                aiEnhanceBeforeImage.src = e.target.result;
                aiEnhanceAfterImage.src = e.target.result;
    
                // Hide upload controls
                document.getElementById('ai-enhance-upload').style.display = 'none'; // Hide upload button
    
                // Show the image and slider sections
                document.getElementById('ai-enhancer-controls').style.display = 'block'; // Show slider controls
                
                document.querySelector('.Image-container').style.display = 'block'; // Show image preview
                document.querySelector('.upscale-controls').style.display = 'block'; // Show comparison slider
                document.querySelector('.download-controls').style.display = 'block';
                
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }
    
    async function EnhanceImage() {
        const fileInput = document.getElementById('ai-enhance-file-input');
        if (fileInput.files.length === 0) {
            console.error("No file selected.");
            return;
        }
        const file = fileInput.files[0];

    

        const formData = new FormData();
        formData.append('image', file);
    
        try {
            const response = await fetch('https://api.deepai.org/api/torch-srgan', {
                method: 'POST',
                headers: {
                    'Api-Key': 'bb3f9569-05cb-4c72-b8fa-fd535b2ecf6a'
                },
                body: formData,
            });
    
            if (!response.ok) {
                // Attempt to parse error details from response
                const errorData = await response.json();
                console.error('Failed to upscale image:', errorData);
                throw new Error(`Failed to upscale image: ${errorData.detail || response.status}`);
            }
            const data = await response.json();
            upscaledImageUrl = data.output_url; 
            document.getElementById('image-after').src = upscaledImageUrl;
            uploadImageReference(upscaledImageUrl, 'upscaled');
        } catch (error) {
            console.error('Error upscaling image:', error);
        }
    }
    
    
    
    
    function downloadUpscaledImage() {
        showLoadingIndicator();
        if (!upscaledImageUrl) {
            alert("No upscaled image available for download.");
            return;
        }
    
        // Fetch the image, then create a Blob URL
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
    
                
                URL.revokeObjectURL(blobUrl);
                hideLoadingIndicator();
            })
            .catch(error => {
                console.error('Error downloading the image:', error);
                alert('Failed to download the image.');
            });
    }
    

    function setupAISlider() {
        const container = document.querySelector('.slider-container');
        document.querySelector('.Comparison-Slider').addEventListener('input', (e) => {
          container.style.setProperty('--position', `${e.target.value}%`);
        });
    }


    function setupDragAndDrop() {
        const dropArea = document.getElementById('drop-area');
    
        // Prevent default behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, e => e.preventDefault());
        });
    
        // Highlight effect when dragging images over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'));
        });
    
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

    function resetFileInputAndPreview() {
        enhanceFileInput.value = ''; // Clear file input
        // Reset any other UI elements, e.g., hide image preview or reset its source
        imagePreview.src = ''; // Clear image preview source
      
    }

    function hideAllSections() {
        sections.forEach(section => section.classList.add('hidden'));
    }

    function deactivateAllLinks() {
        navLinks.forEach(link => link.classList.remove('active'));
    }

    function setupStartEnhancingButton() {
        startEnhancingButton.addEventListener('click', () => {
            // Simulate click on Enhance Image nav link
            document.querySelector('a[href="#AI-Enhance-section"]').click();
        });
    }

    function setupEnhanceImagesButton() {
        const enhanceImagesBtn = document.getElementById('enhance-images');
        const enhanceImagesBtn2 = document.getElementById('enhance-images2');
    
        
        const enhanceImagesClickHandler = () => {
            enhanceFileInput.click();
        };
    
       
        enhanceImagesBtn.addEventListener('click', enhanceImagesClickHandler);
        enhanceImagesBtn2.addEventListener('click', enhanceImagesClickHandler);
    }
    

    function setupFileInputChange() {
        // Remove existing event listener
        enhanceFileInput.removeEventListener('change', handleFileInputChangeBound);
        // Re-bind the function
        handleFileInputChangeBound = handleFileInputChange.bind(this);
        enhanceFileInput.addEventListener('change', handleFileInputChangeBound);
    }
    

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

    showLoadingIndicator();

 
    const uploadedFilePath = await uploadFileAndGetPath(file);
    if (uploadedFilePath) {
        localStorage.setItem('uploadedFilePath', uploadedFilePath); // Update the path in localStorage
    }

    updateImagePreviewAndShowOptions(file);
    hideLoadingIndicator();
    enhanceFileInput.value = ''; // Clear the file input after processing

    }

    async  function uploadFileAndGetPath(file) {
        try {
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
            throw new Error('Failed to upload file');
        }
    }

    function updateImagePreviewAndShowOptions(file) {
        // Hide the Enhance Image section
        document.getElementById('Convert-to-section').classList.add('hidden');
        
        // Update the image preview
        const imgPreview = document.getElementById('image-preview');
        imgPreview.src = URL.createObjectURL(file);

        // Show the image preview and enhancement options
        document.getElementById('enhance-options').classList.remove('hidden');
    }

    function showLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }
    
    function hideLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    async  function downloadProcessedImage(format, quality) {
        const storedFilePath = localStorage.getItem('uploadedFilePath');
        if (!storedFilePath) {
            alert('No file path found. Please upload an image first.');
            return;
        }

        // Show loading indicator while processing and downloading
        showLoadingIndicator();

        try {
            // Process the file with the selected quality and format
            const blob = await processFile("public_12a1yo32ypxc9cCHXZj5kuS1ZzDh", "12a1yo3", storedFilePath, format, quality);
            
            // Initiate download
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = `processed_image.${format}`; 
            uploadImageReference(downloadLink.href, 'converted');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            console.error('Error processing and downloading file:', error);
            alert('Error processing and downloading file. Please try again.');
        }

        // Hide loading indicator after processing and downloading
        hideLoadingIndicator();
    }
    

    async function processFile(apiKey, accountId, storedFilePath,outputFormat, quality) {
        const fileApi = new Bytescale.FileApi({
            apiKey: apiKey
        });
      
        // Prepare the transformation parameters
        const transformationParams = {
            f: outputFormat,
            q: parseInt(quality, 10),
        };
      
        try {
            const response = await fileApi.processFile({
                accountId: accountId,
                filePath: storedFilePath,
                transformation: "image",
                transformationParams: transformationParams
            });
            return response.blob(); // Convert the response to a blob
        } catch (error) {
            console.error("Error processing file:", error);
            throw error;
        }
      }
      

    
    


















