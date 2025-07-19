import SmartTable from "../../smartTable/SmartTable";
// import { useNavigate } from "react-router-dom";
import ViewIcon from "../../assets/Others/ViewIcon.png";
import EditIcon from "../../assets/Others/EditIcon.png";
import PinIcon from "../../assets/Others/PinIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { PuffLoader, BounceLoader } from "react-spinners";
import { toast } from "react-toastify";
import DesgnGroup from "./DesignGroup";
import UnitGroup from "./UnitGroup";
import EditDesignMaster from "./EditModals/EditDesignMaster";
import FormLabel from "../purchase/FormLabel";
import DeleteTable from "../../smartTable/DeleteTable";
import Pagination from "../utility/Pagination";
import { checkFileSize } from "../utility/ImgCheck";
import { Loader2, Plus } from "lucide-react";
import SFGBomComponent from "./SFGBomComponent";
import SFGBomSection from "./SFGBomSection";
import SFGDataTable from "./component/SFGDataTable";
import { useLocation, useNavigate } from "react-router-dom";

const headers = [
  "document_id",
  "Group",
  "Design Number",
  "Color",
  "Description",
  "Unit",
  "Item Id",
  "View  Edit"
];

const BOMsfgHeader = [
  "SFG group",
  "Material",
  "Color",
  "Jobber",
  "Quantity",
  "Total Cost",
  "Description",
];

