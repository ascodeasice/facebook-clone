const { promises } = require("fs");

const downloadImage = async (url, path) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await promises.writeFile(path, buffer);
}

module.exports = downloadImage;