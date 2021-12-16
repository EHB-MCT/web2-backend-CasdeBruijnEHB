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
const {
    MongoClient
} = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://casdb1:admin@curatedplaylists.wf8lj.mongodb.net/Playlists?retryWrites=true&w=majority";
const client = new MongoClient(url);

// The database to use
const dbName = "Playlists";

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
function getGeneratedPlaylist() {
    getPlaylist("GeneratedPlaylists").catch(console.error);
}
getGeneratedPlaylist();

function getCuratedPlaylist() {
    getPlaylist("Curatedplaylists").catch(console.error);
}
//getCuratedPlaylist();

async function getPlaylist(typePlaylist) {
    const MongoClient = require('mongodb').MongoClient;
    const client = new MongoClient(url);
    //connecting
    await client.connect();
    const db = client.db(dbName);
    //Get right items out of right collection
    const items = await db.collection(typePlaylist).find().toArray();

    items.forEach((item, i) => {
        console.log(item.title)
    })
    client.close();

}