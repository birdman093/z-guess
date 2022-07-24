import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdDelete, MdEdit, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse,SpotifyAddress} from "../ServerConstant.js";
import ReactDOM from "react-dom";
import userObj from "./user.js";

function GetPlaylist() {
    // Label that says to add up to 5 songs
    // Provide Inputs for up to 5 songs
    // Button that fetches --> 
    // Playlist Link: 

    const GetSpotifyPlaylist = async () => {
        let title = document.getElementById("playListNameInp").value;
        let song1 = document.getElementById("song1Inp").value;
        let song2 = document.getElementById("song2Inp").value;
        let song3 = document.getElementById("song3Inp").value;
        let song4 = document.getElementById("song4Inp").value;
        let song5 = document.getElementById("song5Inp").value;
        const tracks = [];


        if (song1.length == 0) {
            alert("Must Have at least one song in first slot")
            return;
        }

        if (title.length == 0) {
            alert("Must enter a playlist Name!")
            return;
        }
        
        if (song1.length > 0 ){ tracks.push(song1);}
        if (song2.length > 0 ){ tracks.push(song2);}
        if (song3.length > 0 ){ tracks.push(song3);}
        if (song4.length > 0 ){ tracks.push(song4);}
        if (song5.length > 0 ){ tracks.push(song5);}
     
        const songPass ={title, tracks}
        const response = await fetch(`${SpotifyAddress}/playlistgenerator`, {
            method: 'POST',
            body: JSON.stringify(songPass),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resValue = await response.json();
        console.log(resValue);

        userObj.url = resValue.link;

        document.getElementById("playList").innerHTML = userObj.url;
    }

    const GetLink = async () => {
        let UserName = userObj.userName

        if (UserName.length == 0) {
            alert("Must Log-In to get url link")
            return
        }
     
        const response = await fetch(`${SpotifyAddress}/GET/spotifyproperties/${UserName}`);
        const resValue = await response.json();
        console.log(resValue);

        document.getElementById("test_GetLink").innerHTML = resValue[0].Url;
    }

    // Base Page Template
    return(
        <>
        <Header/>
        <SideBar />
        <h1>PlayList Generator</h1>
        <p>Get a Playlist to Listen to as you Look at Zillow Properties!</p>
        <label>PlaylistName: </label>
        <input id ="playListNameInp"></input>
        <label>Song1: </label>
        <input id ="song1Inp"></input>
        <label>Song2: </label>
        <input id ="song2Inp"></input>
        <label>Song3: </label>
        <input id ="song3Inp"></input>
        <label>Song4: </label>
        <input id ="song4Inp"></input>
        <label>Song5: </label>
        <input id ="song5Inp"></input>
        <button onClick = {GetSpotifyPlaylist}>GetSpotifyPlaylist</button>
        <p id = "playList">{userObj.url}</p>
        <button onClick = {GetLink}>TESTING -- GET Link from CurrentUser</button>
        <p id = "test_GetLink">No Links Generated Yet</p>
        </>
    )
}

export default GetPlaylist;