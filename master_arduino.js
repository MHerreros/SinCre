'use strict'

let modbus = require('jsmodbus')
let Serialport = require('serialport')
let socket = new Serialport('COM5', {
  baudRate: 57600,
  Parity: 'none',
  stopBits: 1,
  dataBits: 8
})

// set Slave PLC ID
let client = new modbus.client.RTU(socket, 1)

socket.on('connect', function () {
  client.readInputRegister(2, 1).then(function (resp) {
    console.log(resp)
    socket.close()
  }, function (err) {
    console.log(err)
    socket.close()
  })
})

socket.on('error', function (err) {
  console.log(err)
})
