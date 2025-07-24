
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import { useSelector } from "react-redux";

const SemiFinishedStockReport = () => {
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
                    `${process.env.REACT_APP_BACKEND_URL}/api/semi-finished-goods-stocks?populate[semi_finished_goods_master][populate][group]=*&populate[color]=*&populate[processes]=*`,
                    {
                        params: {
                            "pagination[page]": 1,
                            "pagination[pageSize]": 100000,
                        },
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                // console.log(response)
                if (response.data?.data) {
                    const data = response.data.data.filter(item => item.qty > 0);
                    setSemiFinishedGoods(data);
                } else {
                    setError("No Semi Finished Goods data found.");
                }
            } catch (error) {
                console.error("Error fetching Semi Finished Goods data:", error);
                setError("Failed to fetch semi finished goods data.");
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, token]);
    console.log("SFG ITems", semiFinishedGoods);

    const handlePrint = () => {
        const printContent = document.getElementById("printable-content").innerHTML;

        const printWindow = window.open('', '', 'height=800,width=1200');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Raw Materials Stock Report</title>
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
                        <h1>Raw Materials Stock Report</h1>
                        <p>Generated on: <script>document.write(new Date().toLocaleString());</script></p>
                    </header>
            
                    <div class="container">${printContent}</div>
                  
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(()=> window.close(), 500);
                            window.onafterprint = function () {
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
                <h2 className="text-xl font-bold text-blue-900">Semi Finished Goods Stock</h2>
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
                            <th className="border border-gray-300 px-4 py-2 text-center">SFG ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Item ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Group Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Item Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Color</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Process</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Current Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semiFinishedGoods.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="border border-gray-300 px-4 py-2 text-center">{item?.id}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item?.semi_finished_goods_master?.id || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item?.semi_finished_goods_master?.group?.group_name || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item?.semi_finished_goods_master?.semi_finished_goods_name || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">{item?.color?.color_name || "N/A"}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <div className="flex flex-wrap gap-1">
                                        {item.processes && item.processes.map((temp, idx) => (
                                            <div key={idx} className="bg-gray-300 rounded px-2 font-semibold">{temp?.processes}</div>
                                        ))}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 font-semibold text-blue-600 text-center">{item?.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SemiFinishedStockReport
