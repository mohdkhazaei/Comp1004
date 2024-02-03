// Assuming Bytescale.FileApi is correctly imported or accessible in this context
export async function processFile(apiKey, accountId, storedFilePath, width, height) {
    const fileApi = new Bytescale.FileApi({
      apiKey: apiKey
    });
  
    try {
      const response = await fileApi.processFile({
        accountId: accountId,
        filePath: storedFilePath, // Assuming this is the correct relative path on Bytescale
        transformation: "image",
        transformationParams: {
          w: parseInt(width, 10),
          h: parseInt(height, 10),
          fit: "enlarge-cover"
        }
      });
      return response.blob(); // Convert the response to a blob
    } catch (error) {
      console.error("Error processing file:", error);
      throw error; // Rethrow or handle as needed
    }
  }
  