import { useState, useEffect } from 'react'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '../../config/supabase'
import { useAuth } from '../../context/AuthContext'

const input = "bg-[#0d1117] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ecae10] transition-colors placeholder-gray-600"

export default function TradeLog() {
  const { user } = useAuth()
  const [trades, setTrades] = useState([])
  const [form, setForm] = useState({ pair: '', result: 'win', pnl: '', notes: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setTrades(data))
  }, [user])

  const add = async () => {
    if (!form.pair.trim()) return
    setLoading(true)
    const row = { user_id: user.id, pair: form.pair.trim(), result: form.result, pnl: parseFloat(form.pnl) || 0, notes: form.notes.trim() }
    const { data, error } = await supabase.from('trades').insert(row).select().single()
    if (!error) setTrades(prev => [data, ...prev])
    setForm({ pair: '', result: 'win', pnl: '', notes: '' })
    setLoading(false)
  }

  const remove = async (id) => {
    await supabase.from('trades').delete().eq('id', id)
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  const wins  = trades.filter(t => t.result === 'win').length
  const losses = trades.filter(t => t.result === 'loss').length
  const totalPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0)

  if (!user) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-500 text-sm">Sign in to use Trade Log.</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full gap-4">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Wins', value: wins, color: 'text-green-400' },
          { label: 'Losses', value: losses, color: 'text-red-400' },
          { label: 'Net P&L', value: `${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'text-green-400' : 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add trade */}
      <div className="bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 space-y-3">
        <p className="text-white text-sm font-semibold">Log a Trade</p>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Pair (e.g. EUR/USD)" value={form.pair}
            onChange={e => setForm(p => ({ ...p, pair: e.target.value }))} className={input} />
          <select value={form.result} onChange={e => setForm(p => ({ ...p, result: e.target.value }))}
            className={input}>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
          </select>
          <input type="number" placeholder="P&L (USD)" value={form.pnl}
            onChange={e => setForm(p => ({ ...p, pnl: e.target.value }))} className={input} />
          <input placeholder="Notes (optional)" value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={input} />
        </div>
        <button onClick={add} disabled={loading || !form.pair.trim()}
          className="w-full py-2.5 rounded-lg bg-[#ecae10] hover:bg-[#d49c0e] text-black font-semibold text-sm transition-colors disabled:opacity-40">
          {loading ? 'Saving…' : 'Add Trade'}
        </button>
      </div>

      {/* Trade list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {trades.length === 0 ? (
          <p className="text-center text-gray-600 text-sm py-8">No trades logged yet.</p>
        ) : trades.map(t => (
          <div key={t.id} className="group flex items-center gap-3 bg-[#0d1117] border border-gray-800 rounded-xl px-4 py-3">
            {t.result === 'win'
              ? <TrendingUp size={16} className="text-green-400 shrink-0" />
              : <TrendingDown size={16} className="text-red-400 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{t.pair}</p>
              {t.notes && <p className="text-gray-500 text-xs truncate">{t.notes}</p>}
            </div>
            <span className={`text-sm font-semibold shrink-0 ${t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {t.pnl >= 0 ? '+' : ''}{t.pnl?.toFixed(2)}
            </span>
            <button onClick={() => remove(t.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all ml-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
