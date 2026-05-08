import { useState, useEffect, useRef } from 'react'
import { Trash2, Upload, X, Loader2, Download, Link2, Check } from 'lucide-react'
import { supabase } from '../../config/supabase'
import { useAuth } from '../../context/AuthContext'

const BUCKET = 'fx-charts'

export default function MediaGallery() {
  const { user } = useAuth()
  const [images, setImages] = useState([])
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')
  const inputRef = useRef()

  // Load images
  useEffect(() => {
    setLoading(true)
    if (!user) {
      try {
        const stored = JSON.parse(localStorage.getItem('media_gallery'))
        if (Array.isArray(stored)) setImages(stored)
      } catch { /* ignore */ }
      setLoading(false)
      return
    }
    supabase
      .from('media_gallery')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(async ({ data }) => {
        if (!data) return
        const withUrls = await Promise.all(
          data.map(async (row) => {
            const { data: signedData, error } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(row.path, 60 * 60 * 24 * 7) // 7 days
            
            if (error || !signedData?.signedUrl) {
              console.error('Failed to sign URL for', row.path, error)
              return null
            }
            
            return { ...row, url: signedData.signedUrl }
          })
        )
        setImages(withUrls.filter(Boolean))
      })
      .finally(() => setLoading(false))
  }, [user])

  // Persist locally when not signed in
  useEffect(() => {
    if (!user) localStorage.setItem('media_gallery', JSON.stringify(images))
  }, [images, user])

  const handleFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!valid.length) return

    if (!user) {
      const local = valid.map(f => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(f),
        name: f.name,
        note: '',
        created_at: new Date().toISOString(),
      }))
      setImages(prev => [...local, ...prev])
      return
    }

    setUploading(true)
    for (const file of valid) {
      const path = `${user.id}/${Date.now()}_${file.name}`
      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, file)
      if (uploadErr) {
        console.error('Upload error:', uploadErr)
        continue
      }

      const { data: signedData, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 7) // 7 days
      
      if (signErr || !signedData?.signedUrl) {
        console.error('Failed to sign URL for', path, signErr)
        continue
      }
      
      const { data, error } = await supabase
        .from('media_gallery')
        .insert({ user_id: user.id, name: file.name, path, note: '' })
        .select()
        .single()
      if (!error) setImages(prev => [{ ...data, url: signedData.signedUrl }, ...prev])
    }
    setUploading(false)
  }

  const remove = async (img) => {
    if (user) {
      await supabase.storage.from(BUCKET).remove([img.path])
      await supabase.from('media_gallery').delete().eq('id', img.id)
    }
    setImages(prev => prev.filter(i => i.id !== img.id))
    if (preview?.id === img.id) setPreview(null)
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const copyLink = async (url, id) => {
    await navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const download = async (img) => {
    const a = document.createElement('a')
    a.href = img.url
    a.download = img.name
    a.click()
  }

  const saveNote = async (img) => {
    if (user) {
      await supabase
        .from('media_gallery')
        .update({ note: noteText })
        .eq('id', img.id)
    }
    setImages(prev => prev.map(i => i.id === img.id ? { ...i, note: noteText } : i))
    setEditingNote(null)
    setNoteText('')
  }

  const startEditNote = (img) => {
    setEditingNote(img.id)
    setNoteText(img.note || '')
  }

  return (
    <div className="h-full flex flex-col gap-4 p-4">

      {/* Upload zone */}
      <div
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && inputRef.current.click()}
        className="border-2 border-dashed border-gray-700 hover:border-[#ecae10]/60 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors group">
        {uploading
          ? <Loader2 size={24} className="text-[#ecae10] animate-spin" />
          : <Upload size={24} className="text-gray-500 group-hover:text-[#ecae10] transition-colors" />
        }
        <p className="text-gray-400 text-sm">
          {uploading ? 'Uploading…' : <>Drop charts here or <span className="text-[#ecae10]">browse</span></>}
        </p>
        <p className="text-gray-600 text-xs">PNG, JPG, WEBP</p>
        {!user && <p className="text-[#ecae10] text-xs">Sign in to sync across devices</p>}
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="text-[#ecae10] animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm">No charts uploaded yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map(img => (
              <div key={img.id}
                className="group relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900 aspect-video cursor-pointer"
                onClick={() => setPreview(img)}>
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex gap-1">
                      <button
                        onClick={e => { e.stopPropagation(); copyLink(img.url, img.id) }}
                        className="p-1.5 rounded-lg bg-[#ecae10]/20 hover:bg-[#ecae10]/40 text-[#ecae10] transition-colors">
                        {copied === img.id ? <Check size={14} /> : <Link2 size={14} />}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); download(img) }}
                        className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); remove(img) }}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <p className="text-[10px] text-gray-300 truncate">{formatDate(img.created_at)}</p>
                    {img.note && <p className="text-[10px] text-[#ecae10] font-medium truncate">{img.note}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <div className="relative w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{preview.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{formatDate(preview.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                {editingNote === preview.id ? (
                  <>
                    <input
                      type="text"
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="e.g. EUR/USD"
                      className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-[#ecae10]"
                      autoFocus
                    />
                    <button onClick={() => saveNote(preview)}
                      className="px-2 py-1 text-xs rounded bg-[#ecae10] text-black hover:bg-[#ecae10]/80">
                      Save
                    </button>
                    <button onClick={() => { setEditingNote(null); setNoteText('') }}
                      className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="text-[#ecae10] text-xs">{preview.note || 'No pair'}</p>
                      <button onClick={() => startEditNote(preview)}
                        className="text-[10px] text-gray-500 hover:text-[#ecae10] underline">
                        {preview.note ? 'Edit' : 'Add'}
                      </button>
                    </div>
                  </>
                )}
                <button onClick={() => copyLink(preview.url, preview.id)}
                  className="p-2 rounded-lg bg-[#ecae10]/20 hover:bg-[#ecae10]/40 text-[#ecae10] transition-colors">
                  {copied === preview.id ? <Check size={16} /> : <Link2 size={16} />}
                </button>
                <button onClick={() => download(preview)}
                  className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-colors">
                  <Download size={16} />
                </button>
                <button onClick={() => remove(preview)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setPreview(null)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0">
              <img src={preview.url} alt={preview.name} className="max-w-full max-h-full rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
