import { useEffect, useState } from "react";
import SmartTable2 from "../../smartTable/SmartTable2";
import axios from "axios";
import { useSelector } from "react-redux";

const SelectSOTable = ({
    NoOfColumns,
    data,
    headers,
    setSelectedRow,
    setSelectSOModal,
    selectedSOId,
    setSelectedSOId,
    type,
    setLoading,
    navigate,
    setSalesOrder,
    setBom,
    setSOViewModal,
    company,
    setFormData
}) => {
    // console.log(setOfSelectedIndex);
    const { token } = useSelector((state) => state.auth);
    const [updatedData, setUpdatedData] = useState([]);
    const [updatedHeader] = useState(["select", ...headers]);
    const updateTableData = () => {
        const updatedValues = data.map((item) => ({
            select: (
                <input
                    type="checkbox"
                    checked={selectedSOId === item.id}
                    onChange={() => handleClick(item.id)}
                    key={item.id}
                />
            ),
            ...item,
        }));

        const selectedRow = data.find((item) => item.id === selectedSOId);
        setSelectedRow(selectedRow ? [selectedRow] : []);
        setUpdatedData(
            updatedValues.map((item) =>
                Object.fromEntries(Object.entries(item).slice(0, NoOfColumns + 1))
            )
        );
    };

    const handleClick = async (id) => {
        setSelectedSOId(id);
        type === "internal-sales-order-entries" ? type = "internal-sales-order-entry" : type = "sales-oder-entries";

        try {
            setLoading(true);

            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${type}/find-by-id/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(data);

            if (data) {
                console.log("This is response:", data);
                const so_id = data?.so_id;


                setSalesOrder(data);
                // setBom(data.extra_bom_so[0]);
                // Fetch the Extra_bom from the response
                const extraBom = data.extra_bom_so[0]?.Extra_bom || [];

                // Fetch extra_bomSfg_fromStock from the response
                const extraBomFromStock = data?.extra_bomSfg_fromStock || [];

                // Merge extra_bomSfg_fromStock into Extra_bom, without changing the structure
                const mergedExtraBom = [...extraBom, ...extraBomFromStock];

                // Set the merged Extra_bom in the BOM
                setBom({
                    ...data.extra_bom_so[0],  // Keep the other BOM data intact
                    Extra_bom: mergedExtraBom,  // Merge the Extra_bom with extra_bomSfg_fromStock
                });
                setFormData(prev => ({
                    ...prev,
                    date : new Date().toISOString().split("T")[0],
                    remarks: data?.remark,
                    processor:data?.processor?.id,
                    merchandiser:data?.merchandiser?.id,
                    purchaser_details: company.gst_no
                }));
            }

        } catch (error) {
            console.error("Error fetching jobber data:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }

        setSelectSOModal(false);
        setSOViewModal(true);
    };

    useEffect(() => {
        updateTableData();
    }, [data, selectedSOId]);
    return <SmartTable2 data={updatedData} headers={updatedHeader} />;
};

export default SelectSOTable;