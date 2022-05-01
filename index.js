const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
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

    // heroku API
    // https://quiet-sierra-51150.herokuapp.com/

    // Get Method to read all items
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventory = await cursor.toArray();
      res.send(inventory);
    });
    // -------------------------------------------

    // Get  AP to Read by ID
    // https://quiet-sierra-51150.herokuapp.com/inventory/626cfe0723570fa333ec7729
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.findOne(query);
      res.send(result);
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

    //  Update Item Quantity data in db
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updateItem = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: updateItem,
      };
      const result = await inventoryCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });
    // -------------------------------------------

  } finally {
  }
}

run().catch(console.dir);
// --------------------------------------------


app.get("/", (req, res) => {
  res.send("DB Books Warehouse Server Running");
});

app.listen(port, () => {
  console.log(`DB Books Warehouse Server port ${port}`);
});
