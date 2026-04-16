'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import I18nProvider from '@/providers/I18nProvider';
import LanguageSync from '@/components/LanguageSync';
import { store } from '@/store';
import { initAuth } from '@/store/slices/authSlice';

function AuthInitializer({ children }) {
  useEffect(() => {
    store.dispatch(initAuth());
  }, []);

  return children;
}

export default function ReduxProvider({ children, initialLanguage }) {
  return (
    <Provider store={store}>
      <I18nProvider>
        <AuthInitializer>
          <LanguageSync initialLanguage={initialLanguage} />
          {children}
        </AuthInitializer>
      </I18nProvider>
    </Provider>
  );
}

