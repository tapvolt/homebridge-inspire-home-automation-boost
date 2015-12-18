var request = require('request');
var parseString = require('xml2js').parseString;
var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory(
		'homebridge-inspire-home-automation', 
		'Thermostat', 
		ThermostatAccessory
	);
}

function ThermostatAccessory(log, config) {		
	this.endpoint = {
		url: 'https://www.inspirehomeautomation.co.uk/client/api1_3_1/api.php',  
		header: {
     		'cache-control': 'no-cache',
     		'content-type': 'multipart/form-data;' 
     	}   	
	};
	this.config = config;	
	this.name = config['name'];
	
	this.log = log;
	this.log('Inspire Home Automation Thermostat');
	this.log('Device Id:', this.config.device_id);
	
	this.service = new Service.Thermostat(this.name);		
	this.service.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
		.on('get', this.getCurrentHeatingCoolingState.bind(this));
	this.service.getCharacteristic(Characteristic.TargetHeatingCoolingState)
		.on('get', this.getTargetHeatingCoolingState.bind(this))
		.on('set', this.setTargetHeatingCoolingState.bind(this));
	this.service.getCharacteristic(Characteristic.CurrentTemperature)
		.on('get', this.getCurrentTemperature.bind(this));
	this.service.getCharacteristic(Characteristic.TargetTemperature)
		.on('get', this.getTargetTemperature.bind(this))
		.on('set', this.setTargetTemperature.bind(this));
	this.service.getCharacteristic(Characteristic.TemperatureDisplayUnits)
		.on('get', this.getTemperatureDisplayUnits.bind(this));

    /*
     We are only switching between On and Off
     1 = Off
     2 = Program 1
     3 = Program 2
     4 = Both
     5 = On
     6 = Boost
     */
    this.setFunctionHelper = function(on) {
        var state = on == 1 ? 5 : 1;
        this.log('Inspire Home Automation set_function value', state);
        return state;
    }
}

ThermostatAccessory.prototype.getCurrentHeatingCoolingState = function(callback) {

}

ThermostatAccessory.prototype.getTargetHeatingCoolingState = function(callback) {

}

ThermostatAccessory.prototype.setTargetHeatingCoolingState = function(on, callback) {	
	this.log('setTargetHeatingCoolingState', on);
	var options = { 
		method: 'POST',
  		url: this.endpoint.url,
  		headers: this.endpoint.header,
  		formData: { 
  			action: 'send_message',
     		apikey: this.config.apikey,
     		key: this.config.key,
     		device_id: this.config.device_id,
     		message: 'set_function',
     		value: this.setFunctionHelper(on)
     	} 
     };
	request(options, function(error, response, body) {
		this.log(body);
		callback(null, on);
	}.bind(this));
}

ThermostatAccessory.prototype.getCurrentTemperature = function(callback) {
	this.log('getCurrentTemperature')
	var options = { 
		method: 'GET',
  		url: this.endpoint.url,
  		headers: this.endpoint.header,
  		qs: { 
  			action: 'get_device_information',
     		apikey: this.config.apikey,
     		key: this.config.key,
     		device_id: this.config.device_id
     	} 
    };
    request(options, function(error, response, body) {
            var json;
            parseString(body,toString(), function (err, result) {
                json = JSON.parse(
                    JSON.stringify(result)
                );
            });
            this.log(json.xml.Device_Information[0].Current_Temperature[0]);
            callback(null, parseFloat(json.xml.Device_Information[0].Current_Temperature[0]));
    }.bind(this));
}

ThermostatAccessory.prototype.getTargetTemperature = function(callback) {

}

ThermostatAccessory.prototype.setTargetTemperature = function(temp, callback) {
    this.log('setTargetTemperature', temp);
    var options = {
        method: 'POST',
        url: this.endpoint.url,
        headers: this.endpoint.header,
        formData: {
            action: 'send_message',
            apikey: this.config.apikey,
            key: this.config.key,
            device_id: this.config.device_id,
            message: 'set_set_point',
            value_temp: Math.floor(temp)
        }
    };
    request(options, function(error, response, body) {
        this.log(body);
        callback(null, temp);
    }.bind(this));
}

ThermostatAccessory.prototype.getTemperatureDisplayUnits = function(callback) {	
    this.log('getTemperatureDisplayUnits');
    var units = Characteristic.TemperatureDisplayUnits.CELSIUS;
    var unitsName = units == Characteristic.TemperatureDisplayUnits.FAHRENHEIT ? 'Fahrenheit' : 'Celsius';
    this.log('Temperature unit for ' + this.name + ' is: ' + unitsName);
    callback(null, units);
}

ThermostatAccessory.prototype.getServices = function() {
	return [this.service];
}
