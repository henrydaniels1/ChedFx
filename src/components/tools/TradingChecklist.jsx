import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

const DEFAULT_CRITERIA = [
  '3 Point Trendline alignment',
  'Upward/Downward Trend',
  'Support/Resistance levels',
  'BreakOut confirmed',
  'Checked for Reversal',
  'Pattern identified',
  '2% Risk applied',
  'Appropriate position size',
]

export default function TradingChecklist() {
  const [criteria, setCriteria] = useState([])
  const [checked, setChecked]   = useState([])
  const [newItem, setNewItem]   = useState('')

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tradingCriteria'))
      setCriteria(Array.isArray(stored) ? stored : DEFAULT_CRITERIA)
      const storedChecked = JSON.parse(localStorage.getItem('checkedItems'))
      setChecked(Array.isArray(storedChecked) ? storedChecked : [])
    } catch {
      setCriteria(DEFAULT_CRITERIA)
    }
  }, [])

  useEffect(() => {
    if (criteria.length > 0) localStorage.setItem('tradingCriteria', JSON.stringify(criteria))
  }, [criteria])

  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checked))
  }, [checked])

  const toggle = (item) =>
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])

  const addItem = () => {
    if (newItem.trim()) { setCriteria(prev => [...prev, newItem.trim()]); setNewItem('') }
  }

  const removeItem = (item) => {
    setCriteria(prev => prev.filter(i => i !== item))
    setChecked(prev => prev.filter(i => i !== item))
  }

  const pct = criteria.length > 0 ? (checked.length / criteria.length) * 100 : 0
  const shouldTrade = pct >= 60
  const barColor = pct >= 60 ? '#10b981' : pct >= 30 ? '#ecae10' : '#ef4444'

  return (
    <div className="h-full flex flex-col max-w-xl mx-auto w-full">
      <div className="bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full">

        {/* Header with progress */}
        <div className="px-6 py-4 border-b border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Trading Checklist</p>
              <p className="text-gray-500 text-xs mt-0.5">{checked.length} of {criteria.length} criteria met</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: barColor }}>{pct.toFixed(0)}%</p>
              <p className={`text-xs font-medium ${shouldTrade ? 'text-emerald-400' : 'text-red-400'}`}>
                {shouldTrade ? '✓ Take trade' : '✗ Skip trade'}
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
          </div>
        </div>

        {/* Criteria list */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-1">
          {criteria.map((item) => {
            const isChecked = checked.includes(item)
            return (
              <div key={item}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer group
                  ${isChecked ? 'bg-emerald-500/5 border-emerald-500/20' : 'border-transparent hover:bg-gray-800'}`}
                onClick={() => toggle(item)}>
                <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors
                  ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}>
                  {isChecked && <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-none stroke-white stroke-2"><polyline points="1,4 4,7 9,1" /></svg>}
                </div>
                <span className={`flex-1 text-sm transition-colors ${isChecked ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {item}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); removeItem(item) }}
                  className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all p-0.5">
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Add + Reset */}
        <div className="px-6 py-4 border-t border-gray-800 space-y-3">
          <div className="flex gap-2">
            <input
              type="text" value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="Add new criterion…"
              className="flex-1 bg-[#080c12] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ecae10] transition-colors placeholder-gray-600" />
            <button onClick={addItem}
              className="px-4 py-2 bg-[#ecae10] hover:bg-[#d49c0e] text-black font-semibold text-sm rounded-lg transition-colors">
              Add
            </button>
          </div>
          <button onClick={() => setChecked([])}
            className="w-full py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 text-sm transition-colors">
            Reset Session
          </button>
        </div>
      </div>
    </div>
  )
}
