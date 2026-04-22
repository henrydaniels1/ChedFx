import { useState } from 'react'

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

export default function PositionCalculator() {
  const [balance, setBalance] = useState('')
  const [lotSize, setLotSize] = useState(0.05)
  const [pips, setPips]       = useState(10)
  const [result, setResult]   = useState(null)

  const pl      = pips * lotSize
  const isValid = balance && lotSize > 0 && pips > 0

  const calculate = (isWin) => {
    const signedPl   = pl * (isWin ? 1 : -1)
    const newBalance = parseFloat(balance) + signedPl
    setResult({ pl: signedPl, newBalance, isWin })
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-800">
            <p className="text-white font-semibold">Position Calculator</p>
            <p className="text-gray-500 text-xs mt-0.5">Calculate P&amp;L and updated balance</p>
          </div>

          <div className="px-6 py-5 space-y-4">
            <Field label="Account Balance" hint="USD">
              <input type="number" value={balance} min={0} placeholder="e.g. 1000"
                onChange={e => { setBalance(e.target.value); setResult(null) }}
                className={inputCls} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Lot Size">
                <input type="number" value={lotSize} min={0.01} step={0.01}
                  onChange={e => { setLotSize(parseFloat(e.target.value) || 0); setResult(null) }}
                  className={inputCls} />
              </Field>
              <Field label="Point Value (Pips)" hint="instrument-specific">
                <input type="number" value={pips} min={0} step={0.0001}
                  onChange={e => { setPips(parseFloat(e.target.value) || 0); setResult(null) }}
                  className={inputCls} />
              </Field>
            </div>

            {/* Quick lot reference */}
            <div className="grid grid-cols-3 gap-2">
              {[0.01, 0.1, 1].map(lot => (
                <button key={lot} onClick={() => { setLotSize(lot); setResult(null) }}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors
                    ${lotSize === lot
                      ? 'bg-[#ecae10]/10 border-[#ecae10]/40 text-[#ecae10]'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'}`}>
                  {lot === 0.01 ? 'Micro' : lot === 0.1 ? 'Mini' : 'Standard'}
                  <span className="block text-[10px] opacity-60">{lot} lot</span>
                </button>
              ))}
            </div>

            {/* Win / Lose buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => calculate(true)} disabled={!isValid}
                className="py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                ✓ Win Trade
              </button>
              <button onClick={() => calculate(false)} disabled={!isValid}
                className="py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                ✗ Lose Trade
              </button>
            </div>

            {/* Result */}
            <div className={`rounded-xl border px-5 py-4 space-y-3 ${
              result ? (result.isWin ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20')
                     : 'bg-gray-800/40 border-gray-700'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs uppercase tracking-wider">P&amp;L</span>
                <span className={`text-xl font-bold ${
                  result ? (result.isWin ? 'text-emerald-400' : 'text-red-400') : 'text-[#ecae10]'
                }`}>
                  {result ? `${result.isWin ? '+' : '-'}${Math.abs(result.pl).toFixed(2)}` : `${pl.toFixed(2)}`} USD
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                <span className="text-gray-400 text-xs uppercase tracking-wider">New Balance</span>
                <span className="text-white text-xl font-bold">
                  ${result
                    ? result.newBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : balance ? (parseFloat(balance) + pl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '—'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
