import { useState } from 'react';

function AddItemModal({ onClose, onSave }) {
  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    price: '',
    quantity: 1,
    description: '',
    consignorName: '',
    dateAdded: new Date(),
    status: 'available'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newItem);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              type="text"
              placeholder="SKU"
              value={newItem.sku}
              onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Consignor Name"
              value={newItem.consignorName}
              onChange={(e) => setNewItem({...newItem, consignorName: e.target.value})}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="save-button">Add Item</button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;