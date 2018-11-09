// 'use strict'
//
// let modbus = require('jsmodbus')
// let Serialport = require('serialport')
// let socket = new Serialport('COM3', {
//   baudRate: 9600,
//   Parity: 'none',
//   stopBits: 1,
//   dataBits: 8
// })
//
// const write = () => {
//   client.readInputRegisters(1, 1).then(function (resp) {
//     console.log(resp);
//       console.log("PASO 3");
//     socket.close();
//   }, function (err) {
//     write();
//     console.log(err)
//   })
// }
// // set Slave PLC ID
// let client = new modbus.client.RTU(socket, 1)
//   console.log("PASO 1");
// socket.on('open', function () {
//   console.log("PASO 2");
//   write();
// }, function (err) {
//   console.log(err)
//   socket.close()
// })
//
// socket.on('error', function (err) {
//   console.log(err)
// })

const SerialPort = require('serialport');
const {ModbusMaster, DATA_TYPES} = require('modbus-rtu');

//create serail port with params. Refer to node-serialport for documentation
const serialPort = new SerialPort("COM3", {
   baudRate: 9600
});

//create ModbusMaster instance and pass the serial port object
const master = new ModbusMaster(serialPort, {
  responseTimeout: 500,
  debug: true
});

//Read from slave with address 1 four holding registers starting from 0.
master.writeSingleRegister(1, 0, 1).then((data) => {
    //promise will be fulfilled with parsed data
    console.log("DATA: ", data); //output will be [10, 100, 110, 50] (numbers just for example)
    master.readHoldingRegisters(1, 0,1, DATA_TYPES.UINT).then((data) => {
    // data will be treat as unsigned integer
    console.log(data); //output will be [20, 100, 110, 50] (numbers just for example)
});
}, (err) => {
  console.log(err);
    //or will be rejected with error
});
