import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdEdit, MdDelete, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse} from "../ServerConstant.js";
import {Dropdown} from 'semantic-ui-react';
import ReactDOM from "react-dom";

function RodentsToFloors() {
    useEffect(() => {
        loadRodentsToFloors();
    }, []);

    const [rodentToFloorList, setRodentToFloorList] = useState([]);
    const [addField, setAddField] = useState([]);
    const [rodentOptionList, setRodentOptionList] = useState([]);
    const [floorOptionList, setFloorOptionList] = useState([]);
    const [isShowing, setIsShowing] = useState(false);
    const [rtfForUpdate, setRtfForUpdate] = useState([]);

    const toggle = (isShowing) => {
        setIsShowing(!isShowing);
    }

    const loadRodentsToFloors = async () => {
        const response = await fetch(`${AddressInUse}/GET/rodentsToFloors`);
        const rodentToFloorList = await response.json();
        setRodentToFloorList(rodentToFloorList);
        rodentOptions();
        floorOptions();
    }

    const rodentOptions = async () => {
        const response = await fetch(`${AddressInUse}/GET/rodents`);
        const rodentOptionList = await response.json();
        setRodentOptionList(rodentOptionList);
    }

    const floorOptions = async () => {
        const response = await fetch(`${AddressInUse}/GET/aptFloors`);
        const floorOptionList = await response.json();
        setFloorOptionList(floorOptionList);
    }

    const addRTF = async() => {
        let rodentID = document.getElementById("rodentNameInp").value;
        let floorNum = document.getElementById("floorNumInp").value;
        const newRTF = {rodentID, floorNum}
        console.log(JSON.stringify(newRTF));
        const response = await fetch(`${AddressInUse}/POST/rodentsToFloors`, {
            method: 'POST',
            body: JSON.stringify(newRTF),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201){
            alert("Successfully added the record!");
            loadRodentsToFloors();
            removeAddClick();
        } else {
            if (response.status === 410) {
                alert(`Failed to add record due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add record due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

    const delRodentsToFloors = async(rodentID, floorNum) => {
        console.log(`Starting process with ${rodentID}+${floorNum}`)
        const response = await fetch(`${AddressInUse}/DELETE/rodentsToFloors/${rodentID}/${floorNum}`, {
            method: 'DELETE'
        });
        if(response.status >= 200 && response.status < 400){
            alert("Successfully deleted the record!");
            //document.getElementById(`${rodentID}-${floorNum}`).remove();
            loadRodentsToFloors();
        } else {
            alert(`Failed to delete record, status code = ${response.status}`);
        }
    }
    const updateRtf = async(rtfForUpdate, rodentID, floorNum) => {
        if (typeof rodentID === "object") {
            rodentID = rtfForUpdate.rodentID;
        }
        if (typeof floorNum === "object") {
            floorNum = rtfForUpdate.floorNum;
        }
        const response = await fetch(`${AddressInUse}/PUT/rodentsToFloors/${rtfForUpdate.rodentID}/${rtfForUpdate.floorNum}`, {
            method: 'PUT',
            body: JSON.stringify({rodentID: rodentID, floorNum: floorNum}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status >= 200 && response.status < 400) {
            alert("Successfully updated the record!");
            window.location.reload();
        } else {
            if (response.status === 425) {
                alert("No Changes Made. Update did not change original entry.")

            } else if (response.status === 410) {
                alert("No Changes Made. Duplicate Entry")
            } else {
                alert(`Failed to update record, status code = ${response.status}`);
            }
        }
    }

        const openUpdateForm = async(rtf) => {
            setRtfForUpdate(rtf)
            toggle(isShowing);
        }

    function RodentToFloorInput () {
        return <tr>
                    <td>
                        <select id = "rodentNameInp">
                            {rodentOptionList.map((item,idx) => <RodentMap item={item} idx = {idx}/>)}
                        </select>
                    </td>
                    <td>
                        <select id = "floorNumInp">
                            {floorOptionList.map((item,idx) => <FloorMap item={item} idx = {idx}/>)}
                        </select>
                    </td>
                    <td><MdAdd onClick={addRTF}/></td>
                    <td><MdCancel onClick={removeAddClick}/></td>
                </tr>
    };

    function RodentMap ({item}) {
        return (
            <option id = {item.rodentID} key={item.rodentID} value={item.rodentID}>{item.rodentName}</option>
        );
    }

    function FloorMap ({item}) {
        return (
            <option id = {item.floorNum} key={item.floorNum} value={item.floorNum}>{item.floorNum}</option>
        );
    }
    
    const onAddClick = Event => {
        
        setAddField(<RodentToFloorInput/>);
    };

    const removeAddClick = event => {
        setAddField();
    };

    // Row of AptFloor data
    function RTFList({ rtfList, filterResults}) {
        return (
            <table>
                <thead>
                <tr>
                    <th>Rodent ID [int]</th>
                    <th>Floor Number [int]</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                    {addField}
                    {rtfList.map((rtf, idx) => <RTFmap rtf={rtf} key={idx} />)}
                </tbody>
            </table>
        );
    }
    function RTFmap({rtf}) {
        return (
            <tr id={`${rtf.rodentID}-${rtf.floorNum}`}>
                <td>{rtf.rodentName}</td>
                <td>{rtf.floorNum}</td>
                <td><MdEdit onClick={() => openUpdateForm(rtf)}/></td>
                <td><MdDelete onClick={() => delRodentsToFloors(rtf.rodentID,rtf.floorNum)}/></td>
            </tr>
        );
    }

    return(
        <>
        <Header/>
        <SideBar />
        <h1>Rodents To Apartment Floors</h1>
        <p>Tracks floors that a rodent currently occupies(which could be many!)</p>
        <button onClick={onAddClick}>+ Add New Item</button>
        <RTFList rtfList={rodentToFloorList}/>
        <Modal isShowing={isShowing} hide={toggle} rtfForUpdate={rtfForUpdate} rodentOptionList={rodentOptionList} floorOptionList={floorOptionList} updateRtf={updateRtf} FloorMap={FloorMap} RodentMap={RodentMap}/>
        </>
        
    )
}
const Modal = ({ isShowing, hide ,rtfForUpdate, updateRtf, rodentOptionList, floorOptionList, RodentMap, FloorMap}) => isShowing ? ReactDOM.createPortal(
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
                    <p>Rodent</p>
                    <select id = "rodentNameInp" defaultValue={rtfForUpdate.rodentID}>
                        {rodentOptionList.map((item,idx) => <RodentMap item={item} idx = {idx}/>)}
                    </select>                    <p>Floor Number</p>
                    <select id = "floorNumInp" defaultValue={rtfForUpdate.floorNum}>
                        {floorOptionList.map((item,idx) => <FloorMap item={item} idx = {idx}/>)}
                    </select>
                    <MdUpdate onClick={e => updateRtf(rtfForUpdate, document.getElementById("rodentNameInp").value, document.getElementById("floorNumInp").value)}/>
                </form>
            </div>
        </div>
    </React.Fragment>, document.body
) : null;

export default RodentsToFloors;