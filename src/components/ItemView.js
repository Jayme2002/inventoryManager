import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function ItemView() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchItem();
    }
  }, [id, user]);

  const fetchItem = async () => {
    try {
      const itemDoc = await getDoc(doc(db, 'inventory', id));
      if (itemDoc.exists()) {
        setItem({ id: itemDoc.id, ...itemDoc.data() });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'inventory', id), { status: newStatus });
      fetchItem(); // Refresh the item data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (!user) return <div>Please sign in to view this item</div>;
  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="mobile-item-view">
      <div className="item-header">
        <h2>{item.name}</h2>
        <span className="sku">SKU: {item.sku}</span>
      </div>
      
      <div className="item-details">
        <div className="detail-row">
          <label>Price:</label>
          <span>${item.price}</span>
        </div>
        <div className="detail-row">
          <label>Consignor:</label>
          <span>{item.consignorName}</span>
        </div>
        <div className="detail-row">
          <label>Quantity:</label>
          <span>{item.quantity}</span>
        </div>
        <div className="detail-row">
          <label>Current Status:</label>
          <span className={`status-badge ${item.status}`}>{item.status}</span>
        </div>
      </div>

      <div className="status-controls">
        <h3>Update Status</h3>
        <div className="status-buttons">
          <button 
            onClick={() => handleStatusChange('available')}
            className={`status-button ${item.status === 'available' ? 'active' : ''}`}
          >
            Mark as Available
          </button>
          <button 
            onClick={() => handleStatusChange('on hold')}
            className={`status-button ${item.status === 'on hold' ? 'active' : ''}`}
          >
            Put on Hold
          </button>
          <button 
            onClick={() => handleStatusChange('sold')}
            className={`status-button ${item.status === 'sold' ? 'active' : ''}`}
          >
            Mark as Sold
          </button>
        </div>
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        Back to Inventory
      </button>
    </div>
  );
}

export default ItemView;