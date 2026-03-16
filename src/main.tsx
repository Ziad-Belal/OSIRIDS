import React from 'react'
import ReactDOM from 'react-dom/client'
import App from 'C:/Users/Ziad/OneDrive/Documents/OSIRIDS/src/App.tsx'
import './index.css'
import { CartProvider } from 'C:/Users/Ziad/OneDrive/Documents/OSIRIDS/src\context/CartContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)
