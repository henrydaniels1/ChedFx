import { useState, useEffect } from 'react'
import { ArrowLeftRight, Loader2 } from 'lucide-react'

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
    {children}
  </div>
)

const select = "w-full bg-[#0d1117] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ecae10] transition-colors"
const input  = "w-full bg-[#0d1117] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ecae10] transition-colors"

export default function CurrencyConverter() {
  const [from, setFrom] = useState('USD')
  const [to, setTo]     = useState('NGN')
  const [amount, setAmount] = useState(1)
  const [result, setResult] = useState(null)
  const [rate, setRate]     = useState(null)
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(d => setCurrencies(Object.keys(d.rates)))
      .catch(() => setError('Failed to load currencies'))
  }, [])

  const handleConvert = () => {
    setLoading(true)
    setError(null)
    fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
      .then(r => r.json())
      .then(d => {
        const r = d.rates[to]
        setRate(r)
        setResult(amount * r)
      })
      .catch(() => setError('Conversion failed. Check your connection.'))
      .finally(() => setLoading(false))
  }

  const swap = () => { setFrom(to); setTo(from); setResult(null); setRate(null) }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden">

          {/* Card header */}
          <div className="px-6 py-4 border-b border-gray-800">
            <p className="text-white font-semibold">Currency Converter</p>
            <p className="text-gray-500 text-xs mt-0.5">Live exchange rates</p>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Amount */}
            <Field label="Amount">
              <input type="number" value={amount} min={0}
                onChange={e => { setAmount(e.target.valueAsNumber); setResult(null) }}
                className={input} />
            </Field>

            {/* From / Swap / To */}
            <div className="flex items-end gap-2">
              <Field label="From">
                <select value={from} onChange={e => { setFrom(e.target.value); setResult(null) }} className={select}>
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <button onClick={swap}
                className="mb-0.5 p-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-[#ecae10] hover:border-[#ecae10] transition-colors shrink-0">
                <ArrowLeftRight size={16} />
              </button>

              <Field label="To">
                <select value={to} onChange={e => { setTo(e.target.value); setResult(null) }} className={select}>
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Convert button */}
            <button onClick={handleConvert} disabled={loading || !amount}
              className="w-full py-2.5 rounded-lg bg-[#ecae10] hover:bg-[#d49c0e] text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Converting…' : 'Convert'}
            </button>

            {/* Result */}
            {result !== null && (
              <div className="rounded-xl bg-[#ecae10]/5 border border-[#ecae10]/20 px-5 py-4">
                <p className="text-gray-400 text-xs mb-1">{amount} {from} =</p>
                <p className="text-[#ecae10] text-3xl font-bold">
                  {result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  <span className="text-lg ml-2 font-normal">{to}</span>
                </p>
                {rate && <p className="text-gray-500 text-xs mt-2">1 {from} = {rate.toFixed(6)} {to}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
