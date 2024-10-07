import { useState, useEffect } from 'react';
import axios from 'axios';

const ForexStrategy = () => {
  const [priceA, setPriceA] = useState(null);
  const [priceB, setPriceB] = useState(null);
  const [priceC, setPriceC] = useState(null);
  const [buySignal, setBuySignal] = useState(false);
  const [forexData, setForexData] = useState(null);
  const [apiKey] = useState('YOUR_API_KEY');
  const [symbol] = useState('EUR/USD');
  const [interval] = useState('1min');

  // Fetch Forex Data
  useEffect(() => {
    const fetchForexData = async () => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=${symbol.split('/')[0]}&to_symbol=${symbol.split('/')[1]}&interval=${interval}&apikey=${apiKey}`
        );
        setForexData(response.data['Time Series FX (1min)']);
      } catch (error) {
        console.error('Error fetching forex data:', error);
      }
    };
    fetchForexData();
  }, [apiKey, symbol, interval]);

  // Extract specific low prices and set them as Price A, B, C
  useEffect(() => {
    if (forexData) {
      const sortedForexData = Object.keys(forexData).sort((a, b) => new Date(a) - new Date(b));
      const priceA = parseFloat(forexData[sortedForexData[0]]['3. low']);
      const priceB = parseFloat(forexData[sortedForexData[3]]['3. low']);
      const priceC = parseFloat(forexData[sortedForexData[6]]['3. low']);
      setPriceA(priceA);
      setPriceB(priceB);
      setPriceC(priceC);
    }
  }, [forexData]);

  // Check for buy signal based on the downward crown pattern
  useEffect(() => {
    if (priceA !== null && priceB !== null && priceC !== null) {
      if (priceA < priceB && priceB > priceC && priceA > priceC) {
        setBuySignal(true);
      } else {
        setBuySignal(false);
      }
    }
  }, [priceA, priceB, priceC]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Forex Strategy</h2>
      <p className="mb-4">Symbol: {symbol}</p>
      <p className="mb-4">Interval: {interval}</p>
      <p className="mb-4">Price A: {priceA !== null ? priceA : 'Fetching Price A...'}</p>
      <p className="mb-4">Price B: {priceB !== null ? priceB : 'Fetching Price B...'}</p>
      <p className="mb-4">Price C: {priceC !== null ? priceC : 'Fetching Price C...'}</p>
      <p className="mb-4">Buy Signal: {buySignal ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ForexStrategy;
