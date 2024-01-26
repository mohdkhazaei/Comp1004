class UIManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.container');
        this.startEnhancingButton = document.getElementById('start-enhancing');
        this.enhanceFileInput = document.getElementById('enhance-file-input');
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
