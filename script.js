document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.container');
    
    function hideAllSections() {
        sections.forEach(section => section.classList.add('hidden'));
    }

    function deactivateAllLinks() {
        navLinks.forEach(link => link.classList.remove('active'));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sectionId = link.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(sectionId);

            deactivateAllLinks();
            hideAllSections();

            link.classList.add('active');
            targetSection.classList.remove('hidden');
        });
    });

    const startEnhancingButton = document.getElementById('start-enhancing');
    startEnhancingButton.addEventListener('click', () => {
        // Simulate click on Enhance Image nav link
        document.querySelector('a[href="#enhance-image-section"]').click();
    });

    // Event listener for the file input within the Enhance Image section
    const enhanceFileInput = document.getElementById('enhance-file-input');
    document.getElementById('enhance-images').addEventListener('click', () => {
        enhanceFileInput.click();
    });

    enhanceFileInput.addEventListener('change', (event) => {
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
});
