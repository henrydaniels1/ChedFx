// import { useState } from 'react';

// const PositionSizeCalculator = () => {
//   const [accountBalance, setAccountBalance] = useState('');
//   const [riskPercentage, setRiskPercentage] = useState('');
//   const [stopLossDistance, setStopLossDistance] = useState('');
//   const [currencyPair, setCurrencyPair] = useState('');
//   const [lotSize, setLotSize] = useState('');

//   const calculateLotSize = () => {
//     if (accountBalance && riskPercentage && stopLossDistance) {
//       const riskAmount = (accountBalance * riskPercentage) / 100;
//       const lotSize = riskAmount / (stopLossDistance * 10);
//       setLotSize(lotSize.toFixed(2));
//     }
//   };

//   const handleAccountBalanceChange = (event) => {
//     setAccountBalance(event.target.value);
//   };

//   const handleRiskPercentageChange = (event) => {
//     setRiskPercentage(event.target.value);
//   };

//   const handleStopLossDistanceChange = (event) => {
//     setStopLossDistance(event.target.value);
//   };

//   const handleCurrencyPairChange = (event) => {
//     setCurrencyPair(event.target.value);
//   };

//   return (
//     <div className=" mx-auto">
//       <div className="rounded-2xl shadow-lg p-6 reveal2 bg-gray-900 text-white">
//         <div className="mb-6">
//           <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-6">Position Size Calculator</h2>
//           <p>Calculate the correct position size for your trades based on risk tolerance and stop-loss distance.</p>
//         </div>
//         <form>
//           <div className="mb-4">
//             <label htmlFor="accountBalance" className="block font-medium">Account Balance:</label>
//             <input
//               type="number"
//               id="accountBalance"
//               value={accountBalance}
//               onChange={handleAccountBalanceChange}
//               className="w-full mt-1 p-2 border rounded-lg text-black"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="riskPercentage" className="block font-medium">Risk Percentage:</label>
//             <input
//               type="number"
//               id="riskPercentage"
//               value={riskPercentage}
//               onChange={handleRiskPercentageChange}
//               className="w-full mt-1 p-2 border rounded-lg text-black"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="stopLossDistance" className="block font-medium">Stop-Loss Distance (in pips):</label>
//             <input
//               type="number"
//               id="stopLossDistance"
//               value={stopLossDistance}
//               onChange={handleStopLossDistanceChange}
//               className="w-full mt-1 p-2 border rounded-lg text-black"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="currencyPair" className="block font-medium">Currency Pair:</label>
//             <select
//               id="currencyPair"
//               value={currencyPair}
//               onChange={handleCurrencyPairChange}
//               className="w-full mt-1 p-2 border rounded-lg text-black"
//             >
//               <option value="">Select currency pair</option>
//               <option value="EUR/USD">EUR/USD</option>
//               <option value="USD/JPY">USD/JPY</option>
//               <option value="GBP/USD">GBP/USD</option>
//             </select>
//           </div>
//           <button
//             type="button"
//             onClick={calculateLotSize}
//             className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//           >
//             Calculate Lot Size
//           </button>
//           {lotSize && (
//             <p className="mt-4 text-lg font-bold">Recommended Lot Size: {lotSize}</p>
//           )}
//         </form>
//         <footer className="mt-6 text-sm">
//           <p>Disclaimer: Trading forex carries significant risks and may result in losses. Use this calculator at your own risk.</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default PositionSizeCalculator;
import { useState } from 'react';

const PositionSizeCalculator = () => {
  // Define state variables for user input
  const [lotSize, setLotSize] = useState(0.5); // default to 0.5 lot size
  const [pointValue, setPointValue] = useState(10); // default to VL75 point value
  const [pipValue, setPipValue] = useState(0.005); // calculated pip value
  const [accountBalance, setAccountBalance] = useState(''); // no default account balance
  const [profitOrLoss, setProfitOrLoss] = useState(0); // profit or loss from the trade

  const contractSize = 1; // Fixed contract size at 1

  // Handle pip calculation
  const calculatePip = () => {
    const pip = pointValue * contractSize * lotSize;
    setPipValue(pip);
  };

  // Handle balance calculation based on win or loss
  const calculateProfitOrLoss = (isWin) => {
    const pipValueUSD = pipValue; // Pip value in USD
    const profitOrLoss = pipValueUSD * 1; // Assuming 100 pips as an example

    const newProfitOrLoss = isWin ? profitOrLoss : -profitOrLoss;
    setProfitOrLoss(newProfitOrLoss);

    // Update account balance based on the win/loss
    const updatedBalance = parseFloat(accountBalance) + newProfitOrLoss;
    setAccountBalance(updatedBalance);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-900">
      <h1 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-6">Pip to Dollar Converter</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Account Balance Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Account Balance</label>
          <input
            type="number"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {/* Lot Size Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Lot Size</label>
          <input
            type="number"
            value={lotSize}
            onChange={(e) => setLotSize(parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
          />
        </div>

        {/* Point Value Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Point Value (pip size)</label>
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
          <h2 className="text-xl font-semibold text-gray-700">Pip Value in USD:</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">${pipValue.toFixed(4)}</p>
        </div>

        {/* Buttons for Win or Loss Calculation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => calculateProfitOrLoss(true)}
            className="w-1/2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 mr-2"
          >
            Win Trade
          </button>
          <button
            onClick={() => calculateProfitOrLoss(false)}
            className="w-1/2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Lose Trade
          </button>
        </div>

        {/* Display profit/loss */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Profit/Loss:</h2>
          <p className={`text-2xl font-bold mt-2 ${profitOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${profitOrLoss.toFixed(2)}
          </p>
        </div>

        {/* Display updated account balance */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Updated Account Balance:</h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">${accountBalance ? parseFloat(accountBalance).toFixed(2) : '0.00'}</p>
        </div>
      </div>
    </div>
  );
};

export default PositionSizeCalculator;
