import { useEffect, useRef, useCallback } from 'react';

const WS_URL = 'wss://ws.derivws.com/websockets/v3?app_id=1089';

export function useDerivTicks(symbol, onTick) {
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const subscriptionId = useRef(null);
  const currentSymbol = useRef(null);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) return;

    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.tick) onTickRef.current(data.tick);
        if (data.subscription) subscriptionId.current = data.subscription.id;
        if (data.error) console.error('Deriv API error:', data.error.message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('⚠️ Disconnected from Deriv API. Reconnecting...');
      subscriptionId.current = null;
      reconnectTimeout.current = setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) ws.current.close();
    };
  }, [connect]);

  useEffect(() => {
    if (!symbol) return;

    const subscribe = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        if (subscriptionId.current && currentSymbol.current !== symbol) {
          ws.current.send(JSON.stringify({ forget: subscriptionId.current }));
          subscriptionId.current = null;
        }
        ws.current.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
        currentSymbol.current = symbol;
      } else {
        const waitForOpen = () => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            subscribe();
          } else if (ws.current?.readyState === WebSocket.CONNECTING) {
            setTimeout(waitForOpen, 100);
          }
        };
        waitForOpen();
      }
    };

    subscribe();

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN && subscriptionId.current) {
        ws.current.send(JSON.stringify({ forget: subscriptionId.current }));
      }
    };
  }, [symbol]);
}
