import  { useState } from 'react';

const PipConverter = () => {
  // Define state variables for user input
  const [lotSize, setLotSize] = useState(0.05); // default to 0.5 lot size
  const [pointValue, setPointValue] = useState(10); // default to VL75 point value
  const [pipValue, setPipValue] = useState(0.005); // calculated pip value

  const contractSize = 1; // Fixed contract size at 1

  // Handle pip calculation
  const calculatePip = () => {
    const pip = pointValue * contractSize * lotSize;
    setPipValue(pip);
  };

  return (
    <div className="flex flex-col reveal2 items-center justify-center p-6 rounded-2xl bg-gray-900">
      <h1 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center  mb-6">Simple Pip to Dollar Converter</h1>
      
      <div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-10 border border-gray-100 shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="mb-4">
          <label className="block text-white font-bold mb-2">Lot Size</label>
          <input
            type="number"
            value={lotSize}
            onChange={(e) => setLotSize(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white font-bold mb-2">Point Value (pip size)</label>
          <input
            type="number"
            value={pointValue}
            onChange={(e) => setPointValue(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.0001"
          />
        </div>

        <button
          onClick={calculatePip}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Calculate Pip Value
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white">Pip Value in USD:</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">${pipValue.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
};

export default PipConverter;
