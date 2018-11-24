const SerialPort = require('serialport');
const {ModbusMaster, DATA_TYPES} = require('modbus-rtu');
var MongoClient=require('mongodb').MongoClient
const {ObjectId} = require('mongodb');

var url="mongodb://172.22.33.10:27017/"

//create serail port with params. Refer to node-serialport for documentation
const serialPort = new SerialPort("COM5", {
   baudRate: 9600
});

//create ModbusMaster instance and pass the serial port object
const master = new ModbusMaster(serialPort, {
  responseTimeout: 500,
  debug: true
});

setInterval(function(){

//Read from slave with address 1 four holding registers starting from 0.
master.writeSingleRegister(1, 0, 1).then((data) => {
    //promise will be fulfilled with parsed data
    console.log("DATA: ", data); //output will be [10, 100, 110, 50] (numbers just for example)
    master.readHoldingRegisters(1, 0,1, DATA_TYPES.UINT).then((data) => {
    // data will be treat as unsigned integer
    //
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      //accedo a la base de datos antiguamente creada
      var dbo=db.db("speedDB");
      var myobj= {speed:data, date:Date.now()};
      console.log(myobj);
      //accedo a la collection e inserto un elemento
      dbo.collection("speed").insertOne(myobj, function(err,response){
        //console.log("1 document inserted");
        db.close();
        if (err){
          console.log(err);
        }
        else {
          console.log("Se ha insertado satisfactoriamente");
        };
      });
    });

    console.log(data); //output will be [20, 100, 110, 50] (numbers just for example)
});
}, (err) => {
  console.log(err);
    //or will be rejected with error
});
}, 1500);
