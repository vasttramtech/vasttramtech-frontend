// import { useLocation } from "react-router-dom";
// import SmartTable from "../../smartTable/SmartTable";
// import { useNavigate } from "react-router-dom";
// import PinIcon from "../../assets/Others/PinIcon.png";
// import { useState } from "react";

// const headers = ["Part", "Process", "Comments", "Start Date", "End Date", "Designer", "Last Uploaded Date", "Edit"];

// const rawData = [];

// const DesignEntry = () => {
//     const location = useLocation();
//     const title = location.state?.title;
//     const navigate = useNavigate();
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [previewImage, setPreviewImage] = useState(null);

//     const handleRowClick = (rowData) => {
//         navigate(`/profile/${rowData.id}`);
//     };

//     // const handlePin = (rowData) => {
//     //     console.log("Pin Clicked:", rowData);
//     //     // Perform pin action
//     // };

//     // const enhancedData = rawData.map((item) => ({
//     //     ...item,
//     //     Pin: (
//     //         <button onClick={() => handlePin(item)}>
//     //             <img src={PinIcon} alt="Pin" className="" />
//     //         </button>
//     //     ),
//     // }));

//     return (
//         <div className="py-2 bg-white rounded-lg">
//             <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>

//             <form className="grid grid-cols-2 gap-6 p-2 mb-16">

//                 {/* Add new design Button inside container */}
//                 <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
//                     <div className="  ">
//                         <button type="button" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition">
//                             Add New Design
//                         </button>
//                     </div>
//                 </div>


//                 {/* Name /Number of Design */}
//                 <div className="flex flex-col">
//                     <label className="text-gray-700 font-semibold">Name / Number of Design</label>
//                     <select className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => e.target.classList.add('text-black')}>
//                         <option value="" disabled selected>Name</option>
//                         <option value="Design1">Design 1</option>
//                         <option value="Design2">Design 2</option>
//                         <option value="Design3">Design 3</option>
//                         <option value="Design4">Design 4</option>
//                     </select>
//                 </div>

//                 {/* Designer Name */}
//                 <div className="flex flex-col">
//                     <label className="text-gray-700 font-semibold">Designer Name</label>
//                     <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Designer Name" />
//                 </div>

//                 {/* Status */}
//                 <div className="flex flex-col">
//                     <label className="text-gray-700 font-semibold">Status</label>
//                     <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Status" />
//                 </div>

//                 {/* Tags */}
//                 <div className="flex flex-col">
//                     <label className="text-gray-700 font-semibold">Tags</label>
//                     <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tags" />
//                 </div>

//                 {/* Remarks */}
//                 <div className="flex flex-col col-span-2">
//                     <label className="text-gray-700 font-semibold">Remarks</label>
//                     <textarea className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" placeholder="Remarks..."></textarea>
//                 </div>

//                 <div className="flex gap-12 col-span-2">
//                     {/* Photo Upload */}
//                     <div className="flex flex-col">
//                         <label className="text-gray-700 font-semibold mb-2">Photo Upload</label>
//                         <div className="relative">
//                             <input
//                                 type="file"
//                                 id="file-upload"
//                                 className="hidden"
//                             />
//                             <label
//                                 htmlFor="file-upload"
//                                 className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
//                             >
//                                 Choose File
//                             </label>
//                             <span className="text-gray-500 ml-2">
//                                 {selectedImage ? selectedImage.name : "No file chosen"}
//                             </span>
//                         </div>
//                         {previewImage && (
//                             <img src={previewImage} alt="Preview" className="mt-2 w-32 h-auto" />
//                         )}
//                     </div>

//                     {/* Final Photo Upload */}
//                     <div className="flex flex-col">
//                         <label className="text-gray-700 font-semibold mb-2">Final Photo Upload</label>
//                         <div className="relative">
//                             <input
//                                 type="file"
//                                 id="file-upload"
//                                 className="hidden"
//                             />
//                             <label
//                                 htmlFor="file-upload"
//                                 className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
//                             >
//                                 Choose File
//                             </label>
//                             <span className="text-gray-500 ml-2">
//                                 {selectedImage ? selectedImage.name : "No file chosen"}
//                             </span>
//                         </div>
//                         {previewImage && (
//                             <img src={previewImage} alt="Preview" className="mt-2 w-32 h-auto" />
//                         )}
//                     </div>

