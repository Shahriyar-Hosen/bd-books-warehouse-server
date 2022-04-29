const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const objectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// ---------------------------

// async await function
async function run() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.hmt2r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  // try catch finally
  try {
    await client.connect();
    const inventoryCollection = client.db("warehouse").collection("inventory");

    // Get Method to read all items
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventory = await cursor.toArray();
      res.send(inventory);
    });
    // -------------------------------------------

    // Create POST Method items api
    app.post("/inventory", async (req, res) => {
      const newInventory = req.body;
    //   console.log("New inventory adding ", newInventory);
      const result = await inventoryCollection.insertOne(newInventory);
      console.log(`Inventory insert with id: ${result.insertedId}`);
      res.send({ result: "success" });
    });
    // --------------------------------------------------------
  } finally {
  }
}

run().catch(console.dir);
// --------------------------------------------

// http://localhost:5000/
app.get("/", (req, res) => {
  res.send("DB Books Warehouse Server Running");
});

app.listen(port, () => {
  console.log(`DB Books Warehouse Server port ${port}`);
});
