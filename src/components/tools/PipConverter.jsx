import { useState, useEffect } from 'react'

const Field = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-baseline justify-between">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      {hint && <span className="text-xs text-gray-600">{hint}</span>}
    </div>
    {children}
  </div>
)

const inputCls = "w-full bg-[#0d1117] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ecae10] transition-colors"

export default function PipConverter() {
  const [lotSize, setLotSize]       = useState(0.05)
  const [pointValue, setPointValue] = useState(10)
  const pipValue = pointValue * lotSize  // live — no button needed

  const isValid = lotSize > 0 && pointValue > 0

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-800">
            <p className="text-white font-semibold">Pip Value Calculator</p>
            <p className="text-gray-500 text-xs mt-0.5">Calculates pip value in USD</p>
          </div>

          <div className="px-6 py-5 space-y-4">
            <Field label="Lot Size" hint="e.g. 0.01 micro · 0.1 mini · 1.0 standard">
              <input type="number" value={lotSize} min={0.01} step={0.01}
                onChange={e => setLotSize(parseFloat(e.target.value) || 0)}
                className={inputCls} />
            </Field>

            <Field label="Point Value" hint="per lot (instrument-specific)">
              <input type="number" value={pointValue} min={0} step={0.0001}
                onChange={e => setPointValue(parseFloat(e.target.value) || 0)}
                className={inputCls} />
            </Field>

            {/* Result */}
            <div className={`rounded-xl border px-5 py-4 transition-colors ${isValid ? 'bg-[#ecae10]/5 border-[#ecae10]/20' : 'bg-gray-800/40 border-gray-700'}`}>
              <p className="text-gray-400 text-xs mb-1">Pip value per trade</p>
              <p className={`text-3xl font-bold ${isValid ? 'text-[#ecae10]' : 'text-gray-600'}`}>
                ${isValid ? pipValue.toFixed(4) : '—'}
              </p>
              {isValid && (
                <p className="text-gray-500 text-xs mt-2">
                  {lotSize} lot × {pointValue} point value = ${pipValue.toFixed(4)}
                </p>
              )}
            </div>

            {/* Quick lot reference */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[0.01, 0.1, 1].map(lot => (
                <button key={lot}
                  onClick={() => setLotSize(lot)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors
                    ${lotSize === lot
                      ? 'bg-[#ecae10]/10 border-[#ecae10]/40 text-[#ecae10]'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'}`}>
                  {lot === 0.01 ? 'Micro' : lot === 0.1 ? 'Mini' : 'Standard'}
                  <span className="block text-[10px] opacity-60">{lot} lot</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
