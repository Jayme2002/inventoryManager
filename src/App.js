import './App.css';
import { useAuth } from "./providers/AuthProvider";
import SignIn from './components/SignIn';
import Inventory from './components/Inventory';
import ItemHistory from './components/ItemHistory';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ItemView from './components/ItemView';

function App() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('inventory');
  
  // Get redirect from URL parameters
  const getRedirectPath = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect');
  };

  const redirectPath = getRedirectPath();

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/item/:id" element={
            <ProtectedRoute>
              <div className="app-container">
                <header className="main-header">
                  <h1>Inventory Manager</h1>
                  <button onClick={logout} className="logout-button">Sign Out</button>
                </header>
                <ItemView />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/" element={
            user ? (
              redirectPath ? (
                <Navigate to={redirectPath} replace />
              ) : (
                <div className="app-container">
                  <header className="main-header">
                    <nav className="nav-buttons">
                      <button 
                        onClick={() => setCurrentPage('inventory')}
                        className={currentPage === 'inventory' ? 'active' : ''}
                      >
                        Inventory
                      </button>
                      <button 
                        onClick={() => setCurrentPage('history')}
                        className={currentPage === 'history' ? 'active' : ''}
                      >
                        History
                      </button>
                    </nav>
                    <h1>Inventory Manager</h1>
                    <button onClick={logout} className="logout-button">Sign Out</button>
                  </header>
                  <main>
                    {renderPage()}
                  </main>
                </div>
              )
            ) : (
              <SignIn />
            )
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;