import { useEffect } from 'react';

type BeforeUnloadHandler = (event: BeforeUnloadEvent) => void;

export function useBeforeUnload(handler: BeforeUnloadHandler) {
  useEffect(() => {
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [handler]);
} 