import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

/**
 * Custom hook for authentication-aware Amplify client
 * Returns client with proper auth mode based on user state
 */
export function useAmplifyClient() {
  const [client, setClient] = useState(() => 
    generateClient<Schema>({
      authMode: 'apiKey' // Default to apiKey for guests
    })
  );

  useEffect(() => {
    let isMounted = true;

    const updateClient = async () => {
      try {
        // Check if user is authenticated
        await getCurrentUser();
        
        // User is authenticated - use userPool auth mode
        if (isMounted) {
          setClient(generateClient<Schema>({
            authMode: 'userPool'
          }));
        }
      } catch (error) {
        // User is not authenticated - use apiKey auth mode
        if (isMounted) {
          setClient(generateClient<Schema>({
            authMode: 'apiKey'
          }));
        }
      }
    };

    updateClient();

    return () => {
      isMounted = false;
    };
  }, []);

  return client;
}
