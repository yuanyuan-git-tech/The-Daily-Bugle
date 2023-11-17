const express = require("express");
const cors = require("cors");
const {MongoClient} = require("mongodb");
const mongoURI = "mongodb://mongodb:27017";
const client = new MongoClient(mongoURI);
const {ObjectId} = require('mongodb');
const multer = require('multer');
const path = require('path');


const port = 3000;
const host = '0.0.0.0';
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
}));

app.listen(port, host, () => console.log(`Server running on http://${host}:${port}`));

app.get("/", async (request, response) => {
    try {
        await client.connect();
        const db = client.db("dailybugle");
        const collection = db.collection("article");
        const results = await collection.find().toArray();
        response.send(results);
    } catch (error) {
        console.error(error);
        response.status(500).json({error: 'Internal Server Error'});
    } finally {
        await client.close();
    }
})

app.post("/addStory", async (request, response) => {
    try {
        let articleData = request.body;
        await client.connect();
        const db = client.db("dailybugle");
        const collection = db.collection("article");
        articleData.created = new Date();
        articleData.last_edited = new Date();
        const result = await collection.insertOne(articleData);
        if (result.insertedId) {
            return response.status(201).json({message: 'Post article successfully'});
        } else {
            return response.status(500).json({error: 'Can not add article into database'});
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({error: 'Can not add article into database'});
    } finally {
        await client.close();
    }
})


app.post("/addComment", async (request, response) => {
    try {
        const {commentData, articleId} = request.body;
        const objectIdArticleId = new ObjectId(articleId);
        await client.connect();
        const db = client.db("dailybugle");
        const collection = db.collection("article");
        const result = await collection.updateOne({_id: objectIdArticleId}, {$push: {comments: commentData}});
        if (result.matchedCount === 1) {
            response.status(201).json({message: 'Comment appended successfully'});
        } else {
            response.status(404).json({error: 'Document not found'});
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({error: 'Can not append comment'});
    } finally {
        await client.close();
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({storage: storage});

app.post('/upload', upload.single('image'), (req, res) => {
    res.send('File uploaded!');
});

app.get('/image/:filename', (req, res) => {
    const imageName = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', imageName);

    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
})








