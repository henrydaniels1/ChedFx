// import  { useState, useEffect } from 'react';

// const CurrencyComparisonTool = () => {
//   const [currencyData, setCurrencyData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [suggestion, setSuggestion] = useState('');

//   const apiKey = '6QPUZHBLD3C1DAV7'; // Replace with your API key

//   // Currency pairs to compare
//   const currencyPairs = ['EUR/USD', 'EUR/GBP', 'GBP/USD'];

//   useEffect(() => {
//     fetchCurrencyData();
//   }, []);

//   const fetchCurrencyData = async () => {
//     setLoading(true);

//     try {
//       // Fetch data for each currency pair
//       const fetchedData = await Promise.all(
//         currencyPairs.map(async (pair) => {
//           const [baseCurrency, quoteCurrency] = pair.split('/');
//           const response = await fetch(
//             `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${quoteCurrency}&apikey=${apiKey}`
//           );
//           const data = await response.json();
//           const price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
//           return { pair, price };
//         })
//       );

//       // Convert fetched data into a dictionary
//       const dataDict = fetchedData.reduce((acc, curr) => {
//         acc[curr.pair] = curr.price;
//         return acc;
//       }, {});

//       setCurrencyData(dataDict);
//       setLoading(false);
//       generateSuggestion(dataDict);
//     } catch (error) {
//       console.error('Error fetching currency data:', error);
//       setLoading(false);
//     }
//   };

//   const generateSuggestion = (data) => {
//     const eurUsd = data['EUR/USD'];
//     const eurGbp = data['EUR/GBP'];
//     const gbpUsd = data['GBP/USD'];

//     let signal = '';

//     // Example Strategy: If EUR/USD is higher than EUR/GBP and GBP/USD, suggest buying EUR/USD
//     if (eurUsd > eurGbp && eurUsd > gbpUsd) {
//       signal = 'Buy EUR/USD';
//     }
//     // Example Strategy: If EUR/USD is lower than both EUR/GBP and GBP/USD, suggest selling EUR/USD
//     else if (eurUsd < eurGbp && eurUsd < gbpUsd) {
//       signal = 'Sell EUR/USD';
//     } else {
//       signal = 'Hold EUR/USD';
//     }

//     setSuggestion(signal);
//   };

//   return (
//     <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
//       <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
//         <h2 className="text-lg font-bold mb-4">Currency Comparison Tool</h2>

//         {loading ? (
//           <p>Loading currency data...</p>
//         ) : (
//           <div>
//             <div className="mb-4">
//               <h3 className="font-semibold">Current Prices:</h3>
//               <p>EUR/USD: {currencyData['EUR/USD']}</p>
//               <p>EUR/GBP: {currencyData['EUR/GBP']}</p>
//               <p>GBP/USD: {currencyData['GBP/USD']}</p>
//             </div>

//             <div className="mb-4">
//               <h3 className="font-semibold">Trading Signal:</h3>
//               <p>{suggestion}</p>
//             </div>
//           </div>
//         )}

//         <button
//           onClick={fetchCurrencyData}
//           className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
//         >
//           Refresh Data
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CurrencyComparisonTool;





import  { useState, useEffect } from 'react';

const CurrencyComparisonTool = () => {
  const [currencyData, setCurrencyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [timer, setTimer] = useState(0); // Timer state to handle the 1-minute delay
  const [error, setError] = useState(null); // Error state to capture API issues

  const apiKey = 'QBBWMIQOLSJBCN5U'; // Replace with your API key
  const currencyPairs = ['EUR/USD', 'EUR/GBP', 'GBP/USD'];

  // Function to fetch currency data from API
  const fetchCurrencyData = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching data

    try {
      const fetchedData = await Promise.all(
        currencyPairs.map(async (pair) => {
          const [baseCurrency, quoteCurrency] = pair.split('/');
          const response = await fetch(
            `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${quoteCurrency}&apikey=${apiKey}`
          );
          const data = await response.json();

          // Check if the data contains the expected structure
          if (data && data['Realtime Currency Exchange Rate']) {
            const price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
            return { pair, price };
          } else {
            // If data doesn't have the expected structure, throw an error
            throw new Error(`Invalid response for ${pair}`);
          }
        })
      );

      const dataDict = fetchedData.reduce((acc, curr) => {
        acc[curr.pair] = curr.price;
        return acc;
      }, {});

      setCurrencyData(dataDict);
      setLoading(false);
      generateSuggestion(dataDict);
      startTimer(); // Start the timer after data is fetched
    } catch (error) {
      console.error('Error fetching currency data:', error);
      setError('Failed to fetch currency data. Please try again later.');
      setLoading(false);
    }
  };

  // Function to generate a trading suggestion based on fetched data
  const generateSuggestion = (data) => {
    const eurUsd = data['EUR/USD'];
    const eurGbp = data['EUR/GBP'];
    const gbpUsd = data['GBP/USD'];

    let signal = '';

    if (eurUsd > eurGbp && eurUsd > gbpUsd) {
      signal = 'Buy EUR/USD';
    } else if (eurUsd < eurGbp && eurUsd < gbpUsd) {
      signal = 'Sell EUR/USD';
    } else {
      signal = 'Hold EUR/USD';
    }

    setSuggestion(signal);
  };

  // Function to start the 60-second timer
  const startTimer = () => {
    setTimer(60); // Set the timer to 60 seconds
  };

  // useEffect to handle the countdown
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId); // Clear the interval when component unmounts or timer reaches zero
    }
  }, [timer]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full rounded-2xl bg-gray-900 text-white p-6 shadow-lg">
        <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-4">Currency Comparison Tool</h2>

        {loading ? (
          <p>Loading currency data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p> // Display error message if fetching fails
        ) : (
          <div>
            <div className="mb-4 space-y-6">
              <h3 className="font-bold text-lg">Current Prices:</h3>
              <p className=''>EUR/USD: {currencyData['EUR/USD']}</p>
              <p  className=''>EUR/GBP: {currencyData['EUR/GBP']}</p>
              <p  className=''>GBP/USD: {currencyData['GBP/USD']}</p>
            </div>

            <div className="mb-4 space-y-6">
              <h3 className="font-bold text-lg">Trading Signal: <span className="text-md">{suggestion}</span> </h3>
            
            </div>
          </div>
        )}

        <button
          onClick={fetchCurrencyData}
          disabled={timer > 0} // Disable button if timer is running
          className={`w-full py-2 mt-4 text-white rounded-lg transition duration-300 ${
            timer > 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {timer > 0 ? `Wait ${timer}s` : 'Refresh Data'}
        </button>
        
         <footer className="mt-6 text-sm">
          <p>Disclaimer: Trading forex carries significant risks and may result in losses. Use this calculator at your own risk.</p>
        </footer>
      </div>
    </div>
  );
};

export default CurrencyComparisonTool;
