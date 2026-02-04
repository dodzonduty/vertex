/**
 * State Preservation Utility
 * Preserves form state when navigating between pages
 */

import React from 'react';

export const StatePreservation = {
  /**
   * Save state to localStorage
   */
  save<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`vertex_state_${key}`, serialized);
    } catch (error) {
      console.warn(`Failed to save state for key: ${key}`, error);
    }
  },

  /**
   * Load state from localStorage
   */
  load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`vertex_state_${key}`);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.warn(`Failed to load state for key: ${key}`, error);
    }
    return null;
  },

  /**
   * Clear saved state
   */
  clear(key: string): void {
    try {
      localStorage.removeItem(`vertex_state_${key}`);
    } catch (error) {
      console.warn(`Failed to clear state for key: ${key}`, error);
    }
  },

  /**
   * Save state to sessionStorage (temporary, cleared on tab close)
   */
  saveSession<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      sessionStorage.setItem(`vertex_session_${key}`, serialized);
    } catch (error) {
      console.warn(`Failed to save session state for key: ${key}`, error);
    }
  },

  /**
   * Load state from sessionStorage
   */
  loadSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(`vertex_session_${key}`);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.warn(`Failed to load session state for key: ${key}`, error);
    }
    return null;
  },

  /**
   * Clear session state
   */
  clearSession(key: string): void {
    try {
      sessionStorage.removeItem(`vertex_session_${key}`);
    } catch (error) {
      console.warn(`Failed to clear session state for key: ${key}`, error);
    }
  }
};

/**
 * React hook for preserving form state
 */
export function useFormStatePreservation<T>(
  key: string,
  initialValue: T,
  useSession: boolean = false
): [T, (value: T) => void, () => void] {
  const storageKey = `form_${key}`;
  
  // Load initial value from storage
  const savedValue = useSession 
    ? StatePreservation.loadSession<T>(storageKey)
    : StatePreservation.load<T>(storageKey);
  
  const [state, setState] = React.useState<T>(savedValue || initialValue);

  // Save state whenever it changes
  React.useEffect(() => {
    if (useSession) {
      StatePreservation.saveSession(storageKey, state);
    } else {
      StatePreservation.save(storageKey, state);
    }
  }, [state, storageKey, useSession]);

  const clearState = React.useCallback(() => {
    if (useSession) {
      StatePreservation.clearSession(storageKey);
    } else {
      StatePreservation.clear(storageKey);
    }
    setState(initialValue);
  }, [storageKey, initialValue, useSession]);

  return [state, setState, clearState];
}

