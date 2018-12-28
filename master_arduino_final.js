const SerialPort = require('serialport');
const {ModbusMaster, DATA_TYPES} = require('modbus-rtu');
var MongoClient=require('mongodb').MongoClient
const {ObjectId} = require('mongodb');

var url="mongodb://localhost:27017/"

//create serail port with params. Refer to node-serialport for documentation
//Se etsablece un puerto para comunicación Serial. EN este caso el puerto COM3 y con un BAUDRATE (frecuencia a la que se transmite la información)
const serialPort = new SerialPort("COM3", {
   baudRate: 9600
});

//create ModbusMaster instance and pass the serial port object
//Se establece una comunicación a traves del puerto serial ya establecido
const master = new ModbusMaster(serialPort, {
  responseTimeout: 500,
  debug: true
});
//Esta funcion tiene dos parametros: una funcion y un tiempo. Cada determinado tiempo (1500), se ejecuta la funcion.
setInterval(function(){

//Read from slave with address 1 four holding registers starting from 0.
//Si bien necesitamos leer y no escribir, es necesario poner esta función ya que nos permite hacer un RE-DO, cosa que la funcion para leer no posee.
master.writeSingleRegister(1, 0, 1).then((data) => {
    console.log("DATA: ", data);
    master.readHoldingRegisters(1, 0,1, DATA_TYPES.UINT).then((data) => {
    //Funcion que lee la información que birnda el Slave. Lee el SLAVE 1, desde el registro 0 hasta el 1. Y los datos que toma los interpreta como Unsigned Integer
    //Data will be treat as unsigned integer
    //Cuando recibe el DATA del slave, lo inserta en la base de datos.
    //accedo a la base de datos antiguamente creada
    //Creo un objeto que tiene un atributo que contiene el dato de volicidad que me traje del slave y la fecha
    //Accedo a la collection e inserto un elemento
    //Inserto el objeto nuevo en la base de datos
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      var dbo=db.db("speedDB");
      var myobj= {speed:data, date:Date.now()};
      console.log(myobj);
      dbo.collection("speed").insertOne(myobj, function(err,response){
        db.close();
        if (err){
          console.log(err);
        }
        else {
          console.log("Se ha insertado satisfactoriamente");
        };
      });
    });

    console.log(data);
});
}, (err) => {
  console.log(err);
});
}, 1500);
