
var express = require('express');
var app = express();
var greenBean = require("green-bean");
var SerialPort = require("serialport").SerialPort



//simple way of caching all the data
var CACHE_greenbean_machineStatus = {};
var CACHE_arduino_message = {};

var serialPort = new SerialPort("/dev/tty.usbmodem1411", {
  baudrate: 9600
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    CACHE_arduino_message = {"message" : data};
  });
});


//express stuff
app.get('/greenbean/machineStatus', function (req, res) {
  res.send(CACHE_greenbean_machineStatus);
});

app.get('/arduino/message', function (req, res) {
  res.send(CACHE_arduino_message);
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

//green bean stuff
greenBean.connect("laundry", function(laundry){

    console.log("connected to laundry machine.");

    // https://github.com/GEMakers/gea-plugin-laundry#laundrymachinestatus
    laundry.machineStatus.subscribe(function (value) {
        console.log("machineStatus:", value);
        CACHE_greenbean_machineStatus = {"machineStatus" : value};
    });
});






