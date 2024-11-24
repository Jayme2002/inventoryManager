import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from "../providers/AuthProvider";

function ItemView() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedItem, setEditedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchItem();
    }
  }, [id, user]);

  const fetchItem = async () => {
    try {
      const itemDoc = await getDoc(doc(db, 'inventory', id));
      if (itemDoc.exists()) {
        const itemData = { id: itemDoc.id, ...itemDoc.data() };
        setItem(itemData);
        setEditedItem(itemData);
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
      fetchItem();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'inventory', id), editedItem);
      fetchItem();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
      navigate('/');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (!user) return <div>Please sign in to view this item</div>;
  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  if (showDeleteConfirm) {
    return (
      <div className="mobile-item-view">
        <div className="delete-confirm">
          <h2>Delete Item</h2>
          <p>Are you sure you want to delete this item?</p>
          <p className="item-details">
            {item.name} (SKU: {item.sku})
          </p>
          <div className="delete-actions">
            <button onClick={handleDelete} className="confirm-delete">
              Yes, Delete Item
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="cancel-delete">
              No, Keep Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-item-view">
      <h2>Edit Item</h2>
      <form onSubmit={handleSave}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="SKU"
            value={editedItem.sku}
            onChange={(e) => setEditedItem({...editedItem, sku: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Item Name"
            value={editedItem.name}
            onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={editedItem.price}
            onChange={(e) => setEditedItem({...editedItem, price: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={editedItem.quantity}
            onChange={(e) => setEditedItem({...editedItem, quantity: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Consignor Name"
            value={editedItem.consignorName}
            onChange={(e) => setEditedItem({...editedItem, consignorName: e.target.value})}
            required
          />
        </div>

        <div className="status-buttons">
          <button 
            type="button"
            onClick={() => handleStatusChange('available')}
            className={item.status === 'available' ? 'active' : ''}
          >
            Available
          </button>
          <button 
            type="button"
            onClick={() => handleStatusChange('on hold')}
            className={item.status === 'on hold' ? 'active' : ''}
          >
            On Hold
          </button>
          <button 
            type="button"
            onClick={() => handleStatusChange('sold')}
            className={item.status === 'sold' ? 'active' : ''}
          >
            Sold
          </button>
        </div>

        <div className="modal-actions">
          <button type="submit" className="save-button">Save Changes</button>
          <button 
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="delete-button"
          >
            Delete Item
          </button>
          <button type="button" onClick={() => navigate('/')} className="cancel-button">
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemView;