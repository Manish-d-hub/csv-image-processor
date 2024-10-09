// controllers/imageController.js
const { parseCSV } = require("../utils/csvUtils");
const {
  insertImageRequest,
  updateImageRequest,
} = require("../services/imageService");
const { compressImage } = require("../utils/imageUtil");
const { v4: uuidv4 } = require("uuid");
const ImageRequestModel = require("../models/ImageRequestModel");

const uploadCSV = async (req, res) => {
  try {
    // Check if file exists in the request
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const csvData = await parseCSV(req.file.path); // Parse the CSV file
    const requestData = []; // Array to store each request's data

    for (const row of csvData) {
      const requestId = uuidv4(); // Generate a unique request ID
      const serialNumber = row["Serial Number"];
      const productName = row["Product Name"];
      const inputImageUrls = row["Input Image Urls"].split(","); // Split comma-separated URLs

      // Insert the request into MongoDB
      await insertImageRequest(
        requestId,
        serialNumber,
        productName,
        inputImageUrls
      );

      // Add the current request's data to the response array
      requestData.push({
        requestId,
        serialNumber,
        productName,
        inputImageUrls,
        status: "pending",
      });

      // Process images asynchronously (this will not block the response)
      processImagesAsync(requestId, inputImageUrls);
    }

    // Return request details immediately after CSV upload
    res.status(200).json({
      message: "CSV uploaded successfully. Image processing started.",
      requests: requestData, // Return request details (requestId, images, etc.)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to process CSV file." });
  }
};

// Asynchronous image processing function
const processImagesAsync = async (
  requestId,
  inputImageUrls,
  retryCount = 3
) => {
  const outputUrls = [];

  try {
    for (const url of inputImageUrls) {
      const compressedUrl = await compressImage(url, "./output");
      outputUrls.push(compressedUrl);
    }

    await updateImageRequest(requestId, outputUrls);
    console.log(`Image processing completed for requestId: ${requestId}`);
  } catch (error) {
    console.error(`Error processing images for requestId ${requestId}:`, error);

    if (retryCount > 0) {
      console.log(
        `Retrying image processing for requestId: ${requestId}. Retries left: ${
          retryCount - 1
        }`
      );
      return processImagesAsync(requestId, inputImageUrls, retryCount - 1); // Retry on failure
    } else {
      console.error(
        `Failed image processing for requestId: ${requestId} after multiple attempts.`
      );
    }
  }
};

const getStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const imageRequest = await ImageRequestModel.findOne({ requestId });

    if (!imageRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({
      status: imageRequest.status,
      serialNumber: imageRequest.serialNumber,
      productName: imageRequest.productName,
      outputImageUrls: imageRequest.outputImageUrls,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve status." });
  }
};

module.exports = { uploadCSV, getStatus };
