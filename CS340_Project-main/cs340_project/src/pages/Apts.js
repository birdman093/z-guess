import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdDelete, MdEdit, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse} from "../ServerConstant.js";
import ReactDOM from "react-dom";

function Apts() {
    useEffect(() => {
        loadApts('');
    }, []);

    const [aptList, setAptList] = useState([]);
    const [addField, setAddField] = useState([]);
    const [floorOptionList, setFloorOptionList] = useState([]);
    const [ownerOptionList, setOwnerOptionList] = useState([]);
    const [isShowing, setIsShowing] = useState(false);
    const [aptForUpdate, setAptForUpdate] = useState([]);

    const toggle = (isShowing) => {
        setIsShowing(!isShowing);
    }

    const loadApts = async (address) => {
        const response = await fetch(`${AddressInUse}/GET/apts/`);
        const aptList = await response.json();
        setAptList(aptList);
        console.log(aptList);
        aptList.forEach(formatDisplay);
        floorOptions();
        ownerOptions();
    }

    const loadAptsWithID = async (address) => {
        const response = await fetch(`${AddressInUse}/GET/apts/${address}`);
        const aptList = await response.json();
        setAptList(aptList);
        console.log(aptList);
        aptList.forEach(formatDisplay);
        floorOptions();
        ownerOptions();
    }

    function formatDisplay(item) {
        item.ownerName = item.ownerID !== null ? item.firstName + " " + item.lastName : "";
        item.sqFeet = item.sqFeet !== null ? item.sqFeet: "";
    }

    const floorOptions = async () => {
        const response = await fetch(`${AddressInUse}/GET/aptFloors`);
        const floorOptionList = await response.json();
        setFloorOptionList(floorOptionList);
    }

    const ownerOptions = async () => {
        const response = await fetch(`${AddressInUse}/GET/aptOwners`);
        const ownerOptionList = await response.json();
        ownerOptionList.forEach((item) => item.ownerName = item.firstName + " " + item.lastName);
        setOwnerOptionList(ownerOptionList);
    }

    const addApts = async() => {
        let aptNum = document.getElementById("aptNumInp").value;
        let sqFeet = document.getElementById("sqFeetInp").value;
        let floorNum = document.getElementById("floorNumInp").value;
        let ownerID = document.getElementById("ownerIDInp").value;
        console.log("Square Feet is :" + sqFeet)
        if (sqFeet === ""){
            sqFeet = "NULL"; 
        }

        if (aptNum.length === 0){
            alert("Please Insert Apartment Number");
            return;
        }
        const newApt = {aptNum, sqFeet, floorNum, ownerID}
        console.log("Sending to DB: " + JSON.stringify(newApt));
        const response = await fetch(`${AddressInUse}/POST/apts`, {
            method: 'POST',
            body: JSON.stringify(newApt),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201){
            alert("Successfully added the record!");
            loadApts();
            removeAddClick();
        } else {
            console.log(response.status);
            if (response.status === 410) {
                alert(`Failed to add record due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add record due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

    const delApts = async(aptNum) => {
        console.log(`Starting process with ${aptNum}`)
        const response = await fetch(`${AddressInUse}/DELETE/apts/${aptNum}`, {
            method: 'DELETE'
        });
        if(response.status >= 200 && response.status < 400){
            alert("Successfully deleted the record!");
            //document.getElementById(`${aptNum}`).remove();
            loadApts();
        } else {
            alert(`Failed to delete record, status code = ${response.status}`);
        }
    }
    const filterResults = async (id) => {
        if(id == null){
            id = '';
        }
        await loadAptsWithID(id)
    }

    const updateApts = async(aptForUpdate, floorNum, aptNum, ownerID, sqFeet) => {
        if(typeof floorNum === "object" || floorNum === ''){
            floorNum = aptForUpdate.floorNum;
        }
        if(typeof aptNum === "object" || aptNum === ''){
            aptNum = aptForUpdate.aptNum;
        }
        if(typeof ownerID === "object" || !ownerID || ownerID === 'NULL'){
            ownerID = null;
        }
        if(typeof sqFeet === "object" || sqFeet === ''){
            sqFeet = aptForUpdate.sqFeet;
        }
        const response = await fetch(`${AddressInUse}/PUT/apts/${aptForUpdate.aptNum}`, {
            method: 'PUT',
            body: JSON.stringify({floorNum:floorNum, aptNum:aptNum, ownerID:ownerID, sqFeet:sqFeet}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 201){
            alert("Successfully updated the record!");
            window.location.reload();
        }
        else if(response.status === 425){
            alert("No changes. Row not updated.")
            window.location.reload();
        }
        else {
            alert(`Failed to update record, status code = ${response.status}`)
            window.location.reload();
        }

    }

    const openUpdateForm = async(aptFloor) => {
        setAptForUpdate(aptFloor)
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

    const AptInput = () => {
        return <tr>
                    <td><input id="aptNumInp" placeholder="Apt Num e.g. 11, 22" onKeyUp={(id) => numFormat(id)}/></td>
                    <td><input id="sqFeetInp" placeholder="[Optional] Sq Feet e.g. 666, 999" onKeyUp={(id) => numFormat(id)}/></td>
                    <td>
                        <select id = "floorNumInp">
                            {floorOptionList.map((item,idx) => <FloorMap item={item} idx = {idx}/>)}
                        </select>
                    </td>
                    <td>
                        <select id = "ownerIDInp">
                            <option id = "None" key="None" value= "NULL"></option>
                            {ownerOptionList.map((item,idx) => <OwnerMap item={item} idx = {idx}/>)}
                        </select>
                    </td>
                    <td><MdAdd onClick={addApts}/></td>
                    <td><MdCancel onClick={removeAddClick}/></td>
                </tr>
    };

    function FloorMap ({item}) {
        return (
            <option id = {item.floorNum} key={item.floorNum} value={item.floorNum}>{item.floorNum}</option>
        );
    }

    function OwnerMap ({item}) {
        return (
            <option id = {item.ownerID} key={item.ownerID} value={item.ownerID}>{item.ownerName}</option>
        );
    }

    const onAddClick = event => {
        setAddField(<AptInput/>);
    };

    const removeAddClick = event => {
        setAddField();
    };

    // Row of AptFloor data
    function AptList({ apts, filterResults}) {
        return (
            <table>
                <thead>
                <tr>
                    <th>Apartment #<FilterColumn fieldToSearch="aptNum" filter={filterResults}/></th>
                    <th>Square Footage (ft^2)</th>
                    <th>Floor #</th>
                    <th>Owner Name</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {addField}
                {apts.map((apt, idx) => <Apt apt={apt} key={idx} />)}
                </tbody>
            </table>
        );
    }

    function Apt({apt}) {
        return (
            <tr id={apt.aptNum}>
                <td>{apt.aptNum}</td>
                <td>{apt.sqFeet}</td>
                <td>{apt.floorNum}</td>
                <td>{apt.ownerName}</td>
                <td><MdEdit onClick={() => openUpdateForm(apt)}/></td>
                <td><MdDelete onClick={() => delApts(apt.aptNum)}/></td>
            </tr>
        );
    }

    return(
        <>
        <Header/>
        <SideBar />
        <h1 class = "DatabaseTitle">Apartments</h1>
        <p class = "DatabaseText">Apartments database table tracks specific information regarding an apartment including the floor number, and apartment number.</p>
        <button onClick={onAddClick}>+ Add New Item</button>
        <AptList apts={aptList} filterResults={filterResults}/>
        <Modal isShowing={isShowing} hide={toggle} aptForUpdate={aptForUpdate} updateApts={updateApts} floorOptionList={floorOptionList} FloorMap = {FloorMap} ownerOptionList={ownerOptionList} OwnerMap={OwnerMap}/>
        </>
    )
}
const Modal = ({ isShowing, hide ,aptForUpdate, updateApts, floorOptionList, ownerOptionList, FloorMap, OwnerMap}) => isShowing ? ReactDOM.createPortal(
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
                    <p>Apt Number</p>
                    <input id= "aptNumInp" placeholder={aptForUpdate.aptNum} type={"number"}/>
                    <p>Floor Number</p>
                    <select id = "floorNumInp" defaultValue={aptForUpdate.floorNum}>
                        {floorOptionList.map((item,idx) => <FloorMap item={item} idx = {idx}/>)}
                    </select>
                    <p>Owner</p>
                    <select id = "ownerIDInp" defaultValue={aptForUpdate.ownerID}>
                        <option id = "None" key="None" value= "NULL"></option>
                        {ownerOptionList.map((item,idx) => <OwnerMap item={item} idx = {idx}/>)}
                    </select>
                    <p>Sq Feet</p>
                    <input id = "sqFeetInp" placeholder={aptForUpdate.sqFeet} type={"number"}/>
                    <MdUpdate onClick={e => updateApts(aptForUpdate, document.getElementById("floorNumInp").value, document.getElementById("aptNumInp").value, document.getElementById("ownerIDInp").value, document.getElementById("sqFeetInp").value)}/>
                </form>
            </div>
        </div>
    </React.Fragment>, document.body
) : null;
export default Apts;