// import  { useState, useEffect } from 'react';

// const CurrencyCorrelationTool = () => {
//   const [currencies, setCurrencies] = useState([]);
//   const [selectedCurrencies, setSelectedCurrencies] = useState([]);
//   const [correlations, setCorrelations] = useState({});

//   useEffect(() => {
//     // Fetching currency list
//     fetch('https://api.exchangerate-api.com/v4/latest/USD')
//       .then(response => response.json())
//       .then(data => {
//         setCurrencies(Object.keys(data.rates));
//       });
//   }, []);

//   const handleSelectCurrency = (event) => {
//     const selectedCurrency = event.target.value;
//     if (selectedCurrencies.includes(selectedCurrency)) {
//       setSelectedCurrencies(selectedCurrencies.filter((c) => c !== selectedCurrency));
//     } else {
//       setSelectedCurrencies([...selectedCurrencies, selectedCurrency]);
//     }
//   };

//   const calculateCorrelations = () => {
//     const correlationMatrix = {};
//     selectedCurrencies.forEach((currency1) => {
//       correlationMatrix[currency1] = {};
//       selectedCurrencies.forEach((currency2) => {
//         if (currency1 !== currency2) {
//           const correlation = Math.random() * 2 - 1; // Simulating correlation calculation
//           correlationMatrix[currency1][currency2] = correlation;
//         }
//       });
//     });
//     setCorrelations(correlationMatrix);
//   };

//   return (
//     <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
//       <div className="w-full max-w-md rounded-lg bg-white p-6">
//         <h2 className="text-lg font-bold mb-4">Currency Correlation Tool</h2>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">Select Currencies:</label>
//           <select
//             multiple
//             value={selectedCurrencies}
//             onChange={handleSelectCurrency}
//             className="w-full mt-1 p-2 border rounded-lg"
//           >
//             {currencies.map((currency) => (
//               <option key={currency} value={currency}>
//                 {currency}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           onClick={calculateCorrelations}
//           className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//         >
//           Calculate Correlations
//         </button>

//         {Object.keys(correlations).length > 0 && (
//           <table className="min-w-full mt-6 border">
//             <thead>
//               <tr>
//                 <th className="border px-4 py-2">Currency</th>
//                 {selectedCurrencies.map((currency) => (
//                   <th key={currency} className="border px-4 py-2">{currency}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {selectedCurrencies.map((currency1) => (
//                 <tr key={currency1}>
//                   <td className="border px-4 py-2">{currency1}</td>
//                   {selectedCurrencies.map((currency2) => (
//                     <td key={currency2} className="border px-4 py-2">
//                       {correlations[currency1] && correlations[currency1][currency2]
//                         ? correlations[currency1][currency2].toFixed(2)
//                         : '—'}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CurrencyCorrelationTool;

import { useState } from 'react';

const CurrencyCorrelationTool = () => {
  const [currencies] = useState(['EUR/USD', 'USD/JPY', 'GBP/USD']); // Predefined currency pairs
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [correlations, setCorrelations] = useState({});
  const apiKey = '6QPUZHBLD3C1DAV7'; // Replace with your API key

  const handleSelectCurrency = (event) => {
    const selectedCurrency = event.target.value;
    if (selectedCurrencies.includes(selectedCurrency)) {
      setSelectedCurrencies(selectedCurrencies.filter((c) => c !== selectedCurrency));
    } else {
      setSelectedCurrencies([...selectedCurrencies, selectedCurrency]);
    }
  };

  const fetchForexData = async (currencyPair) => {
    const [baseCurrency, quoteCurrency] = currencyPair.split('/');
    const response = await fetch(
      `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${baseCurrency}&to_symbol=${quoteCurrency}&apikey=${apiKey}`
    );
    const data = await response.json();
    return data['Time Series FX (Daily)'];
  };

  const calculateCorrelations = async () => {
    const forexData = {};
    for (let currency of selectedCurrencies) {
      const data = await fetchForexData(currency);
      forexData[currency] = Object.values(data).map((day) => parseFloat(day['4. close']));
    }

    const correlationMatrix = {};
    selectedCurrencies.forEach((currency1) => {
      correlationMatrix[currency1] = {};
      selectedCurrencies.forEach((currency2) => {
        if (currency1 !== currency2) {
          const correlation = calculatePearsonCorrelation(forexData[currency1], forexData[currency2]);
          correlationMatrix[currency1][currency2] = correlation;
        }
      });
    });

    setCorrelations(correlationMatrix);
  };

  const calculatePearsonCorrelation = (arr1, arr2) => {
    const n = arr1.length;
    const sum1 = arr1.reduce((a, b) => a + b, 0);
    const sum2 = arr2.reduce((a, b) => a + b, 0);
    const sum1Sq = arr1.reduce((a, b) => a + b * b, 0);
    const sum2Sq = arr2.reduce((a, b) => a + b * b, 0);
    const pSum = arr1.reduce((sum, val, i) => sum + val * arr2[i], 0);
    const num = pSum - (sum1 * sum2) / n;
    const den = Math.sqrt((sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n));
    return den === 0 ? 0 : num / den;
  };

  return (
    <div className=" flex justify-center items-center ">
      <div className="w-full  rounded-2xl bg-gray-900 text-white p-6">
        <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-4">Currency Correlation Tool</h2>

        <div className="mb-4">
          <label className="block text-sm font-xl text-white">Select Currencies:</label>
          <select
            multiple
            value={selectedCurrencies}
            onChange={handleSelectCurrency}
            className="w-full mt-1 p-2 border rounded-lg text-black"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculateCorrelations}
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Calculate Correlations
        </button>

        {Object.keys(correlations).length > 0 && (
          <table className="min-w-full mt-6 border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Currency</th>
                {selectedCurrencies.map((currency) => (
                  <th key={currency} className="border px-4 py-2">{currency}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedCurrencies.map((currency1) => (
                <tr key={currency1}>
                  <td className="border px-4 py-2">{currency1}</td>
                  {selectedCurrencies.map((currency2) => (
                    <td key={currency2} className="border px-4 py-2">
                      {correlations[currency1] && correlations[currency1][currency2]
                        ? correlations[currency1][currency2].toFixed(2)
                        : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CurrencyCorrelationTool;
