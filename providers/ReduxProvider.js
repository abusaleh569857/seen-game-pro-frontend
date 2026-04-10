'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import LanguageSync from '@/components/LanguageSync';
import { store } from '@/store';
import { initAuth } from '@/store/slices/authSlice';

function AuthInitializer({ children }) {
  useEffect(() => {
    store.dispatch(initAuth());
  }, []);

  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <LanguageSync />
        {children}
      </AuthInitializer>
    </Provider>
  );
}

