const express = require("express");
const cors = require('cors');
const path = require('path');

const {MongoClient} = require("mongodb");
const {request} = require("express");
const mongoURI = "mongodb://localhost:27017";
const client = new MongoClient(mongoURI);

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',
}));

const port = 3002;
app.listen(port, () => console.log(`Server is running on port ${port}`));

app.get('/', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db('dailybugle').collection('ads');
        const results = await collection.find().toArray();
        res.send(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    } finally {
        await client.close();
    }
})

app.post('/adsEvent', async (req, res) => {
    try {
        const {} = request.body;
        await client.connect();
        const adsEvent = client.db('dailybugle').collection('adsEvent');
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
})

const adsImagesDirectory = path.join(__dirname, 'adsImgs');
app.use('/adsImages', express.static(adsImagesDirectory));