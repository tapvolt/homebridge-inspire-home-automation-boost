# homebridge-inspire-home-automation-boost
Homebridge plugin for Inspire Home Automation Room Thermostat

# Installation
Follow the instruction in [homebridge](https://www.npmjs.com/package/homebridge) for the
homebridge server installation.
The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-inspire-home-automation-boost) and
should be installed "globally" by typing:

    npm install -g homebridge-inspire-home-automation-boost

# Configuration
Remember to configure the plugin in config.json in your home directory inside the
.homebridge directory.

Look for a sample config in 
[config.json example](https://github.com/tapvolt/homebridge-inspire-home-automation-boost/blob/master/config.json)

You will need to read the Inspire Home Automation [API documentation](https://www.inspirehomeautomation.co.uk/client/api.php) to retrieve the missing values (**DEVICE_ID**, **API_KEY**, **KEY**).

The **name** value in the config file is what Siri will use:
  
 *"Hey Siri, turn on the Boost"  Ok, the Boost is turned on.*
  
  *"Hey Siri, turn off the Boost"  Ok, the Boost is turned off.*
