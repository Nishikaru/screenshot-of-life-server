const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// * lsitening to port * //
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
console.log(process.env.user)
//  creating database configuration
const url = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.jscktfi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run=async()=>{

    try{

        await client.connect().then(() => console.log("connected"));

        const database = client.db('ss-of-life');
        const userCollection = database.collection('users');

        app.post('/user',async(req,res)=>{
            const memory = req.body;
            const result =await userCollection.insertOne(memory);
            // console.log(req.body);
            res.send(result);
        })

        app.get('/user/:email',async(req,res)=>{
            const email = req.params.email
            const result = await userCollection.find({
                user:email,
                date:new Date().toLocaleDateString(),
            });
            
            const allValues = await result.toArray();
            console.log(req.params.email)
            res.send(allValues)
        })
        // memories
        app.get('/memories/:email/:mm/:dd/:yy',async(req,res)=>{
            const date = req.params.mm+'/'+req.params.dd+'/'+req.params.yy
            const email = req.params.email
            const result = await userCollection.find({
                user:email,
                date:date,
            });
            
            const allValues = await result.toArray();
            // console.log(date)
            const allData = {allValues,date}
            res.send(allData)
        })

    }catch(err){
        console.log(err)
    }

}
run();

app.get('/',async(req,res)=>{
    res.send('server connected!')
})