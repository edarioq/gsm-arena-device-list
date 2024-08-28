const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const config = require('./config'); // Import the config file

// File path for saving the response data
const deviceListFilePath = config.FILES.DEVICES_JSON;

// Ensure the data directory exists
const ensureDirectoryExists = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory: ${dir}`, error);
  }
};

// Function to fetch data from the API and save it to a file
const fetchAndSaveDeviceList = async () => {
  try {
    // Ensure the data directory exists
    await ensureDirectoryExists(config.DIRECTORIES.DATA);

    // Make the GET request to the API
    const response = await axios.get(
      `${config.API_URL}${config.ROUTES.DEVICE_LIST}`,
    );

    // Save the response data to devices.json
    await fs.writeFile(
      deviceListFilePath,
      JSON.stringify(response.data, null, 2),
    );
    console.log('Data saved to devices.json');
  } catch (error) {
    console.error('Error fetching device list:', error);
  }
};

// Trigger the function if the script is run via CLI
if (require.main === module) {
  fetchAndSaveDeviceList();
}
