 // Import the Bytescale SDK
import Bytescale from '/bytescale-sdk';

// Initialize the SDK with your API key
const bytescale = new Bytescale('public_12a1yo32ypxc9cCHXZj5kuS1ZzDh');

// Function to handle file upload
async function uploadFile(file) {
    try {
        // Use the UploadManager API to upload the file
        const uploadManager = bytescale.getUploadManager();
        const result = await uploadManager.upload(file);

        // Handle the response
        console.log('Upload successful:', result);
        return result;
    } catch (error) {
        console.error('Error during file upload:', error);
        throw error;
    }
}