//                     {/* Cost Sheet */}
//                     <div className="flex flex-col">
//                         <label className="text-gray-700 font-semibold mb-2">Cost Sheet</label>
//                         <div className="relative">
//                             <input
//                                 type="file"
//                                 id="file-upload"
//                                 className="hidden"
//                             />
//                             <label
//                                 htmlFor="file-upload"
//                                 className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
//                             >
//                                 Choose File
//                             </label>
//                             <span className="text-gray-500 ml-2">
//                                 {selectedImage ? selectedImage.name : "No file chosen"}
//                             </span>
//                         </div>
//                         {previewImage && (
//                             <img src={previewImage} alt="Preview" className="mt-2 w-32 h-auto" />
//                         )}
//                     </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="col-span-2 flex justify-end mt-4">
//                     <button type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition">
//                         Cancel
//                     </button>
//                     <button type="submit" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4">
//                         Save
//                     </button>
//                 </div>
//             </form>

//             <div className="mb-16">
//                 <SmartTable headers={headers} data={rawData} />
//             </div>
//         </div>
//     );
// };

// export default DesignEntry;












import { useLocation } from "react-router-dom";
import SmartTable from "../../smartTable/SmartTable";
import { useNavigate } from "react-router-dom";
import PinIcon from "../../assets/Others/PinIcon.png";
import { useEffect, useState } from "react";
import { PuffLoader, BounceLoader } from "react-spinners";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkFileSize } from "../utility/ImgCheck";

const headers = ["Part", "Process", "Comments", "Start Date", "End Date", "Designer", "Last Uploaded Date", "Edit"];

const rawData = [];

