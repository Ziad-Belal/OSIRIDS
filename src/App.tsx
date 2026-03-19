import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntryExperience from './components/EntryExperience';
import Navbar   from './components/Navbar';
import Products from './pages/Products';
import Cart     from './pages/Cart';
import About    from './pages/About';
import Admin    from './pages/Admin';

function App() {
  const [entered, setEntered] = useState(() => {
    return sessionStorage.getItem('osirids_entered') === 'true';
  });

  const handleComplete = () => {
    sessionStorage.setItem('osirids_entered', 'true');
    setEntered(true);
  };

  if (!entered) {
    return <EntryExperience onComplete={handleComplete} />;
  }

  return (
    <>
      <div className="site-in">
        <Router>
          <div className="min-h-screen bg-pharoic-black">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/"         element={<Products />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart"     element={<Cart />} />
                <Route path="/about"    element={<About />} />
                <Route path="/admin"    element={<Admin />} />
              </Routes>
            </main>
            <footer className="border-t border-white/10 py-8 text-center text-white/30 text-xs tracking-widest uppercase">
              <p>&copy; 2026 Osirids. All rights reserved.</p>
            </footer>
          </div>
        </Router>
      </div>
      <style>{`
        .site-in {
          animation: siteIn 1.2s ease both;
        }
        @keyframes siteIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default App;