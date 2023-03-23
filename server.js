const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

app.post('/api/login', async (req, res, next) => {

    var error = '';

    const { login, password } = req.body;
    
    const db = client.db();
    console.log(login);
    console.log(password);
    const results = await db.collection('Users').find({Login:login, Password:password}).toArray();
    console.log(login);
    console.log(password);
    var id = -1;
    var fn = '';
    var ln = '';
    if( results.length > 0 ) {
        id = results[0].UserID;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }
    var ret = { UserId:id, Firstname:fn, Lastname:ln, error:''};
    res.status(200).json(ret);
});

if (process.env.NODE_ENV === 'production') {
// Set static folder
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});