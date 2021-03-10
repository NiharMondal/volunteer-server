const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID


const app = express()
app.use(express.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.kpq4d.mongodb.net/volunteer-network?retryWrites=true&w=majority`;


const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`server connected on ${PORT}`));

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer-network").collection("events");
  const volunteerCollection = client.db("volunteer-network").collection("volunteer");
  // perform actions on the collection object
  console.log("db connected");
  app.get('/', (req, res) => {
    res.send('i am home page')
  });
  app.get('/all-event', (req, res) => {
    eventCollection.find({})
      .toArray((err, eDocuments) => {
       res.send(eDocuments)
     })
  });

  app.post('/add-event', (req, res) => {
    eventCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  app.get('/my-event', (req, res) => {
    volunteerCollection.find(req.body.email)
      .toArray((err, myDocuments) => {
       res.send(myDocuments)
     })
  });

  app.post('/add-volunteer', (req, res) => {
    volunteerCollection.insertOne(req.body.info)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });

  app.get('/all-volunteers', (req, res) => {
    volunteerCollection.find({})
      .toArray((error, documents) => {
        res.send(documents)
      })
  });

  app.delete('/delete-volunteer', (req, res) => {
    volunteerCollection.deleteOne({ _id: ObjectID(req.headers.id) })
      .then(result => {
      
        res.send(result.deletedCount > 0)
      });
  });

  app.delete('/cancel-event', (req, res) => {
    volunteerCollection.deleteOne({ _id: ObjectID(req.body.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  });

});