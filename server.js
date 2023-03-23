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

    const { email, password } = req.body;
    
    const db = client.db();
    console.log(email);
    console.log(password);
    const results = await db.collection('Users').find({Email:email, Password:password}).toArray();
    console.log(email);
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

app.post('/api/register', async (req, res, next) =>{  
    // incoming: FirstName, LastName, Login, Password 
    // outgoing: error  
    var error = '';  

    const { name, username, password, email, dob } = req.body; 
    
    
    
    const newUser = {Name:name, Login:username, Password:password, 
    Email:email, DOB: dob, AuthStatus:0};  
    var error = ''; 

    const db = client.db();  
    // This should ensure that only one of any username exists.
    var results = await db.collection('Users').find({ Email:email }).toArray();
    if (results.length > 0) {
        error = "Email is already in use.";
        var ret = { error: error};
        res.status(409).json(ret);
    }
    else {
        results = await db.collection('Users').find({ Login:username }).toArray();
        if (results.length > 0) {
            error = "Username already exists.";
            var ret = { error: error };
            res.status(409).json(ret);
        }
        else  {
            try {       
                db.collection('Users').insertOne(newUser, (err, response) => {
                    db.collection('Users').updateOne(
                        {_id:response.ops[0]._id},
                        {
                            $set: {Authentication: verificationCode}
                        }
                    );
                }); 
            }  
            catch(e)  
            {    
                error = e.toString();  
            }

            var ret = { error: error };      
            res.status(200).json(ret);

        } 
    }


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