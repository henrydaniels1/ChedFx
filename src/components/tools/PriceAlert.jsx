import { useState, useCallback, useRef, useEffect } from 'react';
import { useDerivTicks } from '../../hooks/useDerivTicks';
import { Bell, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SYMBOLS = [
  'R_10', 'R_25', 'R_50', 'R_75', 'R_100',
  '1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V',
  'JD10', 'JD25', 'JD50', 'JD75', 'JD100',
  'frxEURUSD', 'frxGBPUSD', 'frxUSDJPY', 'frxAUDUSD', 'frxEURGBP'
];

let audioContext = null;

const playAlertSound = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  const playTone = (freq, startTime, duration) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };
  
  const now = audioContext.currentTime;
  playTone(659, now, 0.5);
  playTone(784, now + 0.5, 0.5);
  playTone(880, now + 1.0, 0.8);
  playTone(1047, now + 1.1, 0.5); // Add a high C note
};

const inp = 'bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ecae10] transition-colors';

export default function PriceAlert() {
  const { user } = useAuth();
  const [symbol, setSymbol] = useState('R_100');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');
  const triggeredAlerts = useRef(new Set());

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleTick = useCallback((tick) => {
    const price = tick.quote;
    setCurrentPrice(price);

    setAlerts(prev => prev.map(alert => {
      if (alert.triggered) return alert;

      const key = alert.id;
      const hit =
        (alert.condition === 'above' && price >= alert.target) ||
        (alert.condition === 'below' && price <= alert.target);

      if (hit && !triggeredAlerts.current.has(key)) {
        triggeredAlerts.current.add(key);

        playAlertSound();

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Price Alert: ${alert.symbol}`, {
            body: `Price is ${alert.condition === 'above' ? '≥' : '≤'} ${alert.target} (now: ${price.toFixed(5)})`,
            icon: '/favicon.ico'
          });
        }

        return { ...alert, triggered: true, triggeredAt: price };
      }

      return alert;
    }));
  }, []);

  useDerivTicks(symbol, handleTick);

  const addAlert = () => {
    if (!targetPrice) return;
    setAlerts(prev => [...prev, {
      id: Date.now(),
      symbol,
      target: parseFloat(targetPrice),
      condition,
      triggered: false,
      triggeredAt: null,
    }]);
    setTargetPrice('');
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    triggeredAlerts.current.delete(id);
  };

  if (!user) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-500 text-sm">Sign in to use Price Alerts.</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto w-full gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Price Alerts</p>
          <p className="text-gray-500 text-xs mt-0.5">{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Current Price Display */}
      <div className="bg-[#0d1117] border border-gray-800 rounded-2xl px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Current Price</p>
            <p className="text-white text-3xl font-bold">{currentPrice?.toFixed(5) ?? 'Loading...'}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Symbol</p>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} 
              className="bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-[#ecae10]">
              {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Add Alert Form */}
      <div className="bg-[#0d1117] border border-gray-800 rounded-2xl px-5 py-4">
        <p className="text-white text-sm font-semibold mb-3">Set New Alert</p>
        <div className="flex gap-2">
          <select value={condition} onChange={e => setCondition(e.target.value)} className={inp}>
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <input
            type="number"
            step="0.00001"
            placeholder="Target price"
            value={targetPrice}
            onChange={e => setTargetPrice(e.target.value)}
            className={`${inp} flex-1`}
          />
          <button onClick={addAlert} disabled={!targetPrice}
            className="px-4 py-2 rounded-lg bg-[#ecae10] hover:bg-[#d49c0e] text-black font-semibold text-sm transition-colors disabled:opacity-40 flex items-center gap-1.5">
            <Bell size={14} /> Add
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Bell size={48} className="text-gray-700" />
            <p className="text-gray-500 text-sm">No price alerts set</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`bg-[#0d1117] border rounded-xl px-4 py-3 flex items-center justify-between ${
              alert.triggered ? 'border-green-500/50 bg-green-500/5' : 'border-gray-800'
            }`}>
              <div className="flex items-center gap-3">
                {alert.triggered ? (
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    {alert.condition === 'above' ? 
                      <TrendingUp size={18} className="text-green-400" /> : 
                      <TrendingDown size={18} className="text-red-400" />
                    }
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-semibold">
                    {alert.symbol} {alert.condition} {alert.target.toFixed(5)}
                  </p>
                  {alert.triggered && (
                    <p className="text-green-400 text-xs mt-0.5">
                      Triggered at {alert.triggeredAt.toFixed(5)}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => removeAlert(alert.id)}
                className="w-8 h-8 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center">
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
