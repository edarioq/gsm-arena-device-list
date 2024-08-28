const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

const devicesFilePath = config.FILES.DEVICES_JSON;

const updateDeviceImages = async () => {
  try {
    // Read the devices.json file
    const devicesFile = await fs.readFile(devicesFilePath, 'utf-8');
    const devicesData = JSON.parse(devicesFile);

    // Iterate over each device and update the device_image
    for (const device of devicesData.data) {
      if (device.device_list && Array.isArray(device.device_list)) {
        for (const deviceObj of device.device_list) {
          if (deviceObj.device_image && deviceObj.key) {
            // Extract the file extension from the existing device_image URL
            const ext = path.extname(deviceObj.device_image);
            // Replace slashes with dashes in the key value
            const normalizedKey = deviceObj.key.replace(/\//g, '-');
            // Update the device_image with the new value
            deviceObj.device_image = `${normalizedKey}${ext}`;
          }
        }
      }
    }

    // Save the updated data back to devices.json
    await fs.writeFile(devicesFilePath, JSON.stringify(devicesData, null, 2));
    console.log('device_image properties updated successfully.');
  } catch (error) {
    console.error('Error updating device_image properties:', error);
  }
};

// Trigger the function if the script is run via CLI
if (require.main === module) {
  updateDeviceImages();
}
