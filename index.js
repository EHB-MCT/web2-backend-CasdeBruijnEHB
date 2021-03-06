//Back-end voor eindopdracht.
/*
Beginnend met een database op MongoDB voor alle playlists. 
Database met "Generated Playlist" & "Curated Playlist"
Dingen die er op moeten
1. Playlist ID
2. Title
3. Description
4. Foto
(5. Nummer ID's, even proberen hoe. Ook afhankelijk van Generated vs Curated)

Hoe foto er op zetten? 
1- Foto's omzetten in hexadeximaal (blobs?).
2- Of lokaal doorsturen naar express, en het PAD opslaan 
3- Cloudinary 
*/
//=================================
//MongoDB
//=================================


// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://casdb1:admin@curatedplaylists.wf8lj.mongodb.net/Playlists?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);

// The database to use
const dbName = "Playlists";

//====================
//Run express
//====================
const bodyParser = require('body-parser');
const express = require('express');
const {
    json
} = require('express/lib/response');
const fs = require("fs/promises");
const app = express()
const port = process.env.PORT || 3000;
const path = require('path');
require('dotenv').config()
const cors = require('cors');


app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/info.html'));
})


app.get('/getCuratedPlaylists', async (req, res) => {
    let val = await getCuratedPlaylist();
    res.send(val)
})
app.get('/getGeneratedPlaylists', async (req, res) => {
    let val = await getGeneratedPlaylist();
    res.send(val)
})

app.post('/postNewCuratedPlaylist', async (req, res) => {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const col = client.db('Playlists').collection('Curatedplaylists');

        // Construct a document
        console.log(req.body)
        let playlistdocument = {
            playlistID: req.body.playlistID,
            title: req.body.title,
            description: req.body.description,
            imageurl: req.body.imageurl
        }
        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(playlistdocument);
        // Find one document
        res.status(201).json(playlistdocument);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
})

app.post('/postNewGeneratedPlaylist', async (req, res) => {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const col = client.db('Playlists').collection('GeneratedPlaylists');

        // Construct a document
        console.log(req.body)
        let playlistdocument = {
            playlistID: req.body.playlistID,
            title: req.body.title,
            description: req.body.description,
            imageurl: req.body.imageurl,
            mainCategory: req.body.mainCategory,
            score: req.body.score
        }
        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(playlistdocument);
        // Find one document
        res.status(201).json(playlistdocument);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
})

app.delete('/getCuratedPlaylists/:id', async (req, res) => {
    try {
        //connect to the db
        await client.connect();

        //retrieve the challenges collection data
        const col = client.db('Playlists').collection('Curatedplaylists');
        console.log("PARAMS", req.params)
        // Validation for double challenges
        let result = await col.deleteOne({
            _id: ObjectId(req.params._id)
        });
        //Send back successmessage
        res.status(201).json(result);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})




//================================
//Function to add items
//================================
async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        // Use the collection "people"
        const col = db.collection("Curatedplaylists");
        // Construct a document                                                                                                                                                              
        let playlistdocument = {
            playlistID: "Test MongoDB",
            title: "test title",
            description: "Playlist description",
            image: "imagelink"
        }
        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(playlistdocument);
        // Find one document
        const myDoc = await col.findOne();
        // Print to the console
        console.log(myDoc);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}
//run().catch(console.dir);


//================================
//Function to get db
//================================
async function getGeneratedPlaylist() {
    let val = await getPlaylist("GeneratedPlaylists").catch(console.error);
    return val;
}


async function getCuratedPlaylist() {
    let val = await getPlaylist("Curatedplaylists").catch(console.error);
    return val;
}
//getCuratedPlaylist();

async function getPlaylist(typePlaylist) {
    try {
        //connecting
        await client.connect();
        const db = client.db(dbName);
        //Get right items out of right collection
        const items = await db.collection(typePlaylist).find().toArray();
        items.forEach((item, i) => {
            //console.log(item.title)
        })
        //console.log(arrItems)

        return items;

    } catch (error) {
        console.log("Something went wrong!")
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong!',
            value: error
        })
    } finally {
        await client.close();
    }
}