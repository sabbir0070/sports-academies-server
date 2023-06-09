const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjpgufh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
const classesCollection = client.db('sportsDB').collection('classes');
const instructorsCollection = client.db('sportsDB').collection('instructors');
const selectCollection = client.db('sportsDB').collection('select');
// All classes api data
app.post('/addClass',async(req, res)=>{
const query = req.body;
const result = await classesCollection.insertOne(query);
res.send(result);
})

app.get('/allClasses', async (req, res)=>{
const result = await classesCollection.find().toArray();
res.send(result);
})   

// add to select class api
app.post('/selectClass', async(req, res)=>{
const query = req.body;
const result = await selectCollection.insertOne(query);
res.send(result)
})

app.get('/selectClass',async(req, res)=>{
const email = req.query.email;
console.log(email)
if(!email){
res.send([]);
}
const query = { email: email }
const result = await selectCollection.find(query).toArray();
res.send(result);
})

app.delete('/selectClass/:id', async(req,res)=>{
const id = req.params.id;
const query = {_id: new ObjectId(id)}
const result = await selectCollection.deleteOne(query);
res.send(result);
})

//All instructors get data
app.get('/allInstructors', async (req, res)=>{
const result = await instructorsCollection.find().toArray();
res.send(result);
})


// Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res) =>{
res.send('Sports academies server is running')
})

app.listen(port,()=>{
console.log(`sports server is running:${port}`)
})
