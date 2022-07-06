import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdDelete, MdEdit, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import App from "../App";
import {AddressInUse} from "../ServerConstant.js";
import ReactDOM from "react-dom";
function AptFloors() {
    useEffect(() => {
        loadAptFloors();
    }, []);

    const [aptFloorList, setAptFloorList] = useState([]);
    const [addField, setAddField] = useState([]);
    const [aptFloorForUpdate, setAptFloorForUpdate] = useState([])
    const [isShowing, setIsShowing] = useState(false);
    const [floorNum, setFloorNum] = useState([]);
    const [fireExits, setFireExits] = useState([]);

    const toggle = (isShowing) => {
      setIsShowing(!isShowing);
    }

    const loadAptFloors = async () => {
        console.log("MakingRequest")
        console.log(`${AddressInUse}/GET/aptFloors`)
        const response = await fetch(`${AddressInUse}/GET/aptFloors`);
        const aptFloorList = await response.json();
        console.log(response);
        setAptFloorList(aptFloorList);
    }

    const filterResults = async (id) => {
        if(id == null){
            id = '';
        }
        const response = await fetch(`${AddressInUse}/GET/aptFloors/${id}`)
        const aptFloorList = await response.json();
        setAptFloorList(aptFloorList);
    }

    

    const addAptFloors = async() => {        
        let floorNum = document.getElementById("floorNumInp").value;
        let fireExits = document.getElementById("fireExitInp").value;
        const newAptFloor = {floorNum, fireExits}
        const response = await fetch(`${AddressInUse}/POST/aptFloors`, {
            method: 'POST',
            body: JSON.stringify(newAptFloor),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201){
            alert("Successfully added the record!");
            await loadAptFloors();
            removeAddClick();
        } else {
            if (response.status === 410) {
                alert(`Failed to add record due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add record due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

    const delAptFloors = async(flrNum) => {
        const response = await fetch(`${AddressInUse}/DELETE/aptFloors/${flrNum}`, {
            method: 'DELETE'
        });
        if(response.status >= 200 && response.status < 400){
            alert("Successfully deleted the record!");
            //document.getElementById(`${flrNum}`).remove();
            loadAptFloors();
        } else {
            alert(`Failed to delete record, status code = ${response.status}`);
        }
    }

    const updateAptFloors = async(aptFloorForUpdate, fireExits) => {
        if(typeof fireExits === "object" || fireExits === ''){
            fireExits = aptFloorForUpdate.fireExits;
        }
        const response = await fetch(`${AddressInUse}/PUT/aptFloors/${aptFloorForUpdate.floorNum}`, {
            method: 'PUT',
            body: JSON.stringify({fireExits:fireExits}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status >= 200 && response.status < 400 ){
            alert("Successfully updated the record!");
            await loadAptFloors();
            window.location.reload();
            }
        else {
            if (response.status === 425) {
                alert("No Changes Made. Update did not change original entry.")

            } else if (response.status === 410) {
                alert("No Changes Made. Duplicate Entry")
            }
            else {
                alert(`Failed to update record, status code = ${response.status}`);
            }
        }

    }

    const openUpdateForm = async(aptFloor) => {
        setAptFloorForUpdate(aptFloor)
        toggle(isShowing);
    }

    function numFormat(event) {
        var tag = document.getElementById(event.target.id);
        let val = tag.value.replace(/\D/g, '');
        if (val.length > 0 && val[0] == "0"){
            val = '';
        }
        tag.value = val;
    }

    const AptFloorInput = () => {
        return<tr>
                    <td><input id="floorNumInp" placeholder="Floor Number e.g. 11, 22" onKeyUp={(id) => numFormat(id)}/></td>
                    <td><input id="fireExitInp" placeholder="Fire Exits e.g. 1, 2" onKeyUp={(id) => numFormat(id)}/></td>
                    <td><MdAdd onClick = {addAptFloors}/></td>
                    <td><MdCancel onClick = {removeAddClick}/></td>
                </tr>
    };

    const onAddClick = event => {
        setAddField(<AptFloorInput/>);
    };

    const removeAddClick = event => {
        setAddField();
    };

    // Row of AptFloor data
    function AptFloorList({ aptFloors, filterResults}) {
        return (
            <table id="aptFloors">
                <thead>
                <tr>
                    <th>Floor #<FilterColumn fieldToSearch={"floorNum"} filter={filterResults}/></th>
                    <th>FireExits</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {addField}
                {aptFloors.map((aptFloor, idx) => <AptFloor aptFloor={aptFloor} key={idx}/>)}
                </tbody>
            </table>
        );
    }

    function AptFloor({ aptFloor}) {
        return (
            <tr id={aptFloor.floorNum}>
                <td>{aptFloor.floorNum}</td>
                <td>{aptFloor.fireExits}</td>
                <td><MdEdit onClick={() => openUpdateForm (aptFloor)}/></td>
                <td><MdDelete onClick={() => delAptFloors(aptFloor.floorNum)}/></td>

            </tr>
        );
    }

    return(
        <>
        <Header/>
        <SideBar/>
        <h1>Apartment Floors Table</h1>
        <p>Tracks apartment floors, and number of fire exits on each floor.</p>
        <button onClick={onAddClick}>+ Add New Item</button>
        <AptFloorList aptFloors={aptFloorList} filterResults={filterResults}/>
        <Modal isShowing={isShowing} hide={toggle} aptFloorForUpdate={aptFloorForUpdate} updateAptFloors={updateAptFloors} numFormat={numFormat}/>
        </>

    )
}

const Modal = ({ isShowing, hide ,aptFloorForUpdate, updateAptFloors, numFormat}) => isShowing ? ReactDOM.createPortal(
    <React.Fragment>
        <div className="modal-overlay"/>
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal">
                <div className="modal-header">
                    <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form>
                    <p>Floor Number</p>
                    <text>{aptFloorForUpdate.floorNum}</text>
                    <p>Fire Exits</p>
                    <input id="fireExitsInp" placeholder={aptFloorForUpdate.fireExits} onKeyUp={(id) => numFormat(id)} type={"number"}/>
                    <MdUpdate onClick={e => updateAptFloors(aptFloorForUpdate, document.getElementById("fireExitsInp").value)}/>
                </form>
            </div>
        </div>
    </React.Fragment>, document.body
) : null;


export default AptFloors;