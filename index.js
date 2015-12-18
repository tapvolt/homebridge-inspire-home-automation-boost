var request = require('request');
var parseString = require('xml2js').parseString;
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory(
        'homebridge-inspire-home-automation-boost',
        'Boost',
        BoostAccessory
    );
}

function BoostAccessory(log, config) {
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
    this.log('Inspire Home Automation Thermostat - Boost!');
    this.log('Device Id:', this.config.device_id);

    this.service = new Service.Switch(this.name);

    this.service.getCharacteristic(Characteristic.On)
        .on('set', this.setBoost.bind(this));

    /*
     Inspire Home Automation API
     1 = Off
     2 = Program 1
     3 = Program 2
     4 = Both
     5 = On
     6 = Boost
     */
    this.setFunctionHelper = function(on) {
        this.log('Call for Boost', on);
        var state = on == 1 ? 6 : 4;
        this.log('Inspire Home Automation set_function value', state);
        return state;
    }

}

BoostAccessory.prototype.setBoost = function(on, callback) {
	this.log('setBoost', on);
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

BoostAccessory.prototype.getServices = function() {
	return [this.service];
}
