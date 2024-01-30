export async function processImage(filePath, transformationParams) {
const fileApi = new Bytescale.FileApi({
    apiKey: "public_12a1yo32ypxc9cCHXZj5kuS1ZzDh"
});

fileApi.processFile({
    accountId: "12a1yo3",
    filePath: "/path/to/your/uploaded/image.jpg",
    transformation: "image",
    transformationParams: {
        w: 800,
        h: 600,
        fit: "crop"
    }
})
.then(response => response.blob())
.then(imageBlob => {
    const img = new Image();
    img.src = URL.createObjectURL(imageBlob);
    document.body.appendChild(img);
})
.catch(error => console.error(error));
}