import { useEffect, useRef, useCallback } from 'react';

const WS_URL = 'wss://ws.derivws.com/websockets/v3?app_id=1089';

export function useDerivTicks(symbol, onTick) {
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('✅ Connected to Deriv API');
      ws.current.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tick) onTick(data.tick);
      if (data.error) console.error('Deriv API error:', data.error.message);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('⚠️ Disconnected from Deriv API. Reconnecting...');
      reconnectTimeout.current = setTimeout(connect, 3000);
    };
  }, [symbol, onTick]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) ws.current.close();
    };
  }, [connect]);
}
