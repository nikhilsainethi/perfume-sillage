import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'

// After each deploy the hashed chunk names change, so a browser holding a
// stale index.html 404s on every lazy route (Atelier, Houses, Finder…) and
// lands on the error boundary. Vite fires this event on a failed dynamic
// import — one reload fetches the fresh index.html and heals the client.
// The session flag stops a reload loop if the failure is something else.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'sillage-chunk-reload'
  if (sessionStorage.getItem(KEY)) return // second strike: let it surface
  sessionStorage.setItem(KEY, '1')
  event.preventDefault()
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
