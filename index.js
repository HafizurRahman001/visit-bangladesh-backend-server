const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());



// ${process.env.DB_USER}: ${process.env.DB_PASS}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h7sw1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const allPlaceCollection = client.db("beautiful-bangladesh").collection("places");
    const userInfoCollection = client.db("beautiful-bangladesh").collection("usersInfo");
    // perform actions on the collection object

    // GET METHOD FOR GETTING DATA FROM SERVER
    app.get('/places', async (req, res) => {
        const result = await allPlaceCollection.find({}).toArray();
        res.send(result);
    });

    //GET SPECIFIC DATA BY ID
    app.get('/booking/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await allPlaceCollection.findOne(query);
        res.send(result);
    });

    //POST METHOD FOR STORE USER INFO
    app.post('/userInfo', async (req, res) => {
        const info = req.body;
        const addedUserInfo = await userInfoCollection.insertOne(info);
        res.send(addedUserInfo);
    });

    //GET SPECIFIC BOOKING INFORMATION BY GET METHOD
    app.get('/my-bookings/:email', async (req, res) => {
        const userEmail = req.params.email;
        const result = await userInfoCollection.find({ email: userEmail }).toArray();
        res.send(result)
    });

    //CANCEL BOOKING BY DELETE METHOD
    app.delete('/cancel-booking/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const cancelBooking = await userInfoCollection.deleteOne(query);
        res.send(cancelBooking);
    });

    //GET ALL DATA OF BOOKING USERS BY GET METHOD
    app.get('/all-booking-users', async (req, res) => {
        const allBookingUsers = await userInfoCollection.find({}).toArray();
        res.send(allBookingUsers);
    });

    //ADD NEW PLACE TO SERVER BY GET POST METHOD
    app.post('/add-new-place', async (req, res) => {
        const query = req.body;
        const addPlace = await allPlaceCollection.insertOne(query);
        res.send(addPlace);
    });

    //DELETE USER 
    app.delete('/delete-user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const deletedUser = await userInfoCollection.deleteOne(query);
        res.send(deletedUser);
    });


    // UPDATE APPROVED USING PUT METHOD
    app.put('/approved/:id', async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true } //optional;
        const updateStatus = {
            $set: {
                status: 'Approved',
            },
        };
        const result = await userInfoCollection.updateOne(filter, updateStatus, options);
        res.send(result)
    })








});


app.get('/', (req, res) => {
    res.send('welcome home page');
});


app.listen(port, () => {
    console.log('surver running on port:', port);
});
