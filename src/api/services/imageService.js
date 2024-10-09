const ImageRequest = require("../models/ImageRequestModel");

// Insert new image request in the database
const insertImageRequest = async (
  requestId,
  serialNumber,
  productName,
  inputImageUrls
) => {
  try {
    const newRequest = new ImageRequest({
      requestId,
      serialNumber,
      productName,
      inputImageUrls,
    });
    await newRequest.save();
  } catch (error) {
    console.error("Error inserting image request:", error);
  }
};

// Update image request with output URLs after processing
const updateImageRequest = async (requestId, outputImageUrls) => {
  try {
    await ImageRequest.findOneAndUpdate(
      { requestId },
      { outputImageUrls, status: "completed" },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating image request:", error);
  }
};

module.exports = { insertImageRequest, updateImageRequest };
