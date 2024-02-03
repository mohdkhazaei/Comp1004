import { UIManager } from './UIManager.js';

const uiManager = new UIManager();
window.uiManager = uiManager;


document.addEventListener('DOMContentLoaded', () => {
    const uploadManager = new Bytescale.UploadManager({
        apiKey: "public_12a1yo32ypxc9cCHXZj5kuS1ZzDh" 
    });

    const onFileSelected = async event => {
        window.uiManager.showLoadingIndicator();
        const file = event.target.files[0];
        try {
            const { fileUrl, filePath } = await uploadManager.upload({ data: file });
            localStorage.setItem('uploadedFilePath', filePath); // Save to localStorage
        } catch (e) {
            alert(`Error:\n${e.message}`);
            
        }
        window.uiManager.hideLoadingIndicator();
    };
    
    const fileInput = document.getElementById('enhance-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', onFileSelected);
    }
});
