import {MdEdit} from "react-icons/md";

const EditButton = () => {
    return(
     <MdEdit onClick={() => {
            alert("Edit data when real data is imported");
        }}/>
    );


}
export default EditButton;