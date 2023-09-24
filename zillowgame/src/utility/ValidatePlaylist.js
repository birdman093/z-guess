// Valid = True displays a valid greeting to the logged in user, If Valid = False displays invalid sign-in if not the first download, and No user 
// logged in if second download
export function ValidateUserPlayListEntry(title, song1){
    if (song1.length === 0) {
        alert("Must Have at least one song in first slot");
        return false;
    }

    if (title.length === 0) {
        alert("Must enter a playlist Name!")
        return false;
    }
    return true;
}

export function GetSongs(){
    let tracks = []
    let song1 = document.getElementById("song1Inp").value;
    let song2 = document.getElementById("song2Inp").value;
    let song3 = document.getElementById("song3Inp").value;
    let song4 = document.getElementById("song4Inp").value;
    let song5 = document.getElementById("song5Inp").value;
    
    if (song1.length > 0 ){ tracks.push(song1);}
    if (song2.length > 0 ){ tracks.push(song2);}
    if (song3.length > 0 ){ tracks.push(song3);}
    if (song4.length > 0 ){ tracks.push(song4);}
    if (song5.length > 0 ){ tracks.push(song5);}
    return tracks;
}




