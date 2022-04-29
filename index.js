const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors')
const app= express()
const port=process.env.PORT||5000

// user : emajohn
// pass : Gcj2R0Wlfp7xVRI3
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://emajohn:Gcj2R0Wlfp7xVRI3@cluster0.tlf7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        await client.connect();
        const productCollection=client.db("emajon").collection("products")

        app.get('/products',async(req,res)=>{
            console.log(req.query)
            const page= parseInt(req.query.page)
            const size=parseInt(req.query.size)
            const query={};
            const cursor= productCollection.find(query);
            let products
            if(page||size){
                products= await cursor.skip(page*size).limit(size).toArray()
            }
            else{
                products= await cursor.toArray()
            }
            // products= await cursor.toArray()
         
            res.send(products)
        })
        app.get('/productsCount',async(req,res)=>{
            const count= await productCollection.estimatedDocumentCount()
            res.send({count})
        })
        app.post('/productsbykeys',async(req,res)=>{
            const keys=req.body;
            console.log(keys);
            const ids=keys.map(id=>ObjectId(id));
            const query={_id:{$in:ids}}
            const cursor=productCollection.find(query)
            const products = await cursor.toArray();
            res.send(products)
        })
    }
    finally{

    }

}run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('hello world')
})
app.listen(port)