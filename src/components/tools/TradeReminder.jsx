import { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2, Bell, X, Check } from 'lucide-react'
import { supabase } from '../../config/supabase'
import { useAuth } from '../../context/AuthContext'

const PAIRS = ['EUR/USD','GBP/USD','USD/JPY','USD/CHF','AUD/USD','USD/CAD','NZD/USD','GBP/JPY','EUR/GBP','XAU/USD']
const VIXPAIRS = ['VIX10','VIX25','VIX50','VIX75','VIX100','VIX10[1s]','VIX25[1s]','VIX50[1s]','VIX75[1s]','VIX100[1s]']
const JUMPPAIRS = ['JUMP10','JUMP25','JUMP50','JUMP75','JUMP100']
const ALLPAIRS = [...PAIRS, ...VIXPAIRS, ...JUMPPAIRS]

const inp = "w-full bg-[#0d1117] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ecae10] transition-colors"

const empty = { pair: 'EUR/USD', direction: 'buy', remind_at: '', sl: '', tp: '', notes: '' }

function ReminderForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Pair</label>
          <select value={form.pair} onChange={e => set('pair', e.target.value)} className={inp}>
            <optgroup label="Forex">
              {PAIRS.map(p => <option key={p}>{p}</option>)}
            </optgroup>
            <optgroup label="Volatility Indices">
              {VIXPAIRS.map(p => <option key={p}>{p}</option>)}
            </optgroup>
            <optgroup label="Jump Indices">
              {JUMPPAIRS.map(p => <option key={p}>{p}</option>)}
            </optgroup>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Direction</label>
          <select value={form.direction} onChange={e => set('direction', e.target.value)} className={inp}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">SL</label>
          <input type="number" step="0.00001" placeholder="e.g. 1.0800" value={form.sl}
            onChange={e => set('sl', e.target.value)} className={inp} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">TP</label>
          <input type="number" step="0.00001" placeholder="e.g. 1.1000" value={form.tp}
            onChange={e => set('tp', e.target.value)} className={inp} />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Remind At</label>
          <input type="datetime-local" value={form.remind_at}
            onChange={e => set('remind_at', e.target.value)} className={inp} />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Notes (optional)</label>
          <input placeholder="e.g. Wait for London open confirmation" value={form.notes}
            onChange={e => set('notes', e.target.value)} className={inp} />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)} disabled={loading || !form.remind_at}
          className="flex-1 py-2.5 rounded-lg bg-[#ecae10] hover:bg-[#d49c0e] text-black font-semibold text-sm transition-colors disabled:opacity-40">
          {loading ? 'Saving…' : <span className="flex items-center justify-center gap-1.5"><Check size={14} /> Save Reminder</span>}
        </button>
        {onCancel && (
          <button onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

function formatDt(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function isPast(iso) {
  return iso && new Date(iso) < new Date()
}

const playAlertSound = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  
  const playTone = (freq, startTime, duration) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, startTime)
    
    gain.gain.setValueAtTime(0.4, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  // ⏰ ADJUST RING TIME HERE:
  // Change the numbers after 'now +' to control timing between tones
  // Change the last number in playTone() to control how long each tone lasts
  const now = ctx.currentTime
  playTone(523, now, 0.4)          // C5 - duration: 0.4s
  playTone(659, now + 0.5, 0.4)    // E5 - starts 0.5s after, duration: 0.4s
  playTone(784, now + 1.0, 0.8)    // G5 - starts 1.0s after, duration: 0.8s (held longer)
  // Total ring time: ~1.8 seconds
}

export default function TradeReminder() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const notifiedRef = useRef(new Set())

  useEffect(() => {
    if (!user) return
    supabase
      .from('trade_reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('remind_at', { ascending: true })
      .then(({ data }) => data && setReminders(data))
  }, [user])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const check = setInterval(() => {
      const now = Date.now()
      reminders.forEach(r => {
        const time = new Date(r.remind_at).getTime()
        if (time <= now && !notifiedRef.current.has(r.id)) {
          notifiedRef.current.add(r.id)
          playAlertSound()
          if (Notification.permission === 'granted') {
            new Notification('Trade Reminder', {
              body: `${r.direction.toUpperCase()} ${r.pair}${r.notes ? ' - ' + r.notes : ''}`,
              icon: '/favicon.ico',
              tag: r.id
            })
          }
        }
      })
    }, 1000)
    return () => clearInterval(check)
  }, [reminders])

  const add = async (form) => {
    setLoading(true)
    const row = {
      user_id: user.id,
      pair: form.pair,
      direction: form.direction,
      remind_at: new Date(form.remind_at).toISOString(),
      sl: form.sl ? parseFloat(form.sl) : null,
      tp: form.tp ? parseFloat(form.tp) : null,
      notes: form.notes.trim() || null,
    }
    const { data, error } = await supabase.from('trade_reminders').insert(row).select().single()
    if (!error) setReminders(prev => [...prev, data].sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at)))
    setShowForm(false)
    setLoading(false)
  }

  const update = async (form) => {
    setLoading(true)
    const patch = {
      pair: form.pair,
      direction: form.direction,
      remind_at: new Date(form.remind_at).toISOString(),
      sl: form.sl ? parseFloat(form.sl) : null,
      tp: form.tp ? parseFloat(form.tp) : null,
      notes: form.notes.trim() || null,
    }
    const { data, error } = await supabase.from('trade_reminders').update(patch).eq('id', editId).select().single()
    if (!error) setReminders(prev => prev.map(r => r.id === editId ? data : r).sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at)))
    setEditId(null)
    setLoading(false)
  }

  const remove = async (id) => {
    await supabase.from('trade_reminders').delete().eq('id', id)
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const editInitial = (r) => ({
    pair: r.pair,
    direction: r.direction,
    remind_at: r.remind_at ? r.remind_at.slice(0, 16) : '',
    sl: r.sl ?? '',
    tp: r.tp ?? '',
    notes: r.notes ?? '',
  })

  if (!user) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-500 text-sm">Sign in to use Trade Reminders.</p>
    </div>
  )

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Trade Reminders</p>
          <p className="text-gray-500 text-xs mt-0.5">{reminders.length} reminder{reminders.length !== 1 ? 's' : ''}</p>
        </div>
        {!showForm && !editId && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ecae10]/10 border border-[#ecae10]/30 text-[#ecae10] text-sm font-medium hover:bg-[#ecae10]/20 transition-colors">
            <Bell size={14} /> New Reminder
          </button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <ReminderForm initial={empty} onSave={add} onCancel={() => setShowForm(false)} loading={loading} />
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {reminders.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Bell size={32} className="text-gray-700" />
            <p className="text-gray-600 text-sm">No reminders yet. Add one above.</p>
          </div>
        ) : reminders.map(r => (
          editId === r.id ? (
            <ReminderForm key={r.id} initial={editInitial(r)} onSave={update} onCancel={() => setEditId(null)} loading={loading} />
          ) : (
            <div key={r.id}
              className={`group flex items-start gap-3 bg-[#0d1117] border rounded-xl px-4 py-3 transition-colors
                ${isPast(r.remind_at) ? 'border-gray-800 opacity-60' : 'border-gray-800 hover:border-gray-700'}`}>

              {/* Direction badge */}
              <span className={`mt-0.5 shrink-0 text-xs font-bold px-2 py-0.5 rounded-md uppercase
                ${r.direction === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {r.direction}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-semibold">{r.pair}</span>
                  <span className="text-gray-500 text-xs">·</span>
                  <span className={`text-xs ${isPast(r.remind_at) ? 'text-gray-600' : 'text-[#ecae10]'}`}>
                    {formatDt(r.remind_at)}
                    {isPast(r.remind_at) && ' · past'}
                  </span>
                </div>
                <div className="flex gap-3 mt-1 flex-wrap">
                  {r.sl != null && <span className="text-xs text-gray-500">SL: <span className="text-red-400">{r.sl}</span></span>}
                  {r.tp != null && <span className="text-xs text-gray-500">TP: <span className="text-emerald-400">{r.tp}</span></span>}
                  {r.notes && <span className="text-xs text-gray-500 truncate max-w-[200px]">{r.notes}</span>}
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => { setEditId(r.id); setShowForm(false) }}
                  className="p-1.5 rounded-md text-gray-500 hover:text-[#ecae10] hover:bg-gray-800 transition-colors">
                  <Pencil size={13} />
                </button>
                <button onClick={() => remove(r.id)}
                  className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
