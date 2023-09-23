import React, {useState} from "react";
import {SpotifyAddress} from "../config/ServerConfig.js";
import { useUser } from "../components/UserProvider.js";
import { ValidateUserPlayListEntry, GetSongs } from "../utility/ValidatePlaylist.js";
import './Playlist.css';

var serverSetup = false;

function Playlist() {

    const {UserLoggedIn} = useUser();
    const [url, setURL] = useState('');
    
    //Makes request to spotify microservice and returns link to a playlist based off the song urls
    const GetSpotifyPlaylist = async () => {
        if (!UserLoggedIn()) {return;}

        //Return tracks
        let title = document.getElementById("playListNameInp").value;
        let song1 = document.getElementById("song1Inp").value;
        if (!ValidateUserPlayListEntry(title, song1)) {return;}
        const tracks = GetSongs();
     
        const songPass ={title, tracks}

        if (serverSetup){
            const response = await fetch(`${SpotifyAddress}/playlistgenerator`, {
                method: 'POST',
                body: JSON.stringify(songPass),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const resValue = await response.json();
    
            setURL(resValue.link);

        } else {
            alert("Playlist Server Down -- Check Back Later");
            return;
        }
    }

    // Base Page Template
    return(
        <div>
            <h1>ML PlayList Generator</h1>
        <div className="playlist-container">
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
        <p id="playList">{url}</p>
    </div>
    </div>

    )
}

export default Playlist;