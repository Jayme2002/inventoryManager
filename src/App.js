import './App.css';
import { useAuth } from "./providers/AuthProvider";
import SignIn from './components/SignIn';
import Inventory from './components/Inventory';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ItemView from './components/ItemView';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const { user, logout, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('inventory');

  // Define ProtectedRoute component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      const currentPath = window.location.pathname;
      return <Navigate to={`/?redirect=${currentPath}`} replace />;
    }
    return children;
  };

  // Define renderPage function
  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Inventory />;
    }
  };

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
                      {isAdmin && (
                        <button 
                          onClick={() => setCurrentPage('admin')}
                          className={currentPage === 'admin' ? 'active' : ''}
                        >
                          Admin
                        </button>
                      )}
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