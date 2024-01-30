import { processImage } from './ImageProcessor.js';

class UIManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.container');
        this.startEnhancingButton = document.getElementById('start-enhancing');
        this.enhanceFileInput = document.getElementById('enhance-file-input');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.processImageButton = document.getElementById('processImageBtn');
        this.imagePreview = document.getElementById('image-preview');
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

    setuprResizeImagesButton() {
        this.processImageButton.addEventListener('click', () => {
            const width = this.widthInput.value;
            const height = this.heightInput.value;
            const transformationParams = {
                w: width,
                h: height
            };
            processImage(this.filePath, transformationParams)
                .then(processedImageUrl => {
                    this.imagePreview.src = processedImageUrl;
                })
                .catch(error => {
                    console.error('Image processing failed:', error);
                });
        });
    }


    setupFileInputChange() {
        this.enhanceFileInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                // Hide the Enhance Image section
                document.getElementById('enhance-image-section').classList.add('hidden');

                // Update the image preview
                const imgPreview = document.getElementById('image-preview');
                imgPreview.src = URL.createObjectURL(files[0]);

                // Show the image preview and enhancement options
                document.getElementById('enhance-options').classList.remove('hidden');
            }
        });
    }
}

// Create an instance of UIManager to initialize the functionality
new UIManager();
