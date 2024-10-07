import { useState } from "react"

const tradingCriteria = [
  "3 Point Trendline alignment",
  "Upward/Downward Trend",
  "Support/Resistance levels",
    "BreakOut",
  "Checked for Reversal???",
"Any Shape???",
  "2% Risk??",
  "Appropriate position size"
]

export default function ForexTradingChecklist2() {
  const [checkedItems, setCheckedItems] = useState([])

  const handleCheckboxChange = (criterion) => {
    setCheckedItems((prev) =>
      prev.includes(criterion)
        ? prev.filter((item) => item !== criterion)
        : [...prev, criterion]
    )
  }

  const percentageChecked = (checkedItems.length / tradingCriteria.length) * 100
  const shouldTakeTrade = percentageChecked >= 60

  return (
    <div className="w-full reveal4 mx-auto rounded-2xl bg-gray-900 p-6">
      <header>
        <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold text-teal-900 text-center mb-4 ">Forex Trading Criteria Checklist</h2>
      </header>
      <div>
        <ul className="space-y-4 text-white ">
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
                className="text-xl font-medium leading-none"
              >
                {criterion}
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2">
          <progress value={percentageChecked} max="100" className="w-full" />
          <p className="text-xl text-center text-white ">
            Criteria met: {percentageChecked.toFixed(0)}%
          </p>
          <p className={`text-center font-semibold ${shouldTakeTrade ? 'text-green-600' : 'text-red-600'}`}>
            {shouldTakeTrade ? 'Consider taking this trade' : 'Not recommended to take this trade'}
          </p>
        </div>
      </div>
    </div>
  )
}
