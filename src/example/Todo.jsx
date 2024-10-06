import { useState } from 'react';

const ForexTradingChecklist = () => {
  // Define the list of criteria for your trade
  const [criteria, setCriteria] = useState([
    { id: 1, text: 'Market Trend Favorable', checked: false },
    { id: 2, text: 'Risk/Reward Ratio is Good', checked: false },
    { id: 3, text: 'Technical Indicators Align', checked: false },
    { id: 4, text: 'Economic News Considered', checked: false },
    { id: 5, text: 'Stop Loss and Take Profit Set', checked: false },
  ]);

  // Handle the checkbox change
  const toggleCheckbox = (id) => {
    setCriteria(
      criteria.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Calculate the percentage of checked items
  const calculatePercentage = () => {
    const checkedItems = criteria.filter((item) => item.checked).length;
    const totalItems = criteria.length;
    return (checkedItems / totalItems) * 100;
  };

  const percentage = calculatePercentage();
  const shouldTakeTrade = percentage >= 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Forex Trading Checklist</h1>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <ul className="space-y-4">
          {criteria.map((item) => (
            <li key={item.id} className="flex items-center">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheckbox(item.id)}
                className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={`text-gray-700 ${item.checked ? 'line-through' : ''}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Completion Score: {percentage.toFixed(0)}%</h2>
          <p className={`text-2xl font-bold mt-2 ${shouldTakeTrade ? 'text-green-600' : 'text-red-600'}`}>
            {shouldTakeTrade ? '✅ Take the Trade' : '❌ Don’t Take the Trade'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForexTradingChecklist;
