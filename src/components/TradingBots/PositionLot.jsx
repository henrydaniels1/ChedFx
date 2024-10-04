import { useState } from 'react';

const PositionSizeCalculator = () => {
  const [accountBalance, setAccountBalance] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [stopLossDistance, setStopLossDistance] = useState('');
  const [currencyPair, setCurrencyPair] = useState('');
  const [lotSize, setLotSize] = useState('');

  const calculateLotSize = () => {
    if (accountBalance && riskPercentage && stopLossDistance) {
      const riskAmount = (accountBalance * riskPercentage) / 100;
      const lotSize = riskAmount / (stopLossDistance * 10);
      setLotSize(lotSize.toFixed(2));
    }
  };

  const handleAccountBalanceChange = (event) => {
    setAccountBalance(event.target.value);
  };

  const handleRiskPercentageChange = (event) => {
    setRiskPercentage(event.target.value);
  };

  const handleStopLossDistanceChange = (event) => {
    setStopLossDistance(event.target.value);
  };

  const handleCurrencyPairChange = (event) => {
    setCurrencyPair(event.target.value);
  };

  return (
    <div className=" mx-auto">
      <div className="rounded-2xl shadow-lg p-6 bg-gray-900 text-white">
        <div className="mb-6">
          <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-6">Position Size Calculator</h2>
          <p>Calculate the correct position size for your trades based on risk tolerance and stop-loss distance.</p>
        </div>
        <form>
          <div className="mb-4">
            <label htmlFor="accountBalance" className="block font-medium">Account Balance:</label>
            <input
              type="number"
              id="accountBalance"
              value={accountBalance}
              onChange={handleAccountBalanceChange}
              className="w-full mt-1 p-2 border rounded-lg text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="riskPercentage" className="block font-medium">Risk Percentage:</label>
            <input
              type="number"
              id="riskPercentage"
              value={riskPercentage}
              onChange={handleRiskPercentageChange}
              className="w-full mt-1 p-2 border rounded-lg text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stopLossDistance" className="block font-medium">Stop-Loss Distance (in pips):</label>
            <input
              type="number"
              id="stopLossDistance"
              value={stopLossDistance}
              onChange={handleStopLossDistanceChange}
              className="w-full mt-1 p-2 border rounded-lg text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currencyPair" className="block font-medium">Currency Pair:</label>
            <select
              id="currencyPair"
              value={currencyPair}
              onChange={handleCurrencyPairChange}
              className="w-full mt-1 p-2 border rounded-lg text-black"
            >
              <option value="">Select currency pair</option>
              <option value="EUR/USD">EUR/USD</option>
              <option value="USD/JPY">USD/JPY</option>
              <option value="GBP/USD">GBP/USD</option>
            </select>
          </div>
          <button
            type="button"
            onClick={calculateLotSize}
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Calculate Lot Size
          </button>
          {lotSize && (
            <p className="mt-4 text-lg font-bold">Recommended Lot Size: {lotSize}</p>
          )}
        </form>
        <footer className="mt-6 text-sm">
          <p>Disclaimer: Trading forex carries significant risks and may result in losses. Use this calculator at your own risk.</p>
        </footer>
      </div>
    </div>
  );
};

export default PositionSizeCalculator;
