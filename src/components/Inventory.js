import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import ItemModal from './ItemModal';
import AddItemModal from './AddItemModal';

function Inventory() {
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'inventory'));
      const querySnapshot = await getDocs(q);
      const itemsList = [];
      querySnapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsList);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      await addDoc(collection(db, 'inventory'), {
        ...newItem,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity),
        dateAdded: new Date().toISOString()
      });
      
      setShowAddForm(false);
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error.message);
    }
  };

  const getSortedItems = (items) => {
    if (!sortField) return items;
    
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'sku':
          comparison = a.sku.localeCompare(b.sku);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'dateAdded':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'consignorName':
          comparison = a.consignorName.localeCompare(b.consignorName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const filteredItems = getSortedItems(items.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return item.sku.toLowerCase().includes(searchLower) || 
           item.consignorName.toLowerCase().includes(searchLower);
  }));

  const handleHeaderClick = (field) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField('');
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIndicatorClass = (field) => {
    if (sortField === field) {
      return `sort-arrows active-${sortDirection}`;
    }
    return 'sort-arrows';
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleSaveItem = async (editedItem) => {
    try {
      const itemRef = doc(db, 'inventory', editedItem.id);
      await updateDoc(itemRef, editedItem);
      fetchItems();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'inventory', itemId));
      fetchItems();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const itemRef = doc(db, 'inventory', itemId);
      await updateDoc(itemRef, { status: newStatus });
      fetchItems();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="inventory-page">
      <div className="controls-bar">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search by SKU or consignor name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-button">
          {showAddForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {showAddForm && (
        <AddItemModal
          onClose={() => setShowAddForm(false)}
          onSave={handleAddItem}
        />
      )}

      <div className="inventory-table">
        <table>
        <thead>
            <tr>
                <th onClick={() => handleHeaderClick('sku')}>
                  SKU
                  <span className={getSortIndicatorClass('sku')}>
                    <span className="up-arrow">↑</span>
                    <span className="down-arrow">↓</span>
                  </span>
                </th>
                <th onClick={() => handleHeaderClick('name')}>
                  Name
                  <span className={getSortIndicatorClass('name')}>
                    <span className="up-arrow">↑</span>
                    <span className="down-arrow">↓</span>
                  </span>
                </th>
                <th onClick={() => handleHeaderClick('price')}>
                  Price 
                  <span className={getSortIndicatorClass('price')}>
                    <span className="up-arrow">↑</span>
                    <span className="down-arrow">↓</span>
                  </span>
                </th>
                <th onClick={() => handleHeaderClick('quantity')}>
                  Quantity
                  <span className={getSortIndicatorClass('quantity')}>
                    <span className="up-arrow">↑</span>
                    <span className="down-arrow">↓</span>
                  </span>
                </th>
                <th onClick={() => handleHeaderClick('consignorName')}>
                  Consignor
                  <span className={getSortIndicatorClass('consignorName')}>
                    <span className="up-arrow">↑</span>
                    <span className="down-arrow">↓</span>
                  </span>
                </th>
                <th onClick={() => handleHeaderClick('status')}>
                  Status
                  <span className={getSortIndicatorClass('status')}>
                    <span className="up-arrow">↑</span>
                    <span className="down-arrow">↓</span>
                  </span>
                </th>
                <th onClick={() => handleHeaderClick('dateAdded')}>
                  Date Added
                  <span className={getSortIndicatorClass('dateAdded')}>
                    <span className="up-arrow">↑</span>
                    <span className="down-arrow">↓</span>
                  </span>
                </th>
                <th>Image</th>
            </tr>
            </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} onClick={() => handleItemClick(item)}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.consignorName}</td>
                <td>{item.status}</td>
                <td>{new Date(item.dateAdded).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="item-thumbnail"
                    />
                  ) : (
                    <span className="no-image">No image</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default Inventory;