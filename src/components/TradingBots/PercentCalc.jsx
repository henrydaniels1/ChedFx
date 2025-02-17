import { useState } from "react";

const ForexPercentageCalculator = () => {
  const [balance, setBalance] = useState("");
  const [percentage, setPercentage] = useState("");
  const [result, setResult] = useState(null);

  const calculatePercentage = () => {
    if (balance && percentage) {
      const calcResult = (parseFloat(balance) * parseFloat(percentage)) / 100;
      setResult(calcResult); // Keep the result as a number for correct calculations
    } else {
      alert("Please enter both balance and percentage.");
    }
  };

  // Function to dynamically calculate possible trades
  const calculatePossibleTrades = () => {
    if (balance && result) {
      return Math.floor(parseFloat(balance) / result); // Correctly calculate possible trades
    }
    return null; // Return null if calculation can't be performed
  };

  return (
    <div className="flex flex-col items-center rounded-2xl justify-center bg-gray-900 p-4 h-full">
      <h1 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-6">
        Forex Balance Percentage Calculator
      </h1>
<div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-10 border border-gray-100 p-4 rounded-lg">
      <div className="space-y-6 mb-6"> 
      <input
        type="number"
        placeholder="Enter Account Balance"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        className="mb-3 p-2 w-full max-w-md rounded-lg border border-gray-300"
      />

      <input
        type="number"
        placeholder="Enter Percentage (e.g., 2 for 2%)"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        className="mb-3 p-2 w-full max-w-md rounded-lg border border-gray-300"
      />
        </div>
        <div className=" flex justify-center">
      <button
        onClick={calculatePercentage}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded "
      >
        Calculate
      </button>
</div>
      {result !== null && (
        <div className="mt-4 text-xl text-white">
          <p>{percentage}% of ${balance} = ${result.toFixed(2)}</p> {/* Display formatted result */}
          {calculatePossibleTrades() !== null && (
            <p>
              Possible trades with this balance = {calculatePossibleTrades()} trades
            </p>
          )}
        </div>
        ) }
        </div>
    </div>
  );
};

export default ForexPercentageCalculator;
