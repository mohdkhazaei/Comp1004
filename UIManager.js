import { processFile, downloadFileWithFormat } from './ImageProcessor.js';

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
        
    
        downloadBtn.addEventListener('click', () => {
            const selectedFormat = outputFormat.value;
            downloadFileWithFormat(selectedFormat);
        });

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
       

    }

    setupNavLinks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const sectionId = link.getAttribute('href').replace('#', '');
                const targetSection = document.getElementById(sectionId);

                this.deactivateAllLinks();
                this.hideAllSections();

                link.classList.add('active');
                targetSection.classList.remove('hidden');
            });
        });
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
        document.getElementById('enhance-images').addEventListener('click', () => {
            this.enhanceFileInput.click();
            
        });
    }

   


    setupFileInputChange() {
        this.enhanceFileInput.addEventListener('change', async (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                this.showLoadingIndicator(); // Show loading indicator
                
                try {
                    const { fileUrl, filePath } = await this.uploadManager.upload({ data: files[0] });
                    localStorage.setItem('uploadedFilePath', filePath); // Save to localStorage
                    // Update the image preview and show enhancement options
                    this.updateImagePreviewAndShowOptions(files[0]);
                } catch (e) {
                    alert(`Error:\n${e.message}`);
                }

                this.hideLoadingIndicator(); // Hide loading indicator
            }
        });
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