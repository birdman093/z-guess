import React, {useEffect, useState} from "react";
import {AddressInUse, SpotifyAddress} from "../config/ServerConfig.mjs";
import userObj from "../utility/UserProps.mjs";
import { UserLoggedIn } from "../utility/UpdateUser.mjs";
import { ValidateUserPlayListEntry, GetSongs } from "../utility/ValidatePlaylist.mjs";
import './Playlist.css';


function Playlist() {
    
    //Makes request to spotify microservice and returns link to a playlist based off the song urls
    const GetSpotifyPlaylist = async () => {
        if (!UserLoggedIn()) {return;}

        //Return tracks
        let title = document.getElementById("playListNameInp").value;
        let song1 = document.getElementById("song1Inp").value;
        if (!ValidateUserPlayListEntry(title, song1)) {return;}
        const tracks = GetSongs();
     
        const songPass ={title, tracks}

        alert("Playlist Server Down -- Check Back Later");
        return;
        /*
        const response = await fetch(`${SpotifyAddress}/playlistgenerator`, {
            method: 'POST',
            body: JSON.stringify(songPass),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resValue = await response.json();

        userObj.url = resValue.link;
        document.getElementById("playList").innerHTML = userObj.url;
        */
    }

    // Base Page Template
    return(
    <div className="playlist-container">
        <h1>ML PlayList Generator</h1>
        <p>Generate playlist to listen to as you cruise Zillow!</p>
        <label for="playListNameInp">Playlist Name:</label>
        <input className="input-field" id="playListNameInp" placeholder="e.g. CS361FinalProject Playlist" />
        
        <p>Add up to 5 songs</p>

        <div className="songs-input-container">
            {Array.from({ length: 5 }).map((_, index) => (
                <div className="song-input" key={index}>
                    <label for={`song${index + 1}Inp`}>Song #{index + 1}:</label>
                    <input 
                        className="input-field" 
                        id={`song${index + 1}Inp`} 
                        placeholder={`[optional] spotify link: https://open.spotify.com/track/0Rr8xlOfXa8bezebu0TbVY?si=a67f781d829a402d`} 
                    />
                </div>
            ))}
        </div>

        <button className="generate-button" onClick={GetSpotifyPlaylist}>Get Spotify Playlist</button>
        <p id="playList">{userObj.url}</p>
    </div>

    )
}

export default Playlist;