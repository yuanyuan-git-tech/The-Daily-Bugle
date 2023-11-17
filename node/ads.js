const express = require("express");
const cors = require('cors');
const path = require('path');

const {MongoClient} = require("mongodb");
const {request} = require("express");
const mongoURI = "mongodb://mongodb:27017";
const client = new MongoClient(mongoURI);

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

const port = 3002;
const host = '0.0.0.0'
app.listen(port, host, () => console.log(`Server running on http://${host}:${port}`));

app.get('/', async (req, res) => {
    try {
        console.log("AAA")
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
        let dataToSend = req.body;
        dataToSend.userIp = req.ip;
        dataToSend.userAgent = req.get('User-Agent');
        dataToSend.date = new Date();
        await client.connect();
        const collection = client.db('dailybugle').collection('adsEvent');
        const result = await collection.insertOne(dataToSend);
        if (result.insertedId) {
            return res.status(201).json({message: 'Post Ads Event successfully'});
        } else {
            return res.status(500).json({error: 'Can not add ads event  into database'});
        }
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
})

const adsImagesDirectory = path.join(__dirname, 'adsImgs');
app.use('/adsImages', express.static(adsImagesDirectory));