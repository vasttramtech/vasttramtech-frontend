import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';

const SfgStock = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [semiFinishedGoods, setSemiFinishedGoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/custom/getAllStockSfg`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // console.log("Responce ", response.data)
                if (response.data?.data) {
                    setSemiFinishedGoods(response.data.data);
                } else {
                    setError("No raw material data found.");
                }

            } catch (error) {
                console.error("Error fetching raw material data:", error);
                setError("Failed to fetch raw material data.");
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, token]);

    const handlePrint = () => {
        const printContent = document.getElementById("printable-content").innerHTML;

        const printWindow = window.open('', '', 'height=800,width=1200');
        printWindow.document.write(`
                <html>
                    <head>
                        <title>Semi Finished Goods Stock Report</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                            }
                            h1 {
                                text-align: center;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                            }
                            th, td {
                                border: 1px solid #ccc;
                                padding: 8px;
                                text-align: center;
                            }
                            th {
                                background-color: #f8f8f8;
                            }
                            .vasttram{
                                text-align: left;
                                color: #236;
                            }
                            
                            header {
                                text-align: center;
                                margin-bottom: 40px;
                                border-bottom: 2px solid #444;
                                padding-bottom: 10px;
                            }
                        </style>
                    </head>
                    <body>
    
                     <h3 class="vasttram"> Vasttram</h3>
                        <header>
                            <h1>Semi Finished Stock Report</h1>
                            <p>Generated on: <script>document.write(new Date().toLocaleString());</script></p>
                        </header>
                
                        <div class="container">${printContent}</div>
                      
                        <script>
                            window.onload = function() {
                                window.print();

                                setTimeout(()=> window.close(), 500);
                                window.onafterprint = () => {
                                    window.close();
                                };
                            };
                        </script>
                    </body>
                </html>
            `);
        printWindow.document.close();
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BounceLoader color="#1e3a8a" />
            </div>
        )
    }
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="w-4/5 mx-auto mt-6 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Semi Finished Goods Stock</h2>
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                    Print
                </button>
            </div>

            <div className="overflow-x-auto" id="printable-content">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-center">Stock ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">SFG ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Group</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">SFG Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Color</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Available Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semiFinishedGoods.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.id}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.semi_finished_goods_master?.semi_finished_goods_id || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.semi_finished_goods_master?.group?.group_name || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.semi_finished_goods_master?.semi_finished_goods_name
                                    || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item.semi_finished_goods_master?.color?.color_name || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 font-semibold text-blue-600 text-center">{`${item.Quantity} ${item?.semi_finished_goods_master.unit?.unit_name}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SfgStock
