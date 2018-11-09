'use strict'

let modbus = require('jsmodbus')
let Serialport = require('serialport')
let socket = new Serialport('COM5', {
  baudRate: 9600,
  Parity: 'none',
  stopBits: 1,
  dataBits: 8
})

// set Slave PLC ID
let client = new modbus.client.RTU(socket, 1)
  console.log("PASO 1");
socket.on('open', function () {
  console.log("PASO 2");
  client.readInputRegisters(4, 1).then(function (resp) {
    console.log(resp);
      console.log("PASO 3");
    socket.close();
  }, function (err) {
    console.log(err)
    socket.close()
  })
}, function (err) {
  console.log(err)
  socket.close()
})

socket.on('error', function (err) {
  console.log(err)
})
