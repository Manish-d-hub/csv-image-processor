# Image CSV Processor

This project is a backend service that accepts a CSV file containing product data and image URLs, asynchronously processes and compresses the images, and stores the results. The system provides an API to check the processing status and retrieve the compressed image URLs.

## Features

- Accepts a CSV file with product information and image URLs.
- Asynchronously downloads and compresses images.
- Stores image processing status and results in MongoDB.
- Provides a status API to check the progress of image processing.
- Handles large image URLs and compresses images to 50% quality.

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB**
- **Multer** (for file uploads)
- **Sharp** (for image processing)
- **Axios** (for downloading images from URLs)
- **CSV Parser** (for parsing CSV files)

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/image-csv-processor.git
cd image-csv-processor
```
