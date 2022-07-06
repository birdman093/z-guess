import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {MdAdd, MdCancel, MdEdit, MdDelete, MdUpdate} from "react-icons/md";
import FilterColumn from "../components/FilterColumn";
import {AddressInUse} from "../ServerConstant.js";
import ReactDOM from "react-dom";

function Rodents() {
    useEffect(() => {
        loadRodents();
    }, []);

    const [rodentList, setRodentList] = useState([]);
    const [addField, setAddField] = useState([]);
    const [isShowing, setIsShowing] = useState(false);
    const [rodentForUpdate, setRodentForUpdate] = useState([])

    const toggle = (isShowing) => {
        setIsShowing(!isShowing);
    }

    const loadRodents = async () => {
        const response = await fetch(`${AddressInUse}/GET/rodents`);
        const rodentList = await response.json();
        setRodentList(rodentList);
    }

    const addRodents = async() => {
        let rodentName = document.getElementById("rodentNameInp").value;

        //validate input
        if (rodentName.length < 1) {
            alert("Please Enter a Name");
            return;  
        } 

        const newRodent = {rodentName}
        const response = await fetch(`${AddressInUse}/POST/rodents`, {
            method: 'POST',
            body: JSON.stringify(newRodent),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 201){
            alert("Successfully added the rodent record!");
            loadRodents();
            removeAddClick();
        } else {
            if (response.status === 410) {
                alert(`Failed to add record due to Duplicate Entry in DB, Server code = ${response.status}`)
            } else {
                alert(`Failed to add record due to DB Error Code: ${response.status}, Server code = ${response.status}`);
            }
        }
    }

    const delRodents = async(rodentID) => {
        console.log(`Starting process with ${rodentID}`)
        const response = await fetch(`${AddressInUse}/DELETE/rodents/${rodentID}`, {
            method: 'DELETE'
        });
        if(response.status >= 200 && response.status < 400){
            alert("Successfully deleted the record!");
            //document.getElementById(`${rodentID}`).remove();
            loadRodents();
        } else {
            alert(`Failed to delete record, status code = ${response.status}`);
        }
    }
    const filterResults = async (id) => {
        if(id == null){
            id = '';
        }
        const response = await fetch(`${AddressInUse}/GET/rodents/${id}`)
        const rodentList = await response.json();
        setRodentList(rodentList);
    }

    const updateRodents = async(rodentForUpdate, rodentName) => {
        if(typeof rodentName === "object" || rodentName === ''){
            rodentName = rodentForUpdate.rodentName;
        }
        const response = await fetch(`${AddressInUse}/PUT/rodents/${rodentForUpdate.rodentID}`, {
            method: 'PUT',
            body: JSON.stringify({rodentName:rodentName}),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status >= 200 && response.status < 400 ){
            alert("Successfully updated the record!");
            await loadRodents();
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

    const openUpdateForm = async(rodent) => {
        setRodentForUpdate(rodent)
        toggle(isShowing);
    }


    const RodentNameFormat = event => {
        var tag = document.getElementById("rodentNameInp");
        let val = tag.value.replace(/[^a-zA-Z]/g, '');
        tag.value = val;
    };

    const RodentInput = () => {
        return <tr>
                    <td></td>
                    <td><input id="rodentNameInp" placeholder="Rodent Name e.g. PizzaRat" onKeyUp={RodentNameFormat}/></td>
                    <td><MdAdd onClick={addRodents}/></td>
                    <td><MdCancel onClick={removeAddClick}/></td>
                </tr>
    };

    const onAddClick = event => {
        setAddField(<RodentInput />);
    };

    const removeAddClick = event => {
        setAddField();
    };

    // Row of AptFloor data
    function RodentList({ rodents, filterResults}) {
        return (
            <table>
                <thead>
                <tr>
                    <th>Rodent ID #<FilterColumn fieldToSearch="rodentID" filter={filterResults}/></th>
                    <th>Rodent Name</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {addField}
                {rodents.map((rodent, idx) => <Rodent rodent={rodent} key={idx} />)}
                </tbody>
            </table>
        );
    }

    function Rodent({ rodent}) {
        return (
            <tr id={rodent.rodentID}>
                <td>{rodent.rodentID}</td>
                <td>{rodent.rodentName}</td>
                <td><MdEdit onClick={() => openUpdateForm (rodent)}/></td>
                <td><MdDelete onClick={() => delRodents(rodent.rodentID)}/></td>
            </tr>
        );
    }

    return(
        <>
        <Header/>
        <SideBar />
        <h1 class = "DatabaseTitle">Rodents</h1>
        <p class = "DatabaseText">Tracks past and present rodents by name and ID</p>
        <button onClick={onAddClick}>+ Add New Item</button>
        <RodentList rodents = {rodentList} filterResults={filterResults}/>
        <Modal isShowing={isShowing} hide={toggle} rodentForUpdate={rodentForUpdate} updateRodent={updateRodents} RodentNameFormat={RodentNameFormat}/>
        </>
    )
}

const Modal = ({ isShowing, hide ,rodentForUpdate, updateRodent, RodentNameFormat}) => isShowing ? ReactDOM.createPortal(
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
                    <p>Rodent ID</p>
                    <text>{rodentForUpdate.rodentID}</text>
                    <p>Rodent Name</p>
                    <input id="rodentNameInp" placeholder={rodentForUpdate.rodentName} type={"text"} onKeyUp={RodentNameFormat}/>
                    <MdUpdate onClick={e => updateRodent(rodentForUpdate, document.getElementById("rodentNameInp").value)}/>
                </form>
            </div>
        </div>
    </React.Fragment>, document.body
) : null;

export default Rodents;