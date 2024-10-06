import { useState, useEffect } from 'react';

const Forex = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => response.json())
      .then(data => {
        setCurrencies(Object.keys(data.rates));
      });
  }, []);

  const handleConvert = () => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then(response => response.json())
      .then(data => {
        const rate = data.rates[toCurrency];
        const result = amount * rate;
        setResult(result);
      });
  };

  return (
    <div className=" flex justify-center reveal1 items-center bg-gray-900 p-6 rounded-2xl">
      <div className="w-full rounded-2xl  shadow-xl">
        {/* bg-white/30 backdrop-blur-md */}
        <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-4 ">Forex Converter</h2>
        <div className="mb-4">
          <label htmlFor="from" className="block text-white">From:</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-2 mt-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="to" className="block text-white">To:</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-2 mt-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-white">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.valueAsNumber)}
            className="w-full p-2 mt-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleConvert}
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Convert
        </button>
        {result && (
          <p className="mt-4 text-white">Result: {result}</p>
        )}
      </div>
    </div>
  );
};

export default Forex;
