var express=require('express');
var cors = require('cors');
var app=express();//a express le digo a que quiero que escuche


app.use(cors());
app.use(express.json());

var array = [2, 3, 5]

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
    //la lista esta armada en docs
  });
}

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
const collectionName = "speed"

//Crear la base de datos y una collection
MongoClient.connect(url, function(err, db){
  if (err) {
    console.log('Error!',err);
  }


  var dbObject = db.db("speedDB");
  dbObject.createCollection(collectionName, function(err, response){
    if (err) {
      console.log("Error!");
    }
    else console.log("Collection created!");
    db.close();
    //el db.close es MUY importante!
  });
});


app.get('/catch', function (req, res){
  //Abrir conexion con la base de datos
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Error!', err);
    }
    //accedo a la base de datos previamente creada
    var dbo = db.db("speedDB");

    findDocuments(dbo, function(docs){
      db.close();
      //res.json(docs);
      res.json([{speed:5}, {speed:10}])
    });
  }); //cierra MongoClient
}); //cierra app.get


app.get('/liveSpeed', function (req, res){
  //Abrir conexion con la base de datos
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Error!', err);
    }
    //accedo a la base de datos previamente creada
    var dbo = db.db("speedDB");

    findDocuments(dbo, function(docs){
      db.close();
      res.json(docs);
    });
  }); //cierra MongoClient
}); //cierra app.get

app.listen(3000,function(){
  console.log('Example app listening on port 3000!');
});
