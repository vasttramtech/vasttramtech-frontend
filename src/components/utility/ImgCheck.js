import { toast } from "react-toastify";


export const checkFileSize = (file, size = 1024) => {
    console.log(file);
    if(!file){
        toast.error("Please select a file.");
        return false;
    }

    if(file.size > size){
        toast.error("File size is too large.");
        return false;
    }
    return true;
}