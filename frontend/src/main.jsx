import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from 'redux-persist'

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />              {/* for this 1st install sonner its used for small msg box like: (message sent) */}
      </PersistGate>
    </Provider>
    
  </StrictMode>
)