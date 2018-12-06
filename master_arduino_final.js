const SerialPort = require('serialport');
const {ModbusMaster, DATA_TYPES} = require('modbus-rtu');
var MongoClient=require('mongodb').MongoClient
const {ObjectId} = require('mongodb');

var url="mongodb://172.22.37.143:27017/"

//create serail port with params. Refer to node-serialport for documentation
const serialPort = new SerialPort("COM3", { //Se etsablece un puerto para comunicación Serial. EN este caso el puerto COM3 y con un BAUDRATE (frecuencia a la que se transmite la información)
   baudRate: 9600
});

//create ModbusMaster instance and pass the serial port object
const master = new ModbusMaster(serialPort, { //Se establece una comunicación a traves del puerto serial ya establecido
  responseTimeout: 500,
  debug: true
});

setInterval(function(){ //Esta funcion tiene dos parametros: una funcion y un tiempo. Cada determinado tiempo (1500), se ejecuta la funcion.

//Read from slave with address 1 four holding registers starting from 0.
master.writeSingleRegister(1, 0, 1).then((data) => {//Si bien necesitamos leer y no escribir, es necesario poner esta función ya que nos permite hacer un RE-DO, cosa que la funcion para leer no posee.
    //promise will be fulfilled with parsed data
    console.log("DATA: ", data); //output will be [10, 100, 110, 50] (numbers just for example)
    master.readHoldingRegisters(1, 0,1, DATA_TYPES.UINT).then((data) => {//Funcion que lee la información que birnda el Slave. Lee el SLAVE 1, desde el registro 0 hasta el 1. Y los datos que toma los interpreta como Unsigned Integer
    // data will be treat as unsigned integer
    //Cuando recibe el DATA del slave, lo inserta en la base de datos.
    MongoClient.connect(url, function(err,db){
      if (err) throw err;
      //accedo a la base de datos antiguamente creada
      var dbo=db.db("speedDB");
      var myobj= {speed:data, date:Date.now()}; //Creo un objeto que tiene un atributo que contiene el dato de volicidad que me traje del slave y la fecha
      console.log(myobj);
      //accedo a la collection e inserto un elemento
      dbo.collection("speed").insertOne(myobj, function(err,response){//Inserto el objeto nuevo en la base de datos
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
    //Prueba
});
}, 1500);
