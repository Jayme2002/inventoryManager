import './App.css';
import { useAuth } from "./providers/AuthProvider";
import SignIn from './components/SignIn';
import Inventory from './components/Inventory';
import ItemHistory from './components/ItemHistory';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ItemView from './components/ItemView';

function App() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('inventory');

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'history':
        return <ItemHistory />;
      default:
        return <Inventory />;
    }
  };

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