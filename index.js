const express=require('express');
const cors=require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://smart-db-3:nRlRsDB6eDvyuD0h@cluster0.6udrpm9.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app=express();
const port=process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('hello siam');

})


async function run() {
  try {
    
    await client.connect();
    const smartdeals3=client.db("smartdeals3");
    const mycoll=smartdeals3.collection("products");

     app.post('/products',async(req,res)=>{
         const newproduct=req.body;
         const result=await  mycoll.insertOne(newproduct);
         res.send(result);
     })
   app.delete('/products/:id',async(req,res)=>{
           const id=req.params.id;
           const query={_id: new ObjectId(id)};
           const result=await mycoll.deleteOne(query);
           res.send(result);

   })
   app.patch('/products/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const updateProduct=req.body;
    const update={
        $set:{
        name:updateProduct.name,
        prize:updateProduct.prize

        }
    }
    const result= await mycoll.updateOne(query,update);
    res.send(result);

   })
   app.get('/products',async(req,res)=>{
    const cursor=mycoll.find()
   const result= await cursor.toArray();
   res.send(result);
   })
   app.get('/products/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)};

   
   const result= await mycoll.findOne(query);
   res.send(result);
   })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
   
  }
}
run().catch(console.dir);


app.listen(port,()=>{
 console.log(`Example app listening on port ${port} `)
})
// client.connect()
// .then(()=>{
//     app.listen(port,()=>{
//  console.log(`Example app listening on  the port ${port} `)
// })
// })
// .catch(console.dir);