

let navLinks = document.querySelectorAll('.nav-link');
let sections = document.querySelectorAll('.container');
let startEnhancingButton = document.getElementById('start-enhancing');
let enhanceFileInput = document.getElementById('enhance-file-input');
let widthInput = document.getElementById('widthInput');
let heightInput = document.getElementById('heightInput');
let processImageButton = document.getElementById('processImageBtn');
let imagePreview = document.getElementById('image-preview');
let handleFileInputChangeBound = handleFileInputChange.bind(this);

// Additional elements for AI Enhance
let aiEnhanceUploadButton = document.getElementById('ai-enhance-upload');
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
    setupNavLinks();
    setupStartEnhancingButton();
    setupEnhanceImagesButton();
    setupFileInputChange();
    resetFileInputAndPreview();
    setupDragAndDrop();
    setupAISlider();
    setupUpscaleDownloadButton();
    setupDownloadButton();
    setupUpscaleControls();

    aiEnhanceFileInput.addEventListener('change', handleAIEnhanceFileInputChange);

    upscaleButton.addEventListener('click', async () => {
        await EnhanceImage();
    });

    

    aiDownloadUpscaledBtn.addEventListener('click', downloadUpscaledImage);
}

function setupUpscaleControls() {
    // Assuming aiEnhanceUploadButton is your "Upload Image" button in the upscale controls
    aiEnhanceUploadButton.addEventListener('click', () => {
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


function setupUpscaleDownloadButton() {
    if (aiDownloadUpscaledBtn) {
        aiDownloadUpscaledBtn.removeEventListener('click', downloadUpscaledImage);
        aiDownloadUpscaledBtn.addEventListener('click', downloadUpscaledImage);
    } else {
        console.error('Download button not found');
    }
}


    function setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
    
                const sectionId = link.getAttribute('href').replace('#', '');
                const targetSection = document.getElementById(sectionId);
    
                deactivateAllLinks();
                hideAllSections();
    
                link.classList.add('active');
                targetSection.classList.remove('hidden');
                
                if (sectionId === 'image-format') {
                    resetFileInputAndPreview(); // Reset file input and any necessary UI components
                    setupFileInputChange(); // Ensure event listeners are correctly re-attached
                }
                
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

        showLoadingIndicator();

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
        } catch (error) {
            console.error('Error upscaling image:', error);
        } finally {
            hideLoadingIndicator();
        }
    }
    
    
    
    
    function downloadUpscaledImage() {
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
            document.querySelector('a[href="#Convert-to-section"]').click();
        });
    }

    function setupEnhanceImagesButton() {
        const enhanceImagesBtn = document.getElementById('enhance-images');
    
        
        const enhanceImagesClickHandler = () => {
            enhanceFileInput.click();
        };
    
       
        enhanceImagesBtn.addEventListener('click', enhanceImagesClickHandler);
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
    const file = files[0]; // Assuming single file selection

    if (!file.type.startsWith('image/')) {
        alert('Error: The file is not an image.');
        return;
    }

    showLoadingIndicator();

    
    // Assuming you have a method to upload and get the file path
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
      

    
    


















