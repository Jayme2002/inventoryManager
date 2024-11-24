import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, getDocs, where } from 'firebase/firestore';

function ItemHistory() {
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    fetchSoldItems();
  }, []);

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

  return (
    <div className="inventory-page">
      <h2>Item History</h2>
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
}

export default ItemHistory;