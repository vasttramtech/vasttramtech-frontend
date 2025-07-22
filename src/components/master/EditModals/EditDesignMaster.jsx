import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PuffLoader, BounceLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HandleBOMsfg from "./HandleBOMsfg";
import HandeBOMrawMaterial from "./HandleBOMrawMaterial";
import FormLabel from "../../purchase/FormLabel";
import SFGBomSection from "../SFGBomSection";
import SFGDataTable from "../component/SFGDataTable";
import { MdCancel } from "react-icons/md";

const EditDesignMaster = ({
  setOpenEditModel,
  designGroup,
  fetchDesignMasterData,
  unit,
  sfgmGroup,
  rawMaterialGroup,
  BOMsfgHeader,
  BOMRawMaterial,
  designGroupModel,
  selectedRow,
  colors,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    design_group: "",
    design_number: "",
    color: "",
    total_design_cost: "",
    unit: "",
    description: "",
  });
  const [ExistingSfgItems, setExistingSfgItems] = useState([]);
  const [SavedSfgData, setSavedSfgData] = useState([]);

  const [visibleSfgItems, setVisibleSfgItems] = useState([...ExistingSfgItems, ...SavedSfgData]);

  const [ExistingRawMaterial, setExistingRawMaterial] = useState([]);
  const [finalRawMaterialData, setFinaalRawMaterialData] = useState([]);
  const [FinalSFGData, setFinalSFGData] = useState([]);

  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [jobberList, setJobberList] = useState([]);
  const [SFGBom, setSFGBom] = useState([]);


  // const [updateDaata,setUpdateData]=use
  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/custom/${selectedRow?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Design Data", response);
        if (response.data) {
          const data = response.data;
          setExistingSfgItems(data?.semi_finished_goods_entries || []);
          setExistingRawMaterial(data?.raw_material_entries || []);
          setFormData({
            design_group: data?.design_group?.id || "",
            design_number: data?.design_number || "",
            color: data?.color?.id || "",
            unit: data?.unit?.id || "",
            description: data?.description || "",
            total_design_cost: data?.total_design_cost || "",
            image: data?.image
              ? data.image.map((img) => ({ id: img.id, url: img.url }))
              : [],
          });
          setSelectedImage(
            Array.isArray(data?.image) && data.image.length > 0
              ? data.image[0].url
              : ""
          );
          if (Array.isArray(data?.image) && data.image.length > 0) {
            setPreviewImage(
              `${data.image[0].url}`
            );
          } else {
            setPreviewImage(null);
          }
        } else {
          setError("No design data found.");
        }
      } catch (error) {
        console.error("Error fetching design data:", error);
        setError("Failed to fetch design data.");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    // console.log(finalRawMaterialData,FinalSFGData)

    if (selectedRow?.id) {
      fetchDesignData();
    }
  }, [token, selectedRow]);



  const fetchPageData = async () => {
    try {
      const [availableRawMaterial, availableJobbers] = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/custom/all-raw-material`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/jobber-master/custom/all-jobber`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const rawMaterials = availableRawMaterial?.data?.map((entry) => ({
        item_name: entry.item_name,
        price_per_unit: entry.price_per_unit,
        unit: entry.unit?.unit_name || null,
        color: entry.color?.color_name || null,
        group: entry.group?.group_name || null,
        hsn_sac_code: entry.hsn_sac_code?.hsn_sac_code || null,
        id: entry.id,
      }));
      const jobbers = availableJobbers?.data?.map((entry) => ({
        jobber_name: entry.jobber_name,
        jobber_id: entry.jobber_id,
        work_type: entry.work_type,
        jobber_address: entry.jobber_address,
        id: entry.id,
      }));

      setRawMaterialList(rawMaterials);
      setJobberList(jobbers);


    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to fetch data."
      );
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [selectedRow, token]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let uploadedImageIds = [];

    // Track old image IDs for deletion
    const oldImageIds = formData.image.map((img) => img.id);

    // Upload new image if selected
    if (selectedImage && selectedImage instanceof File) {
      // Check if `selectedImage` is a new file
      const formDataUpload = new FormData();
      formDataUpload.append("files", selectedImage);

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
        if (
          uploadResponse.data &&
          Array.isArray(uploadResponse.data) &&
          uploadResponse.data.length > 0
        ) {
          uploadedImageIds = [uploadResponse.data[0].id]; // Store new image ID
        }
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
      }
    } else if (Array.isArray(formData.image) && formData.image.length > 0) {
      uploadedImageIds = formData.image.map((img) => img.id);
    } else if (typeof formData.image === "string") {
      uploadedImageIds = [selectedRow?.image?.[0]?.id];
    }

    const imagesToDelete = oldImageIds.filter(
      (oldId) => !uploadedImageIds.includes(oldId)
    );

    // Delete old images from DigitalOcean
    try {
      for (let imageId of imagesToDelete) {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/upload/files/${imageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(`Old image with ID ${imageId} deleted.`);
      }
    } catch (deleteError) {
      console.error("Error deleting old image(s):", deleteError);
    }

    // Map dropdown text values to their corresponding IDs
    const documentId = selectedRow?.id;
    const id = selectedRow?.item_id;
    // const updatedSemiFinishedGoodsEntries = [ ...ExistingSfgItems, ...FinalSFGData]


    const updatedData = {
      data: {
        id: id,
        documentId: documentId,
        design_group: Number(formData.design_group),
        color: formData.color,
        design_number: formData.design_number,
        unit: formData.unit,
        description: formData.description,
        image: uploadedImageIds,
        semi_finished_goods_entries: [...ExistingSfgItems, ...FinalSFGData], // ✅ fix is here
        total_design_cost: Number(formData.total_design_cost),
      },
    };

    // console.log("Updated Data ",updatedData);

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchDesignMasterData();
      toast.success("Data updated successfully", { position: "top-right" });
      setOpenEditModel(false);
    } catch (error) {
      console.log("Error updating design master data:", error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to update data"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview the image
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const items = [...ExistingSfgItems, ...FinalSFGData];
    if (items.length === 0) {
      setFormData({
        ...formData,
        total_design_cost: 0,
      });
      return;
    }
    console.log(ExistingSfgItems);
    const sfgPrice = items.reduce(
      (total, sfg) => total + (Number(sfg.total_price) || 0),
      0
    );
    setFormData({
      ...formData,
      total_design_cost: sfgPrice,
    });
    // console.log(sfgPrice + rawmaterialPrice);
  }, [FinalSFGData, ExistingSfgItems]);

  useEffect(() => {
    const visible = [...ExistingSfgItems, ...SavedSfgData];
    setVisibleSfgItems(visible);
  }, [ExistingSfgItems, SavedSfgData])


  const handleDeleteSfg = async (index) => {
    const existingLength = ExistingSfgItems.length;

    if (index < existingLength) {
      // This item is from ExistingSfgItems
      const updatedExisting = [...ExistingSfgItems];
      updatedExisting.splice(index, 1);
      setExistingSfgItems(updatedExisting);
    } else {
      // This item is from SavedSfgData
      const savedIndex = index - existingLength;

      const updatedSaved = [...SavedSfgData];
      updatedSaved.splice(savedIndex, 1);
      setSavedSfgData(updatedSaved);

      // Also update FinalSFGData accordingly (if needed)
      const updatedFinal = [...FinalSFGData];
      updatedFinal.splice(savedIndex, 1); // Assuming index matches
      setFinalSFGData(updatedFinal);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center border-b pb-2">
        <h1 className="font-bold text-blue-900 text-xl">Edit design master</h1>
        <button
          onClick={() => setOpenEditModel(false)}
          className="text-red-500 hover:text-red-700 hover:scale-105 transition-all duration-200 ease-in-out"
        >
          <MdCancel className="w-8 h-8" />
        </button>
      </div>


      <form
        className="grid grid-cols-2 gap-6 p-2 mb-16"
      >
        {/* Design Group */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Design Group</label>
          <div className="flex items-center gap-2">
            <select
              name="design_group"
              className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleInputChange}
              defaultValue=""
              value={formData.design_group}
              disabled
            >
              <option value="" disabled>
                Select Design Group
              </option>
              {designGroup.map((group) => (
                <option key={group?.id} value={group?.id}>
                  {group?.group_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Design Number */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Design Number</label>
          <input
            type="text"
            name="design_number"
            className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Design Number"
            disabled
            value={formData.design_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Color</label>
          <select
            name="color"
            className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleInputChange}
            defaultValue=""
            value={formData.color}
            disabled
          >
            <option value="" disabled>
              Select Color
            </option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {`${color.color_id.slice(0, 10) + ".."} - ${color.color_name.slice(0, 15) + ".."}`}
              </option>
            ))}
          </select>
        </div>
        {/* Unit (Jobber Code) */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">
            Unit
          </label>
          <div className="flex items-center gap-2">
            <select
              name="unit"
              className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.unit}
              onChange={handleInputChange}
              disabled
            >
              <option value="" disabled>
                Select Jobber Code
              </option>
              {unit.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Description</label>
          <textarea
            name="description"
            className="border border-gray-300 bg-gray-100 rounded-md p-2 h-24 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        {/* Photo Upload */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">
            Photo Upload
          </label>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-900 text-white px-4 py-1 rounded-xl cursor-pointer"
            >
              Choose File
            </label>
            <span className="text-gray-500 ml-2">
              {selectedImage ? selectedImage.name : "No file chosen"}
            </span>
          </div>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 w-32 h-auto"
            />
          )}
        </div>


        {/* Add BOM Button */}
        {!designGroupModel && (
          <div className=" flex flex-col gap-5 my-5 col-span-2">
            <div className="">
              <h1 className="text-xl font-semibold text-black mb-4">Add BOM</h1>
              {!designGroupModel && (
                <SFGBomSection
                  token={token}
                  sfgmGroup={sfgmGroup}
                  SavedSfgData={SavedSfgData}
                  setSavedSfgData={setSavedSfgData}
                  FinalSFGData={FinalSFGData}
                  setFinalSFGData={setFinalSFGData}
                  allJobber={jobberList}
                  allRawMaterial={rawMaterialList}
                />
              )}

              {(visibleSfgItems.length > 0) && (
                <SFGDataTable
                  savedSfgData={visibleSfgItems}
                  onDeleteSfg={handleDeleteSfg}
                />
              )}



            </div>
          </div>
        )}
        <div className="col-span-2 flex justify-center items-center gap-2">
          <FormLabel title={"Total cost: "} />
          <input
            className="p-2 border bg-gray-100 border-gray-300 rounded-md"
            type="text"
            placeholder="0.0"
            name="total_design_cost"
            value={formData.total_design_cost}
            disabled
          />
        </div>
        {/* Buttons */}
        <div className="col-span-2 flex justify-end mt-4">
          <button
            type="button"
            className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-600 hover:text-white transition"
            onClick={() => setOpenEditModel(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleUpdate}
            className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            disabled={submitting}
          >
            {submitting ? (
              <div className="flex justify-center items-center space-x-2">
                <PuffLoader size={20} color="#fff" />
                <span>Updating...</span>
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDesignMaster;
