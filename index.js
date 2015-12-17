var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory(
		"homebridge-inspire-home-automation", 
		"Thermostat", 
		ThermostatAccessory
	);
}

function ThermostatAccessory(log, config) {	
	this.log = log;
	this.config = config;	
	this.name = config["name"];

	this.service = new Service.Thermostat(this.name);
	this.service
		.getCharacteristic(Characteristic.On)
		.on("set", this.setOn.bind(this));
}

// ThermostatAccessory.prototype.getOn = function(callback) {
// 	request.post({
// 		url: "https://www.inspirehomeautomation.co.uk/client/api1_3_1/api.php",
// 		formData: {
// 			action:
// 			apikiey:
// 			key:
// 			device_id:
// 			message:
// 			value: 
// 		}
// 	}, function(error, response, body) {
// 		var status = "";
// 		callback(null, status);
// 	}.bind(this));
// }

ThermostatAccessory.prototype.setOn = function(on, callback) {
	var input = on ? 1 : 0;
	request.post({
		url: "https://www.inspirehomeautomation.co.uk/client/api1_3_1/api.php",
		formData: {
			action: "send_message",

			message: "set_function",
			value: input
		}
	}, function(error, response, body) {		
		callback(null, on);
	}.bind(this));
}

ThermostatAccessory.prototype.getServices = function() {
	return [this.service];
}
