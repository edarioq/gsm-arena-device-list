const axios = require('axios');
const fs = require('fs').promises;
const config = require('./config');

// File paths
const devicesFilePath = config.FILES.DEVICES_JSON;

// Helper function to add a delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to process each key and update the file in real-time
const processKeyAndUpdateFile = async (key, deviceObj) => {
  try {
    const response = await axios.post(`${config.API_URL}`, {
      route: 'device-detail',
      key,
    });

    let models = [];

    if (response.data && response.data.data) {
      const moreSpec = response.data.data.more_specification;
      if (Array.isArray(moreSpec)) {
        for (const spec of moreSpec) {
          if (spec.title === 'Misc' && spec.data) {
            for (const misc of spec.data) {
              if (misc.title === 'Models' && Array.isArray(misc.data)) {
                models = misc.data.flatMap(model => model.split(',').map(m => m.trim())); // Extract and format models
                break;
              }
            }
          }
        }
      }
    }

    // If no models were found, set an empty array
    if (models.length === 0) {
      console.log(`No models found for key: ${key}.`);
    }

    // Add the models to the deviceObj as a comma-separated list
    deviceObj.models = models;

    // Save the updated devices.json file
    await saveDevicesFile();
    console.log(
      `Updated device ${key} with: ${models.length ? models.join(', ') : 'N/A'}`,
    );
  } catch (error) {
    console.error(`Error processing ${key}:`, error);
  }
};

// Helper function to save the updated devices.json file
let devicesData = null; // Keep the devices data in memory for performance

const saveDevicesFile = async () => {
  if (devicesData) {
    await fs.writeFile(devicesFilePath, JSON.stringify(devicesData, null, 2));
  }
};

// Main function to process devices and update models
const processDevices = async () => {
  try {
    // Read devices.json file and keep it in memory
    const devicesFile = await fs.readFile(devicesFilePath, 'utf-8');
    devicesData = JSON.parse(devicesFile);

    // Iterate over devices and process them
    for (const device of devicesData.data) {
      if (device.device_list && Array.isArray(device.device_list)) {
        for (const deviceObj of device.device_list) {
          if (deviceObj.key && !deviceObj.models) {
            // If models property doesn't exist, process the key
            await processKeyAndUpdateFile(deviceObj.key, deviceObj);

            // Add a delay between POST requests
            await sleep(1000);
          }
        }
      }
    }

    console.log('Processing completed, devices.json updated.');
  } catch (error) {
    console.error('Error processing devices:', error);
  }
};

// Trigger the function if the script is run via CLI
if (require.main === module) {
  processDevices();
}
