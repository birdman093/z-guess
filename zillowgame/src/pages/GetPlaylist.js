import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdDelete, MdEdit, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse,SpotifyAddress} from "../ServerConstant.js";
import ReactDOM from "react-dom";
import userObj, spotifyObj from "./user.js";

function GetPlaylist() {
    // Label that says to add up to 5 songs
    // Provide Inputs for up to 5 songs
    // Button that fetches --> 
    // Playlist Link: 

    const GetSpotifyPlaylist = async () => {
        let song1 = document.getElementById("song1Inp").value;
        let song2 = document.getElementById("song2Inp").value;
        let song3 = document.getElementById("song3Inp").value;
        let song4 = document.getElementById("song4Inp").value;
        let song5 = document.getElementById("song5Inp").value;
        const songs = {};


        if (song1.length == 0) {
            alert("Must Have at least one song in first slot")
            return
        }
        
        if (song1.length > 0 ){ songs.add(song1);}
        if (song2.length > 0 ){ songs.add(song2);}
        if (song3.length > 0 ){ songs.add(song3);}
        if (song4.length > 0 ){ songs.add(song4);}
        if (song5.length > 0 ){ songs.add(song5);}
     
        const response = await fetch(`${SpotifyAddress}/GET/playlistgenerator`, {
            method: 'POST',
            body: JSON.stringify(songs),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const resValue = await response.json();

        if (resValue.playlist.length > 0) {
            spotifyObj.url = resValue.playlist
        } else {
            spotifyObj.url = resValue.playlist
        }

        document.getElementById("playList").value = spotifyObj.url;
    }

    // Base Page Template
    return(
        <>
        <Header/>
        <SideBar />
        <h1>PlayList Generator</h1>
        <p>Get a Playlist to Listen to as you Look at Zillow Properties!</p>
        <label>Song1: </label>
        <input id ="song1Inp"></input>
        <label>Song1: </label>
        <input id ="song2Inp"></input>
        <label>Song1: </label>
        <input id ="song3Inp"></input>
        <label>Song1: </label>
        <input id ="song4Inp"></input>
        <label>Song1: </label>
        <input id ="song5Inp"></input>
        <button onClick = {GetSpotifyPlaylist}>GetSpotifyPlaylist</button>
        <p id = "playList" value = {spotifyObj.url}></p>
        </>
    )
}

export default AccountSetup;