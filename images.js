const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const https = require('https');
const config = require('./config');

const devicesFilePath = config.FILES.DEVICES_JSON;
const imagesDirectory = config.DIRECTORIES.IMAGES;

// Ensure the images directory exists
const ensureDirectoryExists = async (dir) => {
  try {
    await fsPromises.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory: ${dir}`, error);
  }
};

// Function to check if a file with the key (ignoring extension) already exists
const imageExists = async (key) => {
  const files = await fsPromises.readdir(imagesDirectory);
  const normalizedKey = key.replace(/\//g, '-'); // Replace slashes with dashes
  return files.some((file) => path.parse(file).name === normalizedKey);
};

// Function to download and save the image with the "key" as the file name
const downloadImage = (url, key) => {
  const ext = path.extname(url);
  const fileName = `${key.replace(/\//g, '-')}${ext}`; // Replace slashes in the key with dashes
  const filePath = path.join(imagesDirectory, fileName);
  const file = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        } else {
          reject(
            new Error(
              `Failed to download image: ${url}. Status Code: ${response.statusCode}`,
            ),
          );
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// Function to process and download images
const processImages = async () => {
  try {
    // Ensure images directory exists
    await ensureDirectoryExists(imagesDirectory);

    // Read devices.json file
    const devicesFile = await fsPromises.readFile(devicesFilePath, 'utf-8');
    const devicesData = JSON.parse(devicesFile);

    // Iterate over devices and download images
    for (const device of devicesData.data) {
      if (device.device_list && Array.isArray(device.device_list)) {
        for (const deviceObj of device.device_list) {
          if (deviceObj.device_image && deviceObj.key) {
            const key = deviceObj.key; // Use the key as the file name
            const imageUrl = deviceObj.device_image;

            // Check if the image already exists
            const exists = await imageExists(key);

            if (!exists) {
              try {
                await downloadImage(imageUrl, key);
                console.log(`Downloaded image for key: ${key}`);
              } catch (err) {
                console.error(`Failed to download image for key: ${key}`, err);
              }

              // Add a small delay (e.g., 1 second) between downloads to avoid overwhelming the server
              await sleep(1000);
            } else {
              console.log(
                `Image for key: ${key} already exists. Skipping download.`,
              );
            }
          }
        }
      }
    }

    console.log('Images downloaded successfully where necessary.');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

// Helper function to add a delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Trigger the function if the script is run via CLI
if (require.main === module) {
  processImages();
}
