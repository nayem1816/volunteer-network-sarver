const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5055;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqckf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");


  app.get("/events", (req, res) => {
    eventCollection.find()
    .toArray((err, items) => {
      res.send(items);
      // console.log('Db Items', items);
    })
  })



  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event", newEvent);
    eventCollection.insertOne(newEvent)
    .then(result => {
      console.log('Inserted Count',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/deleteEvent/:id', (req, res) => {
    const id = ObjectId(req.params);
    console.log("Object Id is ", id);
    eventCollection.findOneAndDelete({_id: id})
    .then(document => res.send(document.value))
  })
  // client.close();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})