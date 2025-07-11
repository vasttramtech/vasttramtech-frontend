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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-lg p-6 overflow-y-auto ml-40">
                {/* Header */}
                <div className="flex justify-between items-center top-0 bg-white z-10 mb-4">
                    <h1 className="text-2xl font-bold">Add Measurement</h1>
                    <button
                        className="text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1 text-lg"
                        onClick={() => setMeasurementModal(false)}
                    >
                        X
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
                                        className="w-full border rounded p-1"
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
                                        className="w-full border rounded p-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-4">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300 ease-in-out" onClick={() => {
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

