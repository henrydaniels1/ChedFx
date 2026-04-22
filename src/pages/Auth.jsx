import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

const input = "w-full bg-[#0d1117] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#ecae10] transition-colors placeholder-gray-600"

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(null)

  const handle = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    const fn = mode === 'login' ? signIn : signUp
    const { error: err, data } = await fn(email, password)
    setLoading(false)
    if (err) return setError(err.message)
    if (mode === 'register' && !data.session) {
      setInfo('Check your email to confirm your account.')
    } else {
      navigate('/bot')
    }
  }

  return (
    <div className="min-h-screen bg-[#080c12] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-800">
          <p className="text-white font-bold text-lg">
            Ched<span className="text-[#ecae10]">Fx</span>
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handle} className="px-6 py-5 space-y-4">
          <input
            type="email" required placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)}
            className={input} />
          <input
            type="password" required placeholder="Password" minLength={6}
            value={password} onChange={e => setPassword(e.target.value)}
            className={input} />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {info  && <p className="text-green-400 text-sm">{info}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#ecae10] hover:bg-[#d49c0e] text-black font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-gray-500 text-xs">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setInfo(null) }}
              className="text-[#ecae10] hover:underline">
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
