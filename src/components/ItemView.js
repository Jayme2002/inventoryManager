import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { db, storage } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function ItemView() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchItem = useCallback(async () => {
    try {
      const docRef = doc(db, 'inventory', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item:', error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'inventory', id), { status: newStatus });
      fetchItem(); // Refresh the item data
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `items/${item.id}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      // Update item in Firestore with new image URL
      await updateDoc(doc(db, 'inventory', id), { 
        imageUrl: url 
      });
      
      setImageUrl(url);
      fetchItem(); // Refresh item data
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
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

      <div className="image-upload-section">
        <h3>Item Image</h3>
        {imageUrl ? (
          <div className="item-image-container">
            <img src={imageUrl} alt={item.name} className="item-image" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="change-image-btn"
            >
              Change Image
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          style={{ display: 'none' }}
        />
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        Back to Inventory
      </button>
    </div>
  );
}

export default ItemView;