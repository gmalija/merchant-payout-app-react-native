/**
 * Hook to initialize MSW in development mode
 */
import { useEffect, useState } from 'react';
import { server } from './server';

export function useMSW() {
  const [isReady, setIsReady] = useState(!__DEV__);

  useEffect(() => {
    if (__DEV__) {
      console.log('[MSW] Starting initialization...');

      try {
        console.log('[MSW] Starting server listener...');
        server.listen({
          onUnhandledRequest: 'warn',
        });
        console.log('[MSW] Server listening, MSW ready!');
        setIsReady(true);
      } catch (error) {
        console.error('[MSW] Failed to start MSW:', error);
        console.error('[MSW] Error details:', error);
        // Still set ready to true to prevent blocking the app
        setIsReady(true);
      }
    }
  }, []);

  return isReady;
}
