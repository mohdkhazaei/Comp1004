// Get references to the button and the file input
const selectImagesButton = document.getElementById('select-images');
const fileInput = document.getElementById('file-input');

// Add event listener to the button
selectImagesButton.addEventListener('click', function() {
    // Trigger the file input click event
    fileInput.click();
});

// Optional: Handle file selection
fileInput.addEventListener('change', function(event) {
    // You can access the selected files with 'event.target.files'
    const files = event.target.files;
    console.log(files);

    // TODO: Handle the files
    // For example, you could preview the selected image or upload it to a server
});