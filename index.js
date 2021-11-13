const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { json } = require('express');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyell.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("Time-Travel");
      const productsCollection = database.collection("products");
      const reviewsCollection = database.collection('Review');
      const ordersCollection = database.collection('Orders');


    app.get('/products', async (req, res) => {
        const cursor = productsCollection.find({});
        const products = await cursor.toArray();
        res.json(products);
    })
    app.get('/reviews', async (req, res) => {
        const cursor = reviewsCollection.find({});
        const reviews = await cursor.toArray();
        res.json(reviews);
    })

      //Add Orders API
      app.post('/orders', async(req, res)=>{
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.json(result);
    })

    // ADD REVIEW
    app.post('/review', async(req, res)=>{
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
  })
    // ADD PRODUCT
    app.post('/product', async(req, res)=>{
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      console.log(result);
      res.json(result);
  })

    // GET MY ORDERS
    app.get('/myOrders/:email', async(req, res) => {
      
      console.log(req.params.email)
      const result = await ordersCollection.find({email: req.params.email}).toArray();
      res.send(result);

    })

    //DELETE ORDERS API
    app.delete('/orders/:key', async(req, res) =>{
      const key1 = req.params.key;
      const query = { key : key1 };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
  })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Time Travelers!')
  })
  
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })