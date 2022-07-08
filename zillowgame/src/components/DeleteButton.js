import {MdDeleteForever} from "react-icons/md";


const DeleteButton = () => {
    return(
        <MdDeleteForever onClick={() => {
        window.confirm("Are you sure you want to delete this record?");
        }}/>
    )

}

export default DeleteButton;

