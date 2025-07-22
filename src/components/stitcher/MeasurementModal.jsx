import { MdCancel } from "react-icons/md";

const MeasurementModal = ({
    setMeasurementModal,
    lhSh,
    setLhSh,
    bpGrownKurti,
    setBpGrownKurti,
    setShowMeasurement
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Check which group it belongs to
        if (name in lhSh) {
            setLhSh((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else if (name in bpGrownKurti) {
            setBpGrownKurti((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 backdrop-blur-md bg-opacity-40">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-lg p-6 overflow-y-auto ml-40">
                {/* Header */}
                <div className="flex justify-between items-center top-0 border-b bg-white z-10 mb-4">
                    <h1 className="text-2xl font-bold text-blue-900">Add Measurement</h1>
                    <button
                        className=" text-red-500 hover:text-red-600 rounded-full transition-all duration-200 ease-in-out"
                        onClick={() => setMeasurementModal(false)}
                    >
                        <MdCancel className="w-8 h-8" />
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Left Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Lehenga / Sharara</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(lhSh).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium capitalize">{key}:</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={val}
                                        onChange={handleChange}
                                        className="w-full border rounded p-1 bg-gray-50"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">BP / Grown / Kurti</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(bpGrownKurti).map(([key, val]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium capitalize">{key}:</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={val}
                                        onChange={handleChange}
                                        className="w-full border rounded p-1 bg-gray-50"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-4">
                    <button
                        className="bg-blue-900 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out" onClick={() => {
                            setShowMeasurement(true);
                            setMeasurementModal(false);

                        }}
                    >
                        + Add Measurement
                    </button>
                </div>

            </div>
        </div>
    );
};


export default MeasurementModal;

