import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializePWA } from './utils/pwa.js'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { ClerkProvider } from '@clerk/clerk-react';

// Initialize PWA features
initializePWA();

const persistor = persistStore(store);

// 🟢 Your Clerk publishable key
 const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }



ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </ClerkProvider>
)
