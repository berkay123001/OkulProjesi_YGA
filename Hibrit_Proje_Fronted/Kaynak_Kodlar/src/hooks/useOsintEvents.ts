import { useEffect, useRef, useState } from 'react';
import { getEventsUrl } from '@/lib/api';
import type { SseEvent } from '@/types';

interface UseOsintEventsOptions {
  enabled?: boolean;
  onEvent: (event: SseEvent) => void;
}

export function useOsintEvents({ enabled = true, onEvent }: UseOsintEventsOptions) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) return;

    const eventSource = new EventSource(getEventsUrl());

    eventSource.onopen = () => {
      setConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SseEvent;
        onEventRef.current(data);
      } catch {
        setError('SSE olayı okunamadı.');
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      setError('SSE bağlantısı kurulamadı veya koptu.');
    };

    return () => {
      eventSource.close();
    };
  }, [enabled]);

  return { connected, error };
}
