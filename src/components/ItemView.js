import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function ItemView() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

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
      fetchItem();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="mobile-item-view">
      <h2>{item.name}</h2>
      <div className="item-details">
        <p>SKU: {item.sku}</p>
        <p>Price: ${item.price}</p>
        <p>Status: {item.status}</p>
      </div>
      <div className="status-buttons">
        <button 
          onClick={() => handleStatusChange('available')}
          className={item.status === 'available' ? 'active' : ''}
        >
          Available
        </button>
        <button 
          onClick={() => handleStatusChange('on hold')}
          className={item.status === 'on hold' ? 'active' : ''}
        >
          On Hold
        </button>
        <button 
          onClick={() => handleStatusChange('sold')}
          className={item.status === 'sold' ? 'active' : ''}
        >
          Sold
        </button>
      </div>
    </div>
  );
}

export default ItemView;