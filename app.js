var express=require('express');
var cors = require('cors');
var app=express();//a express le digo a que quiero que escuche

app.use(cors());
app.use(express.json());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//Crear la base de datos y una collection
MongoClient.connect(url, function(err, db){
  if (err) {
    console.log('Error!',err);
}

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

var dbObject = db.db("speedDB");
dbObject.createCollection("speed", function(err, response){
  if (err) {
    console.log("Error!");
  }
  else console.log("Collection created!");
  db.close();
  //el db.close es MUY importante!
});
});


app.get('/catch', function (req, res){
  var speedArray = []; //Array vacio donde vamos a incluir las velocidades medidas.
  var arduinoSpeed =; //req.body.message;  //DATO DEL ARDUINO

  speedArray.push (arduinoSpeed) //agrego el valor recibido al array.
  console.log (speedArray)

//Para eliminar datos del array
//n define la cantidad de elementos a eliminar,
//de esa posicion(pos) en adelante hasta el final del array.
  var pos = 1, n = speedArray.length-10 ;
  var elementosEliminados = speedArray.splice(pos, n);
  console.log(speedArray);

  //list.push(inputValue);
  //console.log(req.body);
  //console.log(list);

  //Abrir conexion con la base de datos
  MongoClient.connect(url, function (err, db) {
    if (err) throw error;
    //accedo a la base de datos previamente creada
    var dbs = db.db("speedDB");
  }

    //var myobj = {mensaje:req.body.message};

    //accedo a la collection e inserto un Elemento
    dbo.collection("speed").insertOne(myobj, function(err, response){
      console.log("1 document inserted");
      db.close();
      if (err){
        res.json({message: 'error!'});
      }
      else {
        res.json({message: 'ok!'});
      }
    });
  });

});

app.listen(3000,function(){
  console.log('Example app listening on port 3000!');
});
