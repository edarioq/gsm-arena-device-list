const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

const devicesFilePath = config.FILES.DEVICES_JSON;

const updateDeviceImagesAndFlattenStructure = async () => {
  try {
    // Read the devices.json file
    const devicesFile = await fs.readFile(devicesFilePath, 'utf-8');
    const devicesData = JSON.parse(devicesFile);

    // Create a new array to hold the flattened structure
    const flattenedData = [];

    // Iterate over each brand in the data array
    for (const brand of devicesData.data) {
      if (brand.device_list && Array.isArray(brand.device_list)) {
        // Iterate over each device in the device_list
        for (const deviceObj of brand.device_list) {
          if (deviceObj.device_image && deviceObj.key) {
            // Extract the file extension from the existing device_image URL
            const ext = path.extname(deviceObj.device_image);
            // Replace slashes with dashes in the key value
            const normalizedKey = deviceObj.key.replace(/\//g, '-');
            // Update the device_image with the new value
            deviceObj.device_image = `${normalizedKey}${ext}`;
          }
          // Add the device to the flattened data array
          flattenedData.push(deviceObj);
        }
      }
    }

    // Replace the original data array with the flattened data
    devicesData.data = flattenedData;

    // Save the updated data back to devices.json
    await fs.writeFile(devicesFilePath, JSON.stringify(devicesData, null, 2));
    console.log(
      'Device structure flattened and device_image properties updated successfully.',
    );
  } catch (error) {
    console.error(
      'Error updating device_image properties and flattening structure:',
      error,
    );
  }
};

// Trigger the function if the script is run via CLI
if (require.main === module) {
  updateDeviceImagesAndFlattenStructure();
}
