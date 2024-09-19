# What is it

This app makes requests to some random API I found to that acceses GSM Arena and gets an extensive list of devices with additional information. Example:

```
{
  "device_id": 12771,
  "device_name": "Galaxy S24 Ultra",
  "device_type": "5G Notch PHC sgs24u sgs24ultra galaxys24ultra",
  "device_image": "samsung_galaxy_s24_ultra-12771.jpg",
  "key": "samsung_galaxy_s24_ultra-12771",
  "models": [
    "SM-S928B",
    "SM-S928B/DS",
    "SM-S928U",
    "SM-S928U1",
    "SM-S928W",
    "SM-S928N",
    "SM-S9280",
    "SM-S928E",
    "SM-S928E/DS"
  ]
},
```

Several things need to happen to have a complete list. More below.

## How to use

Run `npm install`

Start up the app by running `node <FILE>`. Where file is the name of the file you want to run. Keep an eye on the terminal for output.

1. `node devices` creates the initial file with all the device information.
2. `node models` takes this file and modifies it by adding new properties, such as `models`, which is a list of all models available for that device. This process takes a very long time as it's making a request for each and every device.
3. `node images` takes the same file and downloads the images from the links present in the property `device_image`. Again, this process takes a while to complete.
4. `node prepare` cleans the `devices.json` file to be used in a production environment. Modify this file as needed or create your own.
