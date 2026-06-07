import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'

const container = document.getElementById('root')!

// Prerenderad HTML (prod) → hydrera. Tom container (dev) → createRoot.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />)
} else {
  createRoot(container).render(<App />)
}
