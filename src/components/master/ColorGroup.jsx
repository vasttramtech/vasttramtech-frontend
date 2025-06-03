import { useState } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ColorGroup = ({ setColorModel ,setRefresh,refresh }) => {
    const [color, setColor] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { token } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form refresh
        setSubmitting(true); // Show loading state

        const payload = {
            data: {
                color_name: color
            }
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/colors`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // Reset form and close modal
            setColor("");
            toast.success("Color saved successfully!", { position: "top-right" });
            setColorModel(false);
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit the form. Please try again.");
        } finally {
            setSubmitting(false); // Hide loading state
            setRefresh(!refresh);
        }
    };

    return (
        <div className="bg-white p-6 w-[400px] rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Add Color Group</h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Color Group */}
                <div className="mb-4">
                    <label className="text-gray-700 font-semibold block mb-1">Color</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter unit name"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-500 transition"
                        onClick={() => setColorModel(false)}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`bg-gray-500 ml-2 px-6 py-2 rounded text-white font-semibold transition-all ease-in-out duration-300 transform ${
                            submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
                        }`}
                        disabled={submitting}
                    >
                        {submitting ? (
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
    );
};

export default ColorGroup;