const DesignEntry = () => {
    const location = useLocation();
    const title = location.state?.title;
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState({
        img_upload: null,
        final_img_upload: null,
        cost_sheet: null
    });
    const [previewImages, setPreviewImages] = useState({
        img_upload: null,
        final_img_upload: null,
        cost_sheet: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const { token } = useSelector(state => state.auth);
    const [designSubmitting, setDesignSubmitting] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [openNewDesignModal, setOpenNewDesignModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [designs, setDesigns] = useState([]);
    const [processors, setProcessors] = useState([]);
    const [newDesignForm, setNewDesignForm] = useState(
        {
            design_name: ""
        }
    )

    // const processorsdummy = ["Sagar", "Swati", "Iqra", "Priya", "Yasmin"];

    const [formData, setFormData] = useState({
        design: "",
        designer_name: "",
        design_status: "",
        tag: "",
        remark: "",
        part: "",
        process: "",
        start_date: "",
        end_date: "",
        comments: "",
        processor: "",
        img_upload: null,
        final_img_upload: null,
        cost_sheet: null,
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // const handleFileChange = (event) => {
    //     const { name } = event.target;
    //     const files = Array.from(event.target.files); // Convert FileList to Array
      
    //     const validFiles = files.filter((file) => checkFileSize(file, 1024*1024)); //  this will check size of all images
      
    //     if (validFiles.length > 0) {
    //         setSelectedImages((prev) => ({
    //             ...prev,
    //             [name]: prev[name] ? [...prev[name], ...files] : files, // Append new files
    //         }));
    
    //         // Create previews for multiple files
    //         const previews = files.map((file) => {
    //             return new Promise((resolve) => {
    //                 const reader = new FileReader();
    //                 reader.onloadend = () => resolve(reader.result);
    //                 reader.readAsDataURL(file);
    //             });
    //         });
    
    //         Promise.all(previews).then((results) => {
    //             setPreviewImages((prev) => ({
    //                 ...prev,
    //                 [name]: prev[name] ? [...prev[name], ...results] : results, // Append previews
    //             }));
    //         });
    //     }
    // };
 
    const handleFileChange = (event) => {
  const { name } = event.target;
  const files = Array.from(event.target.files); // Convert FileList to Array

  const validFiles = files.filter((file) => checkFileSize(file, 1024 * 1024)); // 1MB size check

  if (validFiles.length > 0) {
    setSelectedImages((prev) => ({
      ...prev,
      [name]: prev[name] ? [...prev[name], ...validFiles] : [...validFiles], // Append valid files
    }));

    // Create previews for valid files only
    const previews = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((results) => {
      setPreviewImages((prev) => ({
        ...prev,
        [name]: prev[name] ? [...prev[name], ...results] : [...results], // Append previews
      }));
    });
  }
};

    
    const handleRowClick = (rowData) => {
        navigate(`/profile/${rowData.id}`);
    };

    const handleNewDesignSubmit = async (e) => {
        e.preventDefault();
        setDesignSubmitting(true);

        const postData = {
            data: {
                design_name: newDesignForm.design_name,
            },
        };

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/designs`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in the Authorization header
                },
            });
            // Optionally handle success (e.g., notify user, reset form)
            toast.success("New Design saved successfully!", { position: "top-right" });

            setNewDesignForm({
                group_name: ""
            });
            setOpenNewDesignModal(false);
            fetchDropDownData();
        } catch (error) {
            console.error("Error posting New Design:", error);
            toast.error("Error posting New Design", error, { position: "top-right" });
            // Optionally handle errors
        } finally {
            setDesignSubmitting(false); // Stop the spinner
        }
    }
    
        const fetchDropDownData = async () => {
            try {
                setSubmitting(true)
                setLoading(true);
                const response1 = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/designs?populate=*`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const response2 = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/design-masters?populate=*`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const designs = Array.isArray(response1.data.data)
                    ? response1.data.data
                    : [];
                setDesigns(designs);
                const designMaster = Array.isArray(response2.data.data)
                    ? response2.data.data
                    : [];
                setProcessors(designMaster);
            } catch (error) {
                console.error("Error fetching jobber data:", error);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
                setSubmitting(false);
            }
        };

    const handleInputChangeDesign = (e) => {
        const { name, value } = e.target;
        setNewDesignForm((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setSubmitting(true);
    
    //     // Function to upload files and return uploaded file IDs
    //     const uploadFiles = async (files) => {
    //         let uploadedIds = [];
    //         if (files && files.length > 0) {
    //             const formDataUpload = new FormData();
    //             files.forEach(file => formDataUpload.append("files", file));
    //             try {
    //                   const uploadResponse = await axios.post(
    //                     `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
    //                     formDataUpload,
    //                     {
    //                         headers: {
    //                             "Content-Type": "multipart/form-data",
    //                             Authorization: `Bearer ${token}`,
    //                         },
    //                     }
    //                 );
    //                 console.log(uploadResponse.data);
    //                 if (Array.isArray(uploadResponse.data)) {
    //                     uploadedIds = uploadResponse.data.map(file => file.id);
    //                 }
    //             } catch (error) {
    //                 toast.error("Image upload failed", { position: "top-right" });
    //                 console.error("Error uploading files:", error);
    //                 setSubmitting(false);
    //                 return;
    //             }
    //         }
    //         return uploadedIds;
    //     };
    
    //     console.log("Uploaded Images", uploadFiles);
    //     // Upload images and get their IDs
    //     const imgUploadIds = await uploadFiles(selectedImages.img_upload || []);
    //     const finalImgUploadIds = await uploadFiles(selectedImages.final_img_upload || []);
    //     const costSheetIds = await uploadFiles(selectedImages.cost_sheet || []);
        
    //     console.log("Selected Images", finalImgUploadIds );
    //     // Prepare the final data payload
    //     const postData = {
    //         data: {
    //             designer_name: formData.designer_name,
    //             design_status: formData.design_status,
    //             tag: formData.tag,
    //             img_upload: imgUploadIds,
    //             final_img_upload: finalImgUploadIds,
    //             cost_sheet: costSheetIds,
    //             remark: formData.remark,
    //             design: formData.design, // Should be the ID of related design
    //             part: formData.part,
    //             process: formData.process,
    //             start_date: formData.start_date,
    //             end_date: formData.end_date,
    //             processor: formData.processor, // Should be the ID of related processor
    //             comments: formData.comments,
    //         },
    //     };
    
    //     console.log("Post Data Design Entry:", postData);
    
    //     try {
    //         await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/design-entry-pages`, postData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         toast.success("Design entry added successfully", { position: "top-right" });
    
    //         // Reset form after successful submission
    //         setFormData({
    //             designer_name: "",
    //             design_status: "",
    //             tag: "",
    //             remark: "",
    //             design: "",
    //             part: "",
    //             process: "",
    //             start_date: "",
    //             end_date: "",
    //             processor: "",
    //             comments: "",
    //         });
    //         setSelectedImages({
    //             img_upload: null,
    //             final_img_upload: null,
    //             cost_sheet: null,
    //         });
    //         setPreviewImages({
    //             img_upload: null,
    //             final_img_upload: null,
    //             cost_sheet: null,
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         console.error("Error posting design entry data:", error);
    //         toast.error("Error posting design entry data", error, { position: "top-right" });

            

    //     } finally {
    //         setSubmitting(false);
    //     }
    // };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
    
        // Store all uploaded image IDs to delete if needed
        let allUploadedIds = [];
    
        const uploadFiles = async (files) => {
            let uploadedIds = [];
            if (files && files.length > 0) {
                const formDataUpload = new FormData();
                files.forEach(file => formDataUpload.append("files", file));
                try {
                    const uploadResponse = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
                        formDataUpload,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (Array.isArray(uploadResponse.data)) {
                        uploadedIds = uploadResponse.data.map(file => file.id);
                        allUploadedIds.push(...uploadedIds); // Keep track for rollback
                    }
                } catch (error) {
                    toast.error("Image upload failed", { position: "top-right" });
                    console.error("Error uploading files:", error);
                    setSubmitting(false);
                    return [];
                }
            }
            return uploadedIds;
        };
    
        const imgUploadIds = await uploadFiles(selectedImages.img_upload || []);
        const finalImgUploadIds = await uploadFiles(selectedImages.final_img_upload || []);
        const costSheetIds = await uploadFiles(selectedImages.cost_sheet || []);
    
        const postData = {
            data: {
                designer_name: formData.designer_name,
                design_status: formData.design_status,
                tag: formData.tag,
                img_upload: imgUploadIds,
                final_img_upload: finalImgUploadIds,
                cost_sheet: costSheetIds,
                remark: formData.remark,
                design: formData.design,
                part: formData.part,
                process: formData.process,
                start_date: formData.start_date,
                end_date: formData.end_date,
                processor: formData.processor,
                comments: formData.comments,
            },
        };
        console.log("Post Data Design Entry:", postData);
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/design-entry-pages`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Response:", response);
            
            toast.success("Design entry added successfully", { position: "top-right" });
    
            // Reset form
            setFormData({
                designer_name: "",
                design_status: "",
                tag: "",
                remark: "",
                design: "",
                part: "",
                process: "",
                start_date: "",
                end_date: "",
                processor: "",
                comments: "",
            });
            setSelectedImages({ img_upload: null, final_img_upload: null, cost_sheet: null });
            setPreviewImages({ img_upload: null, final_img_upload: null, cost_sheet: null });
    
        } catch (error) {
            console.error("Error posting design entry data:", error);
            toast.error("Failed to post design entry", { position: "top-right" });
    
            // Delete uploaded files
            for (const id of allUploadedIds) {
                try {
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/upload/files/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(`Rolled back image ID: ${id}`);
                } catch (deleteErr) {
                    console.error(`Failed to delete uploaded file with ID ${id}:`, deleteErr);
                }
            }
        } finally {
            setSubmitting(false);
        }
    };
    

    useEffect(() => {
        if (token) {
            // fetchJobberData();
            // fetchDesignMasterData();
            fetchDropDownData();
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    // const handlePin = (rowData) => {
    //     console.log("Pin Clicked:", rowData);
    //     // Perform pin action
    // };

    // const enhancedData = rawData.map((item) => ({
    //     ...item,
    //     Pin: (
    //         <button onClick={() => handlePin(item)}>
    //             <img src={PinIcon} alt="Pin" className="" />
    //         </button>
    //     ),
    // }));

    // console.log("formData: ", formData)

    return (
        <div className="py-2 bg-white rounded-lg relative">
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center mt-64 bg-opacity-50 bg-gray-200 z-10">
                    <BounceLoader size={100} color={"#1e3a8a"} loading={loading} />
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">{title}</h1>

                    {openNewDesignModal &&
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            {/* <DesgnGroup setDesignGroupModel={setDesignGroupModel} setRefresh={setRefresh} refresh={refresh} /> */}
                            <div className="bg-white p-6 w-[400px] rounded-lg shadow-lg border border-gray-300">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Add New Design</h2>

                                {/* Form */}
                                <form onSubmit={handleNewDesignSubmit}>
                                    {/* Design Name */}
                                    <div className="mb-4">
                                        <label className="text-gray-700 font-semibold block mb-1">Design Name</label>
                                        <input
                                            type="text"
                                            className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter New Design"
                                            name="design_name"
                                            value={newDesignForm.design_name}
                                            onChange={handleInputChangeDesign}
                                            required
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            type="button"
                                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-500 transition"
                                            onClick={() => setOpenNewDesignModal(false)}
                                            disabled={designSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={`bg-gray-500 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${designSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
                                                }`}
                                            disabled={designSubmitting}
                                        >
                                            {designSubmitting ? (
                                                <div className="flex justify-center items-center space-x-2">
                                                    <PuffLoader size={20} color="#fff" />
                                                    <span>Saving...</span>
                                                </div>
                                            ) : (
                                                "Save"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }

                    <form className="grid grid-cols-2 gap-6 p-5 rounded-lg border border-gray-200 shadow-md mb-16" onSubmit={handleSubmit}>

                        {/* Add new design Button inside container */}
                        <div className="col-span-2 flex border border-blue-500 justify-center mt-4 rounded p-2">
                            <div className="  ">
                                <button type="button" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                                    onClick={() => setOpenNewDesignModal(true)}
                                >
                                    Add New Design
                                </button>
                            </div>
                        </div>


                        {/* Name /Number of Design */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Name / Number of Design</label>
                            <select className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                name="design"
                                value={formData.design}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled selected>Name</option>
                                {designs.map((design, index) => (
                                    <option key={index} value={design?.id
                                    }>{design?.design_name
                                        }</option>
                                ))}
                            </select>
                        </div>

                        {/* Designer Name */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Designer Name</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Designer Name"
                                name="designer_name"
                                value={formData.designer_name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Status */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Status</label>
                            {/* <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Status" /> */}
                            <select
                                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                name="design_status"
                                value={formData.design_status}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled selected>
                                    Status
                                </option>
                                <option value="Pattern">Pattern</option>
                                <option value="Mok">Mok</option>
                                <option value="Khakha">Khakha</option>
                                <option value="Punching">Punching</option>
                                <option value="Sampling">Sampling</option>
                                <option value="Embroidery">Embroidery</option>
                                <option value="Part due">Part due</option>
                                <option value="Costing due">Costing due</option>
                                <option value="Ready for production">Ready for production</option>
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold">Tags</label>
                            <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tags"
                                name="tag"
                                value={formData.tag}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Remarks */}
                        <div className="flex flex-col col-span-2">
                            <label className="text-gray-700 font-semibold">Remarks</label>
                            <textarea className="border border-gray-300 bg-gray-100 rounded-md p-2 h-40 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" placeholder="Remarks..."
                                name="remark"
                                value={formData.remark}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        {/* <div className="flex gap-12 col-span-2">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Photo Upload</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        name="img_upload"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
                                    >
                                        Choose File
                                    </label>
                                    <span className="text-gray-500 ml-2">
                                        {selectedImage ? selectedImage.name : "No file chosen"}
                                    </span>
                                </div>
                                {previewImage && (
                                    <img src={previewImage} alt="Preview" className="mt-2 w-32 h-auto" />
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Final Photo Upload</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        name="final_img_upload"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
                                    >
                                        Choose File
                                    </label>
                                    <span className="text-gray-500 ml-2">
                                        {selectedImage ? selectedImage.name : "No file chosen"}
                                    </span>
                                </div>
                                {previewImage && (
                                    <img src={previewImage} alt="Preview" className="mt-2 w-32 h-auto" />
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Cost Sheet</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        name="cost_sheet"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
                                    >
                                        Choose File
                                    </label>
                                    <span className="text-gray-500 ml-2">
                                        {selectedImage ? selectedImage.name : "No file chosen"}
                                    </span>
                                </div>
                                {previewImage && (
                                    <img src={previewImage} alt="Preview" className="mt-2 w-32 h-auto" />
                                )}
                            </div>
                        </div> */}

                        {/* Photo Upload */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-2">Photo Upload</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="img_upload"
                                    className="hidden"
                                    name="img_upload"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="img_upload"
                                    className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
                                >
                                    Choose File
                                </label>
                                <span className="text-gray-500 ml-2">
                                    {selectedImages.img_upload ? selectedImages.img_upload.name : "No file chosen"}
                                </span>
                            </div>
                            {previewImages.img_upload && (
                                <img src={previewImages.img_upload} alt="Preview" className="mt-2 w-32 h-auto" />
                            )}
                        </div>

                        {/* Final Photo Upload */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-2">Final Photo Upload</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="final_img_upload"
                                    className="hidden"
                                    name="final_img_upload"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="final_img_upload"
                                    className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
                                >
                                    Choose File
                                </label>
                                <span className="text-gray-500 ml-2">
                                    {selectedImages.final_img_upload ? selectedImages.final_img_upload.name : "No file chosen"}
                                </span>
                            </div>
                            {previewImages.final_img_upload && (
                                <img src={previewImages.final_img_upload} alt="Preview" className="mt-2 w-32 h-auto" />
                            )}
                        </div>

                        {/* Cost Sheet */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-semibold mb-2">Cost Sheet</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="cost_sheet"
                                    className="hidden"
                                    name="cost_sheet"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="cost_sheet"
                                    className="bg-blue-500 text-white px-4 py-1 rounded-xl cursor-pointer"
                                >
                                    Choose File
                                </label>
                                <span className="text-gray-500 ml-2">
                                    {selectedImages.cost_sheet ? selectedImages.cost_sheet.name : "No file chosen"}
                                </span>
                            </div>
                            {previewImages.cost_sheet && (
                                <img src={previewImages.cost_sheet} alt="Preview" className="mt-2 w-32 h-auto" />
                            )}
                        </div>


                        {/* Table Section */}
                        <div className="col-span-2 mt-4">
                            <table className="w-full border border-gray-300 text-left">
                                <thead>
                                    <tr className="bg-blue-800 text-center text-white">
                                        <th className="border px-4 py-2">Part</th>
                                        <th className="border px-4 py-2">Process</th>
                                        <th className="border px-4 py-2">Start Date</th>
                                        <th className="border px-4 py-2">End Date</th>
                                        <th className="border px-4 py-2">Comments</th>
                                        <th className="border px-4 py-2">Processor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                className="w-full border rounded p-1"
                                                name="part"
                                                value={formData.part}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                className="w-full border rounded p-1"
                                                name="process"
                                                value={formData.process}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="date"
                                                className="w-full border rounded p-1"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="date"
                                                className="w-full border rounded p-1"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                className="w-full border rounded p-1"
                                                name="comments"
                                                value={formData.comments}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <select
                                                className="w-full border rounded p-1"
                                                name="processor"
                                                value={formData.processor}
                                                onChange={handleInputChange}
                                            >
                                                <option value="" disabled>Select</option>
                                                {processors.map((processor, i) => (
                                                    <option key={processor.id} value={processor.id}>
                                                        {processor?.design_number}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Buttons */}
                        <div className="col-span-2 flex justify-end mt-4">
                            <button type="button" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition">
                                Cancel
                            </button>
                            {/* <button type="submit" className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition ml-4">
                                Save
                            </button> */}
                            <button
                                type="submit"
                                className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                    }`}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <div className="flex justify-center items-center space-x-2">
                                        <PuffLoader size={20} color="#fff" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mb-16">
                        <SmartTable headers={headers} data={rawData} />
                    </div>
                </div>)}
        </div>
    );
};

export default DesignEntry;