const DesignMaster = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [designMaster, setDesignMaster] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [designGroupModel, setDesignGroupModel] = useState(false);
  const [unitModel, setUnitModel] = useState(false);
  const [designGroup, setDesignGroup] = useState([]);
  const [unit, setUnit] = useState([]);
  const [colors, setColors] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [openEditModal, setOpenEditModel] = useState(false);
  const [SavedSfgData, setSavedSfgData] = useState([]);
  const [refreshTable, setRefreshTable] = useState(0);
  const [sfgmGroup, setsfgmGroup] = useState([]);
  const [sfgMaterials, setsfgMaterials] = useState([]);
  const [sfgColors, setSfgColors] = useState([]);
  const [sfgJobber, setSfgJobber] = useState([]);

  const [availableSFG, setAvailableSFG] = useState([]);
  const [availableSFGBasedOnMaterial, setAvailableSFGBasedOnMaterial] =
    useState([]);
  const [availableSFGBasedOnColor, setAvailableSFGBasedOnColor] = useState();
  const [selectedJobber, setSelectedJobber] = useState();
  const [FinalSFGData, setFinalSFGData] = useState([]);

  //  adding pagination logic
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const [rawMateralList, setRawMateralList] = useState([]);
  const [jobberList, setJobberList] = useState([]);
  const [SFGBom, setSFGBom] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  // const [rmLoader, setRmLoader] = useState(false);
  // const [sfgLoader, setSfgLoader] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    design_group: "",
    design_number: "",
    color: "",
    unit: "",
    description: "",
    total_design_cost: 0,
  });

  const [reduxLoading, setReduxLoading] = useState(false);

  const {
    load,
    error,
    availableDesignMasterGroups,
    colorCategories,
    availableUnits,
    availableSfgmGroups,
  } = useSelector((state) => state.fetchData);

  const location = useLocation();

  useEffect(() => {
    setReduxLoading(load);
  }, [load]);

  useEffect(() => {
    // console.log(availableDesignGroups)
    if (
      availableDesignMasterGroups &&
      Array.isArray(availableDesignMasterGroups) &&
      availableDesignMasterGroups.length > 0
    )
      setDesignGroup(availableDesignMasterGroups);
    else setDesignGroup([]);
  }, [availableDesignMasterGroups]);

  useEffect(() => {
    if (
      colorCategories &&
      Array.isArray(colorCategories) &&
      colorCategories.length > 0
    )
      setColors(colorCategories);
    else setColors([]);
  }, [colorCategories]);

  useEffect(() => {
    if (
      availableUnits &&
      Array.isArray(availableUnits) &&
      availableUnits.length > 0
    )
      setUnit(availableUnits);
    else setUnit([]);
  }, [availableUnits]);

  useEffect(() => {
    if (
      availableSfgmGroups &&
      Array.isArray(availableSfgmGroups) &&
      availableSfgmGroups.length > 0
    )
      setsfgmGroup(availableSfgmGroups);
    else setsfgmGroup([]);
  }, [availableSfgmGroups]);

  const handleDeleteSfg = (index) => {
    // Create a new array without the deleted item
    const updatedSfgData = [...SavedSfgData];
    updatedSfgData.splice(index, 1);
    setSavedSfgData(updatedSfgData);
    const updatedfinalSfgdata = [...FinalSFGData];
    updatedfinalSfgdata.splice(index, 1);
    setFinalSFGData(updatedfinalSfgdata);
  };

  const handleFieldBlur = async () => {
    const { design_group, design_number, color } = formData;

    const allFilled =
      String(design_group).trim() !== "" &&
      String(design_number).trim() !== "" &&
      String(color).trim() !== "";

    if (allFilled && !hasTriggered) {
      setHasTriggered(true);

      const postData = {
        design_group: Number(design_group),
        color: Number(color),
        design_number: design_number,
      };

      try {
        setLoading(true);
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/design-masters/check-unique`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("res check unique: ", res)

        toast.success(res.data.message || "Design is unique!", {
          position: "top-right",
        });
        setLoading(false);
        setHasTriggered(false);
      } catch (error) {
        const err = error?.response?.data?.error;
        console.log("error check unique: ", err);
        if (err.status === 409) {
          toast.error(
            <div>
              <strong>{err?.message}</strong>
            </div>
          );
          setFormData({
            design_group: "",
            design_number: "",
            color: "",
          });
        }
        setLoading(false);
        setHasTriggered(false);

      }
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDesignMasterData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);




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

      const rawMaterials = availableRawMaterial?.data?.map((entry) => (
        console.log(entry),
        {
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

      setRawMateralList(rawMaterials);
      setJobberList(jobbers);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to fetch data."
      );
    }
  };

  const fetchDesignMasterData = async () => {
    try {
      setPaginationLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/design-masters?populate=*`,
        {
          params: {
            "pagination[page]": page,
            "pagination[pageSize]": pageSize,
            "sort[0]": "createdAt:desc",
            ...(searchTerm && {
              "filters[$or][0][design_number][$containsi]": searchTerm,
              "filters[$or][1][description][$containsi]": searchTerm,
              "filters[$or][2][color][color_name][$containsi]": searchTerm,
              "filters[$or][3][design_group][group_name][$containsi]": searchTerm,
            }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTotalPages(response.data.meta.pagination.pageCount);

      const designData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const mappedDesign = designData.map((design) => ({
        id: design?.documentId,
        group: design?.design_group?.group_name,
        design_number: design.design_number,
        color: design.color?.color_name,
        description: design.description,
        unit: design?.unit?.unit_name,
        item_id: design?.id,
      }));

      setRefreshTable((prev) => prev + 1);
      setDesignMaster(mappedDesign);
    } catch (error) {
      console.error("Error fetching design master data:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setPaginationLoading(false);
    }
  };


  useEffect(() => {
    if (FinalSFGData.length === 0) {
      setFormData({
        ...formData,
        total_design_cost: 0,
      });
      return;
    }

    // Ensure total_price is a valid number
    const sfgPrice = FinalSFGData.reduce(
      (total, sfg) => total + (Number(sfg.total_price) || 0),
      0
    );
    // console.log(sfgPrice); // Check if it's now a valid number

    setFormData({
      ...formData,
      total_design_cost: sfgPrice,
    });
  }, [FinalSFGData]);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        setLoading(true);
        if (token) {
          await fetchDesignMasterData();
          await fetchPageData();
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.error?.message || "Failed to fetch data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDatas();
  }, [token, navigate, refresh]);

  useEffect(() => {
    fetchDesignMasterData();
  }, [page, pageSize]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && checkFileSize(file, 1024 * 1024)) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      // Create a safe copy of the file using blob
      const arrayBuffer = await file.arrayBuffer();
      const safeFile = new File([arrayBuffer], file.name, { type: file.type });

      setSelectedImage(safeFile); // 👈 using copy, not the original
      const previewUrl = URL.createObjectURL(file); // okay to preview original
      setPreviewImage(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.design_group == "" ||
      formData.color == "" ||
      formData.design_number == ""
    ) {
      alert("Design Group, Color, Design Number and Total Design Cost is required");
      return;
    }

    setSubmitting(true);

    let uploadedImageIds = [];

    if (selectedImage) {
      const formDataUpload = new FormData();
      formDataUpload.append("files", selectedImage);

      try {
        const uploadResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
          formDataUpload, // 👈 Corrected body here
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(uploadResponse.data);
        if (
          uploadResponse.data &&
          Array.isArray(uploadResponse.data) &&
          uploadResponse.data.length > 0
        ) {
          uploadedImageIds = [uploadResponse.data[0].id];
        }
      } catch (uploadError) {
        toast.error("Problem in image uploading");
        console.error("Error uploading image:", uploadError);
        setSubmitting(false);
        return;
      }
    }

    const postData = {
      data: {
        design_group: Number(formData.design_group),
        color: Number(formData.color),
        design_number: formData.design_number,
        unit: Number(formData.unit),
        description: formData.description,
        image: uploadedImageIds,
        semi_finished_goods_entries: FinalSFGData,
        total_design_cost: Number(formData.total_design_cost),
      },
    };

    console.log(postData);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/design-masters`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Data added Successfully", { position: "top-right" });

      // Reset form
      setFormData({
        design_group: "",
        design_number: "",
        color: "",
        unit: "",
        description: "",
        sfg_group: "",
        raw_material: "",
        process: "",
        qty: "",
        sfg_material: "",
        bom_description: "",
      });
      setFinalSFGData([]);
      setSelectedImage(null);
      setPreviewImage(null);
      fetchDesignMasterData();
      setSavedSfgData([]);
      setSelectedJobber();
      setAvailableSFGBasedOnColor([]);
      setAvailableSFGBasedOnMaterial([]);
    } catch (error) {
      console.log(error);
      console.error("Error posting design master data:", error);

      //Delete uploaded image if API fails
      if (uploadedImageIds.length > 0) {
        try {
          await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/upload/files/${uploadedImageIds[0]}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(`Rolled back image ID: ${uploadedImageIds[0]}`);
        } catch (deleteError) {
          console.error(`Error deleting uploaded image:`, deleteError);
        }
      }

      // toast.error(
      //   error?.response?.data?.error?.message || "Something went wrong"
      // );
      const err = error?.response?.data?.error;
      toast.error(
        <div>
          <strong>{err?.message || "Error creating Design Master."}</strong>
          <div>{err?.details || "Something went wrong"}</div>
        </div>
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = (rowData) => {
    navigate(`/design-master/${rowData.id}`);
  };

  const handleEdit = (rowData) => {
    // console.log("Edit Clicked:", rowData);
    setSelectedRow(rowData);
    setOpenEditModel(true);
  };

  const handlePin = (rowData) => {
    console.log("Pin Clicked:", rowData);
  };


  const clearHandler = (e) => {
    setFormData({
      design_group: "",
      design_number: "",
      color: "",
      unit: "",
      description: "",
      sfg_group: "",
      raw_material: "",
      process: "",
      qty: "",
      sfg_material: "",
      bom_description: "",
    });
    setFinalSFGData([]);
    setSelectedImage(null);
    setPreviewImage(null);

    setSavedSfgData([]);
    setSelectedJobber();
    setAvailableSFGBasedOnColor([]);
    setAvailableSFGBasedOnMaterial([]);
  }

  const enhancedData = designMaster.map((item) => ({
    ...item,
    Actions: (
      <div className="flex justify-center items-center space-x-2">
        <button onClick={() => handleView(item)}>
          <img src={ViewIcon} alt="View" className="mr-4 w-4" />
        </button>
        <button onClick={() => handleEdit(item)}>
          <img src={EditIcon} alt="Edit" className="w-4" />
        </button>
      </div>
    ),
    // Pin: (
    //   <button onClick={() => handlePin(item)}>
    //     <img src={PinIcon} alt="Pin" className="w-4" />
    //   </button>
    // ),
  }));



  if (loading || reduxLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#1e3a8a" />
      </div>
    )
  }


  return (
    <div className="p-6 bg-white rounded-lg relative">

      <div>
        <h1 className="text-2xl border-b pb-2 font-bold text-blue-900 mb-4">
          Design Master
        </h1>

        {openEditModal && (

          <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-[90%] max-w-4xl">
              <EditDesignMaster
                setOpenEditModel={setOpenEditModel}
                selectedRow={selectedRow}
                designGroup={designGroup}
                setDesignGroupModel={setDesignGroupModel}
                colors={colors}
                unit={unit}
                fetchDesignMasterData={fetchDesignMasterData}
                sfgmGroup={sfgmGroup}
                BOMsfgHeader={BOMsfgHeader}
                designGroupModel={designGroupModel}
              />
            </div>
          </div>
        )}

        {designGroupModel && (

          <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
            <DesgnGroup
              setDesignGroupModel={setDesignGroupModel}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        )}

        {unitModel && (
          <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-50 flex justify-center items-center z-50">
            <UnitGroup
              setUnitModel={setUnitModel}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        )}

        <form className="rounded-lg mb-4 border  shadow-md p-5" onSubmit={handleSubmit}>
          <div className=" grid grid-cols-2 gap-6 p-2 mb-16">
            {/* Design Group */}

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Design Group
              </label>
              <div className="flex items-center gap-2">
                <select
                  name="design_group"
                  className="flex-grow border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleInputChange}
                  onBlur={handleFieldBlur}
                  defaultValue=""
                  value={formData.design_group}
                >
                  <option value="" disabled>
                    Select Design Group
                  </option>
                  {designGroup.map((group, index) => (
                    <option key={group?.id} value={group?.id}>
                      {group?.group_name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className=" bg-blue-900 text-white rounded-full p-2 hover:bg-blue-700 transition-all duration-200 ease-in-out"
                  onClick={() => setDesignGroupModel(true)}
                >
                  <Plus className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>

            {/* Design Number */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Design Number
              </label>
              <input
                type="text"
                name="design_number"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Design Number"
                value={formData.design_number}
                onChange={handleInputChange}
                onBlur={handleFieldBlur}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Color</label>
              <select
                name="color"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto overflow-x-hidden"

                onChange={handleInputChange}
                onBlur={handleFieldBlur}
                defaultValue=""
                value={formData.color}
              >
                <option value="" disabled>
                  Select Color
                </option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {`${color.color_id.slice(0, 10)} - ${color.color_name?.slice(0, 15)}`}
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
                >
                  <option value="" disabled>
                    Select Unit
                  </option>
                  {unit.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 bg-blue-900 text-white rounded-full text-xl hover:bg-blue-700 transition"
                  onClick={() => setUnitModel(true)}
                >
                  <Plus className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">
                Description
              </label>
              <textarea
                name="description"
                className="border border-gray-300 bg-gray-100 rounded-md p-2 h-24 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            {/* Photo Upload */}
            {!designGroupModel && (
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
                    className="bg-blue-900 text-white px-4 py-2 rounded-xl cursor-pointer"
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
            )}
          </div>

          {/* Changing UI of BOM */}
          <h1 className="text-2xl font-bold text-black ">Add BOM</h1>
          {!designGroupModel && (
            <SFGBomSection
              token={token}
              sfgmGroup={sfgmGroup}
              SavedSfgData={SavedSfgData}
              setSavedSfgData={setSavedSfgData}
              FinalSFGData={FinalSFGData}
              setFinalSFGData={setFinalSFGData}
              allJobber={jobberList}
              allRawMaterial={rawMateralList}
            />
          )}

          {SavedSfgData &&
            Array.isArray(SavedSfgData) &&
            SavedSfgData.length > 0 && (
              <SFGDataTable
                onDeleteSfg={handleDeleteSfg}
                savedSfgData={SavedSfgData}
              />
            )}

          <div className="mt-4 bg-blue-900 inline-block py-2 px-4 rounded-md text-white ">
            <label className="text-white font-semibold pr-5">Total Design Cost</label>
            <input
              className="p-2 border bg-gray-100 border-gray-300 rounded-md text-black"
              type="text"
              placeholder="0.0"
              name="total_design_cost"
              value={formData?.total_design_cost}
              disabled
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={clearHandler}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-500 transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-900 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${submitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
                }`}
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex justify-center items-center space-x-2">
                  <PuffLoader size={20} color="#fff" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Design"
              )}
            </button>
          </div>
        </form>

        <div className="mt-10">

          <div className="">
            <h3 className="text-2xl font-bold text-blue-900 pb-2 border-b">List Of Designs</h3>
          </div>

          <SmartTable
            headers={headers}
            data={enhancedData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loading={paginationLoading}
            setLoading={setPaginationLoading}
          />

          <Pagination
            setPage={setPage}
            totalPages={totalPages}
            page={page}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        </div>
      </div>

    </div>
  );
};

export default DesignMaster;
