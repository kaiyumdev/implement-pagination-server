const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express());

console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hq31bdr.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hq31bdr.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client.db("ema-jhon").collection("products");
    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      const count = await productsCollection.estimatedDocumentCount();
      res.send({count, products});
    });

    app.post('/productsByIds', async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map((id) => ObjectId(id));
      const query = { _id: {$in: objectIds} };
      const cursor = await productsCollection.find(query)
      const products = await cursor.toArray();
      res.send(products);
    })
  } finally {
  }
}
run().catch((err) => console.error(err));
app.get("/", (req, res) => {
  res.send("Ami happy ace");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
