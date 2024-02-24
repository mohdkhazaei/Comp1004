export async function processFile(apiKey, accountId, storedFilePath,outputFormat, quality) {
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



export async function downloadFileWithFormat(format, storedFilePath) {
  
  const filePath = storedFilePath;
  const accountId = "12a1yo3"; 
  const apiKey = "public_12a1yo32ypxc9cCHXZj5kuS1ZzDh"; 

 
  const downloadUrl = `https://api.bytescale.com/download/${accountId}${filePath}?apiKey=${apiKey}&format=${format}`;

  // Trigger the download
  fetch(downloadUrl)
      .then(response => response.blob())
      .then(blob => {
          
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = `downloaded_file.${format}`; 
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
      })
      .catch(error => console.error('Download failed:', error));
}



