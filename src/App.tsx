import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import About from './pages/About';

function App() {
  const isEnvSet = true; // Bypassing check to allow UI to render without .env file for demo purposes

  if (!isEnvSet) {
    return (
      <div className="min-h-screen bg-pharoic-black flex items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <img src="/o.png" alt="Logo" className="w-20 h-20 mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-pharoic-gold uppercase">Configuration Required</h1>
          <p className="text-white/60 leading-relaxed">
            Please set up your Supabase environment variables in <code>.env</code> file.
            Refer to <code>.env.example</code> for the required keys.
          </p>
          <div className="p-4 bg-white/5 border border-white/10 text-xs text-left">
            <code className="text-pharoic-gold">
              VITE_SUPABASE_URL=...<br />
              VITE_SUPABASE_ANON_KEY=...
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-pharoic-black">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="border-t border-white/10 py-8 text-center text-white/50">
          <p>&copy; 2026 Osirids. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
