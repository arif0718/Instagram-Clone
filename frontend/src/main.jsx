import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster />              {/* for this 1st install sonner its used for small msg box like: (message sent) */}
    
  </StrictMode>
)