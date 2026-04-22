import { useState, useEffect, useRef } from 'react'
import { Trash2, StickyNote } from 'lucide-react'
import { supabase } from '../../config/supabase'
import { useAuth } from '../../context/AuthContext'

export default function Notes() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [note, setNote]   = useState('')
  const textareaRef       = useRef(null)

  useEffect(() => {
    if (!user) {
      try {
        const stored = JSON.parse(localStorage.getItem('notes'))
        if (Array.isArray(stored)) setNotes(stored)
      } catch { /* ignore */ }
      return
    }
    supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setNotes(data))
  }, [user])

  useEffect(() => {
    if (!user) localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes, user])

  const addNote = async () => {
    if (!note.trim()) return
    if (!user) {
      setNotes(prev => [{ id: Date.now(), text: note.trim(), created_at: new Date().toISOString() }, ...prev])
    } else {
      const { data, error } = await supabase
        .from('notes')
        .insert({ user_id: user.id, text: note.trim() })
        .select()
        .single()
      if (!error) setNotes(prev => [data, ...prev])
    }
    setNote('')
    textareaRef.current?.focus()
  }

  const deleteNote = async (id) => {
    if (user) await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = async () => {
    if (user) await supabase.from('notes').delete().eq('user_id', user.id)
    setNotes([])
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
           d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-full flex flex-col max-w-xl mx-auto w-full">
      <div className="bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full">

        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Trading Notes</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {notes.length} note{notes.length !== 1 ? 's' : ''} saved
              {!user && <span className="ml-1 text-[#ecae10]">(local only — sign in to sync)</span>}
            </p>
          </div>
          {notes.length > 0 && (
            <button onClick={clearAll} className="text-xs text-gray-600 hover:text-red-400 transition-colors">
              Clear all
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <StickyNote size={32} className="text-gray-700" />
              <p className="text-gray-500 text-sm">No notes yet. Add one below.</p>
            </div>
          ) : (
            notes.map(n => (
              <div key={n.id} className="group flex gap-3 p-3.5 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
                <p className="flex-1 text-white text-sm leading-relaxed whitespace-pre-wrap">{n.text}</p>
                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                  <button onClick={() => deleteNote(n.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                  <span className="text-gray-600 text-[10px] whitespace-nowrap">{formatDate(n.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 space-y-2">
          <textarea
            ref={textareaRef} rows={3} value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) addNote() }}
            placeholder="Write a note… (Ctrl+Enter to save)"
            className="w-full bg-[#080c12] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ecae10] transition-colors placeholder-gray-600 resize-none" />
          <button onClick={addNote} disabled={!note.trim()}
            className="w-full py-2.5 rounded-lg bg-[#ecae10] hover:bg-[#d49c0e] text-black font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Save Note
          </button>
        </div>
      </div>
    </div>
  )
}
