// utils/imageUtils.js
const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Function to sanitize the URL to a valid file name
const sanitizeFileName = (url) => {
  const parsedUrl = new URL(url);
  const fileName = path.basename(parsedUrl.pathname);
  // Limit the file name length to 100 characters (or any suitable length)
  return fileName.length > 20 ? `cmpi-${Date.now()}` : fileName;
};

// Function to download and compress the image
const compressImage = async (url, outputDir) => {
  try {
    const fileName = sanitizeFileName(url); // Sanitize file name
    const outputPath = path.join(outputDir, fileName);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Download the image
    const response = await axios({
      url,
      responseType: "stream",
    });

    // Save the image to the output directory
    const imageStream = fs.createWriteStream(outputPath);
    response.data.pipe(imageStream);

    await new Promise((resolve, reject) => {
      imageStream.on("finish", resolve);
      imageStream.on("error", reject); // Handle file write errors
    });

    // Compress the image using Sharp
    const compressedImagePath = `${outputPath}-compressed.jpg`;
    await sharp(outputPath)
      .jpeg({ quality: 50 }) // Compress the image to 50% quality
      .toFile(compressedImagePath);

    return compressedImagePath;
  } catch (error) {
    console.error("Error during image compression:", error);
    throw error;
  }
};

module.exports = { compressImage };
