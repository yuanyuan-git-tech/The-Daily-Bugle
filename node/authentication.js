require('dotenv').config({path: 'node/.env'});
const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');

// MongoDB database to store user information.
const {MongoClient} = require("mongodb");
const mongoURI = "mongodb://localhost:27017";
const client = new MongoClient(mongoURI);

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080',
}));

const port = 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));

// Register a new user
app.post('/register', async (request, response) => {
    const {username, password, role} = request.body;
    if (!username || !password) {
        return response.status(400).send('Username and password are required');
    }
    try {
        await client.connect();
        const userData = client.db('auth').collection('user');
        const user = await userData.findOne({username: username});
        if (user) {
            return response.status(400).send('Username is already taken');
        }
        await userData.insertOne({username: username, password: password, role: role});
        response.send('Registration successful');
    } catch (error) {

    } finally {
        await client.close();
    }
})

// Login a user, create a jwt token & refresh token and store the token in localstorage
app.post("/login", async (request, response) => {
        try {
            const {username, password} = request.body;
            if (!username || !password) {
                return response.status(400).send('Username and password are required');
            }
            await client.connect();
            const userData = client.db('auth').collection('user');
            const user = await userData.findOne({username: username, password: password});
            if (!user) {
                return response.status(401).send('Invalid username or password');
            } else {
                const payload = {username: user.username, role: user.role};
                const accessToken = generateAccessToken(payload);
                const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
                await userData.updateOne({username: username}, {$set: {refreshToken: refreshToken}});
                response.json({accessToken: accessToken, refreshToken: refreshToken, role: user.role, user: username});
            }
        } catch (error) {
            console.log(error);

        } finally {
            await client.close();
        }
    }
);

const isAuthenticated = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return response.status(401).send('Unauthorized');
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return response.status(403).send('Forbidden');
        }
        request.user = user;
    })
    next();
}

app.get('/reader', isAuthenticated, (request, response) => {
    response.sendStatus(200);
});

app.get('/author', isAuthenticated, (request, response) => {
    response.sendStatus(200);
});


function generateAccessToken(payload) {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
}

// Logout
app.post('/logout', async (request, response) => {
    try {
        await client.connect();
        const {username} = request.body;
        const userData = await client.db('auth').collection('user');
        await userData.updateOne({username: username}, {$unset: {refreshToken: 1}});
        response.sendStatus(204);
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
});


