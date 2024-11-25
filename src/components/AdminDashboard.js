import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../providers/AuthProvider';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    soldItems: 0,
    totalRevenue: 0
  });
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchStats();
      fetchSoldItems();
    }
  }, [isAdmin]);

  const fetchSoldItems = async () => {
    try {
      const q = query(
        collection(db, 'inventory'),
        where('status', '==', 'sold')
      );
      const querySnapshot = await getDocs(q);
      const itemsList = [];
      querySnapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setSoldItems(itemsList);
    } catch (error) {
      console.error('Error fetching sold items:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const itemsSnapshot = await getDocs(collection(db, 'inventory'));
      let totalItems = 0;
      let soldItems = 0;
      let totalRevenue = 0;

      itemsSnapshot.forEach((doc) => {
        const item = doc.data();
        totalItems++;
        if (item.status === 'sold') {
          soldItems++;
          totalRevenue += parseFloat(item.price);
        }
      });

      setStats({ totalItems, soldItems, totalRevenue });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: !currentStatus
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Items</h3>
                <p>{stats.totalItems}</p>
              </div>
              <div className="stat-card">
                <h3>Sold Items</h3>
                <p>{stats.soldItems}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>${stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="users-section">
              <h3>User Management</h3>
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Admin Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                      <td>
                        <button 
                          onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                          className={user.isAdmin ? 'revoke-admin' : 'make-admin'}
                        >
                          {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'history':
        return (
          <div className="history-section">
            <h3>Sales History</h3>
            <div className="inventory-table">
              <table>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Consignor</th>
                    <th>Date Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {soldItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.sku}</td>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.consignorName}</td>
                      <td>{new Date(item.dateAdded).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview' ? 'active' : ''}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'active' : ''}
        >
          Sales History
        </button>
      </div>

      {renderContent()}
    </div>
  );
}

export default AdminDashboard;