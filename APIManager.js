document.addEventListener('DOMContentLoaded', () => {
    const uploadManager = new Bytescale.UploadManager({
        apiKey: "public_12a1yo32ypxc9cCHXZj5kuS1ZzDh" 
    });

    const onFileSelected = async event => {
        const file = event.target.files[0];
        try {
            const { fileUrl, filePath } = await uploadManager.upload({ data: file });
            alert(`File uploaded:\n${fileUrl}`);
        } catch (e) {
            alert(`Error:\n${e.message}`);
        }
    }

   
    const fileInput = document.getElementById('enhance-file-input');
    if (fileInput) {
        fileInput.addEventListener('change', onFileSelected);
    }
});