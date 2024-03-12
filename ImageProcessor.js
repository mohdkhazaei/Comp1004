

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

export async function EnhanceImage(imageUrl, Format) {
    //todo
}
