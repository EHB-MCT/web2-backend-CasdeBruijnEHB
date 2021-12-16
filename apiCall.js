"use strict";
//Een token ophalen bij het laden van de webpagina.
//Knoppen toewijzen
let buttonFollow = document.getElementById("btnTwo");
let buttonCreate = document.getElementById("btnOne");
let buttonAuthen = document.getElementById("btnThree");

buttonCreate.addEventListener("click", function () {
    //requestUserAuth("Create");
    console.log("Click create")
    getReturnAccessToken(window.location.hash);
    createPlaylist(token, userId, parametersArray[0]);

})
buttonFollow.addEventListener("click", function () {
    //requestUserAuth("Follow");
    console.log("Click follow")
    getReturnAccessToken(window.location.hash);
    followPlaylist(token, playlistIdFollow, parametersArray[0]);
})
buttonAuthen.addEventListener("click", function () {
    getToken()
    requestUserAuth();
})


//EXTRA Authorization Spotify variabelen
const redirect_url_afterlogin = "http://127.0.0.1:5500/index.html";
//const scopes = ["playlist-modify-public", "playlist-modify-private"]; //playlist-modify-public voor follow a playlist
const scopes = ["playlist-modify-public", "playlist-modify-private", "user-read-private", "user-read-email", "ugc-image-upload"]; //Scopes met get Current user data (ID)
const spotify_authorize_endpoint = "https://accounts.spotify.com/authorize";
const space_delimiter = "%20";
const scopes_url_parm = scopes.join(space_delimiter);


//APP Spotify
//General declaraties
const clientId = '3b5e1281fd2a4f4a85feb85c9326513a';
const clientSecret = '9e9b58417cdf4969a3f4e7885765f7f9';
let token = "";
let userId = "119096959"; //Test user ID, van mij (Cas)
let playlistIdFollow = "37i9dQZF1DX1kfybUJZB6S";

let createdPlaylistID;



getToken()
async function getToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    //console.log("data", data);
    token = data.access_token;
}


//========================================================================
//AUTHENTICATION USER
//========================================================================
export function requestUserAuth(requestType) {
    //Er wordt een request type meegegeven voor te weten welke functie dan moet worden opgeroepen
    //Kan voor te volgen (FollowPlaylist), voor te maken zijn (createPlaylist)
    let url = `${spotify_authorize_endpoint}?client_id=${clientId}&redirect_uri=${redirect_url_afterlogin}&scope=${scopes_url_parm}&response_type=token&show_dialog=true`;
    window.location.replace(url);
    console.log("click login");



    if (window.location.hash) {
        getReturnAccessToken(window.location.hash);
    }

}

let parametersArray = [];
async function getReturnAccessToken(url) {
    console.log("Return access");
    const stringNaHashtag = url.substring(1);
    const paramatersURL = stringNaHashtag.split('&');
    for (let i = 0; i < paramatersURL.length; i++) {
        let parasplit = paramatersURL[i].split("=");
        //Eerst splitten op basis van de "=" teken.
        //Daarna ENKEL de waarden in de array zetten.
        //In deze volgorde; eerst access_token, daarna token_type, daarna expires_in
        parametersArray.push(parasplit[1]);
    }
}


//========================================================================
//Following & liking playlists, adding tracks & covers
//========================================================================
async function followPlaylist(token, playlistID, accesstoken) {
    console.log("Click follow!", accesstoken);

    //Like playlist
    const result2 = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/followers`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accesstoken
        }
    });
    //rare error? 
    const data2 = await result2.json();
    console.log("Follow playlist", data2);
}


//VOOR PLAYLIST TOE TE VOEGEN. EERST PROBEREN GEWOON TE VOLGEN

async function createPlaylist(token, userID, accessToken) {
    console.log("id", userID);
    console.log("accesstoken", accessToken);
    //Create playlist
    const result = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            "name": "Stumble Library: Whatevvva evva",
            "description": "A stumble playlist for reading. Curated by Cas d. B.",
            "public": true
        })
    });
    const data = await result.json();
    let playlistId = data.id;
    //this.createdPlaylistID = data.id;
    console.log("Create", data);





    //Add tracks
    addTracks(accessToken, playlistId, userID);

    //Add cover - Werkt nog niet
    addCover(accessToken, playlistId, userID);


}


async function addCover(accessToken, playlistId, userID) {
    //let im = new Image();
    //im.src = ('./CuratedCover_DancingV2.png');
    //let imagesource = im.src;
    let imagesource = "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="


    const result2 = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: imagesource

    });
    const data2 = await result2.json();
    console.log("FOto", data2);
}


async function addTracks(accessToken, playlistId, userID) {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            "uris": ["spotify:track:3aUviSdBVbsdmH406j5GZC", "spotify:track:1ux778Ljln0QEitz2fB4PH", "spotify:track:300DUx4tdtCdGEUXR032jA"]
        })
    });
    const data = await result.json();
    console.log("Create", data);
}