// import { useState } from "react"

// const tradingCriteria = [
//   "3 Point Trendline alignment",
//   "Upward/Downward Trend",
//   "Support/Resistance levels",
//     "BreakOut",
//   "Checked for Reversal???",
// "Any Shape???",
//   "2% Risk??",
//   "Appropriate position size"
// ]

// export default function ForexTradingChecklist2() {
//   const [checkedItems, setCheckedItems] = useState([])

//   const handleCheckboxChange = (criterion) => {
//     setCheckedItems((prev) =>
//       prev.includes(criterion)
//         ? prev.filter((item) => item !== criterion)
//         : [...prev, criterion]
//     )
//   }

//   const percentageChecked = (checkedItems.length / tradingCriteria.length) * 100
//   const shouldTakeTrade = percentageChecked >= 60

//   return (
//     <div className="w-full reveal4 mx-auto rounded-2xl bg-gray-900 p-6">
//       <header>
//         <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-4 ">Forex Trading Criteria Checklist</h2>
//       </header>
//       <div>
//         <ul className="space-y-4 text-white ">
//           {tradingCriteria.map((criterion) => (
//             <li key={criterion} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id={criterion}
//                 checked={checkedItems.includes(criterion)}
//                 onChange={() => handleCheckboxChange(criterion)}
//               />
//               <label
//                 htmlFor={criterion}
//                 className="text-xl font-medium leading-none"
//               >
//                 {criterion}
//               </label>
//             </li>
//           ))}
//         </ul>
//         <div className="mt-6 space-y-2">
//           <progress value={percentageChecked} max="100" className="w-full" />
//           <p className="text-xl text-center text-white ">
//             Criteria met: {percentageChecked.toFixed(0)}%
//           </p>
//           <p className={`text-center font-semibold ${shouldTakeTrade ? 'text-green-600' : 'text-red-600'}`}>
//             {shouldTakeTrade ? 'Consider taking this trade' : 'Not recommended to take this trade'}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }



import { useState, useEffect } from "react";
import Delete from '../../icons/Delete'

export default function ForexTradingChecklist2() {
  const [tradingCriteria, setTradingCriteria] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [newCriterion, setNewCriterion] = useState(""); // Handle new criterion input

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const storedCriteria = localStorage.getItem("tradingCriteria");
    if (storedCriteria) {
      try {
        const parsedCriteria = JSON.parse(storedCriteria);
        if (Array.isArray(parsedCriteria)) {
          setTradingCriteria(parsedCriteria);
        } else {
          throw new Error("Stored criteria are not in a valid array format");
        }
      } catch (error) {
        console.error("Error parsing stored trading criteria:", error);
        setTradingCriteria([
          "3 Point Trendline alignment",
          "Upward/Downward Trend",
          "Support/Resistance levels",
          "BreakOut",
          "Checked for Reversal???",
          "Any Shape???",
          "2% Risk??",
          "Appropriate position size",
        ]);
      }
    } else {
      setTradingCriteria([
        "3 Point Trendline alignment",
        "Upward/Downward Trend",
        "Support/Resistance levels",
        "BreakOut",
        "Checked for Reversal???",
        "Any Shape???",
        "2% Risk??",
        "Appropriate position size",
      ]);
    }

    const storedCheckedItems = localStorage.getItem("checkedItems");
    if (storedCheckedItems) {
      try {
        const parsedCheckedItems = JSON.parse(storedCheckedItems);
        if (Array.isArray(parsedCheckedItems)) {
          setCheckedItems(parsedCheckedItems);
        }
      } catch (error) {
        console.error("Error parsing stored checked items:", error);
        setCheckedItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (tradingCriteria.length > 0) {
      localStorage.setItem("tradingCriteria", JSON.stringify(tradingCriteria));
    }
  }, [tradingCriteria]);

  useEffect(() => {
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const handleCheckboxChange = (criterion) => {
    setCheckedItems((prev) =>
      prev.includes(criterion)
        ? prev.filter((item) => item !== criterion)
        : [...prev, criterion]
    );
  };

  const percentageChecked =
    tradingCriteria.length > 0
      ? (checkedItems.length / tradingCriteria.length) * 100
      : 0; // Safeguard to prevent division by zero

  const shouldTakeTrade = percentageChecked >= 60;

  const addCriterion = () => {
    if (newCriterion.trim() !== "") {
      setTradingCriteria((prev) => [...prev, newCriterion]);
      setNewCriterion(""); // Clear input after adding
    }
  };

  const removeCriterion = (criterion) => {
    setTradingCriteria((prev) => prev.filter((item) => item !== criterion));
    setCheckedItems((prev) => prev.filter((item) => item !== criterion));
  };

  return (
    <div className="w-full mx-auto rounded-2xl bg-gray-900 p-6 space-y-16">
      <header>
        <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-4">
          Forex Trading Criteria Checklist
        </h2>
      </header>
      <div className="space-y-16 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-10 border border-gray-100 p-4 rounded-lg">
        <ul className="space-y-4 text-white">
          {tradingCriteria.map((criterion) => (
            <li key={criterion} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={criterion}
                checked={checkedItems.includes(criterion)}
                onChange={() => handleCheckboxChange(criterion)}
              />
              <label
                htmlFor={criterion}
                className="text-xl font-medium leading-none flex-1"
              >
                {criterion}
              </label>
              <button
                className="text-white hover:text-red-700"
                onClick={() => removeCriterion(criterion)}
              >
            <Delete/>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center gap-4 ">
          <input
            type="text"
            value={newCriterion}
            onChange={(e) => setNewCriterion(e.target.value)}
            placeholder="Add new criterion"
            className="p-2 rounded-lg border w-full"
          />
          <div className="flex items-center">
          <button
            onClick={addCriterion}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add 
          </button></div>
        </div>

        <div className="mt-6 space-y-2">
          <progress value={percentageChecked} max="100" className="w-full" />
          <p className="text-xl text-center text-white">
            Criteria met: {percentageChecked.toFixed(0)}%
          </p>
          <p
            className={`text-center font-semibold ${
              shouldTakeTrade ? "text-green-600" : "text-red-600"
            }`}
          >
            {shouldTakeTrade
              ? "Consider taking this trade"
              : "Not recommended to take this trade"}
          </p>
        </div>
      </div>
    </div>
  );
}
