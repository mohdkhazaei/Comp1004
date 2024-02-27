import { processFile } from './ImageProcessor.js';

export class UIManager {
    constructor() {

        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.container');
        this.startEnhancingButton = document.getElementById('start-enhancing');
        this.enhanceFileInput = document.getElementById('enhance-file-input');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.processImageButton = document.getElementById('processImageBtn');
        this.imagePreview = document.getElementById('image-preview');

        const downloadBtn = document.getElementById('downloadBtn');
        

        this.uploadManager = new Bytescale.UploadManager({
            apiKey: "public_12a1yo32ypxc9cCHXZj5kuS1ZzDh"
        });

        this.outputFormat = document.getElementById('downloadFormat');
        this.qualitySlider = document.getElementById('qualitySlider');
        this.qualityValue = document.getElementById('qualityValue');

    
        qualitySlider.oninput = function() {
            qualityValue.textContent = this.value;
        }

        downloadBtn.addEventListener('click', async () => {
            const selectedFormat = this.outputFormat.value;
            const selectedQuality = this.qualitySlider.value;
            await this.downloadProcessedImage(selectedFormat, selectedQuality);
        });

        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => this.setup());
    }

    setup() {
        this.setupNavLinks();
        this.setupStartEnhancingButton();
        this.setupEnhanceImagesButton();
        this.setupFileInputChange();
        this.resetFileInputAndPreview();
        this.setupDragAndDrop(); 
        this.handleFileInputChange();

    }

    setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
    
                const sectionId = link.getAttribute('href').replace('#', '');
                const targetSection = document.getElementById(sectionId);
    
                this.deactivateAllLinks();
                this.hideAllSections();
    
                link.classList.add('active');
                targetSection.classList.remove('hidden');
                
                if (sectionId === 'image-format') {
                    this.resetFileInputAndPreview(); // Reset file input and any necessary UI components
                    this.setupFileInputChange(); // Ensure event listeners are correctly re-attached
                }
            });
        });
    }

    setupDragAndDrop() {
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
                this.handleFileInputChange({ target: { files: files } }); // Reuse the file input change handler
            }
        });
    }

    resetFileInputAndPreview() {
        this.enhanceFileInput.value = ''; // Clear file input
        // Reset any other UI elements, e.g., hide image preview or reset its source
        this.imagePreview.src = ''; // Clear image preview source
      
    }

    hideAllSections() {
        this.sections.forEach(section => section.classList.add('hidden'));
    }

    deactivateAllLinks() {
        this.navLinks.forEach(link => link.classList.remove('active'));
    }

    setupStartEnhancingButton() {
        this.startEnhancingButton.addEventListener('click', () => {
            // Simulate click on Enhance Image nav link
            document.querySelector('a[href="#enhance-image-section"]').click();
        });
    }

    setupEnhanceImagesButton() {
       // Ensure this method is idempotent
    const enhanceImagesBtn = document.getElementById('enhance-images');

    // Remove previous listener to avoid duplicates
    enhanceImagesBtn.removeEventListener('click', this.enhanceImagesClickHandler);

    // Define the click handler
    this.enhanceImagesClickHandler = () => {
        this.enhanceFileInput.click();
       
    };

    // Attach the event listener
    enhanceImagesBtn.addEventListener('click', this.enhanceImagesClickHandler);
    }

   


    setupFileInputChange() {
         // Clear existing event listeners to avoid duplication
    this.enhanceFileInput.removeEventListener('change', this.handleFileInputChangeBound);

    // Bind the handler so 'this' refers to the class instance
    // Check if the bound handler exists to avoid re-binding
    if (!this.handleFileInputChangeBound) {
        this.handleFileInputChangeBound = this.handleFileInputChange.bind(this);
    }

    this.enhanceFileInput.addEventListener('change', this.handleFileInputChangeBound);

    }

    async handleFileInputChange(event) {
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

    this.showLoadingIndicator();

    
    // Assuming you have a method to upload and get the file path
    const uploadedFilePath = await this.uploadFileAndGetPath(file);
    if (uploadedFilePath) {
        localStorage.setItem('uploadedFilePath', uploadedFilePath); // Update the path in localStorage
    }

    this.updateImagePreviewAndShowOptions(file);
    this.hideLoadingIndicator();
    this.enhanceFileInput.value = ''; // Clear the file input after processing

    }

    async uploadFileAndGetPath(file) {
        try {
            // The upload method expects an object with a 'data' property containing the file
            const uploadResponse = await this.uploadManager.upload({ data: file });
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

    updateImagePreviewAndShowOptions(file) {
        // Hide the Enhance Image section
        document.getElementById('enhance-image-section').classList.add('hidden');
        
        // Update the image preview
        const imgPreview = document.getElementById('image-preview');
        imgPreview.src = URL.createObjectURL(file);

        // Show the image preview and enhancement options
        document.getElementById('enhance-options').classList.remove('hidden');
    }

    showLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }
    
    hideLoadingIndicator() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    async downloadProcessedImage(format, quality) {
        const storedFilePath = localStorage.getItem('uploadedFilePath');
        if (!storedFilePath) {
            alert('No file path found. Please upload an image first.');
            return;
        }

        // Show loading indicator while processing and downloading
        this.showLoadingIndicator();

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
        this.hideLoadingIndicator();
    }
}


// Create an instance of UIManager to initialize the functionality
const uiManager = new UIManager();
export { uiManager };