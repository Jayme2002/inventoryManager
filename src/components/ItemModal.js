import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function ItemModal({ item, onClose, onSave, onDelete, onStatusChange }) {
  const [editedItem, setEditedItem] = useState(item);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showLargeImage, setShowLargeImage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedItem);
  };

  const handleStatusChange = (newStatus) => {
    setEditedItem({ ...editedItem, status: newStatus });
    onStatusChange(item.id, newStatus);
  };

  if (showDeleteConfirm) {
    return (
      <div className="modal-overlay">
        <div className="modal-content delete-confirm">
          <h2>Delete Item</h2>
          <p>Are you sure you want to delete this item?</p>
          <p className="item-details">
            {item.name} (SKU: {item.sku})
          </p>
          <div className="delete-actions">
            <button 
              type="button" 
              onClick={() => onDelete(item.id)}
              className="confirm-delete"
            >
              Yes, Delete Item
            </button>
            <button 
              type="button" 
              onClick={() => setShowDeleteConfirm(false)}
              className="cancel-delete"
            >
              No, Keep Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showQRCode) {
    return (
      <div className="modal-overlay">
        <div className="modal-content qr-modal">
          <h2>QR Code for {item.name}</h2>
          <div className="qr-container">
            <QRCodeSVG 
              value={`${window.location.origin}/item/${item.id}`}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="item-details">SKU: {item.sku}</p>
          <div className="modal-actions">
            <button onClick={() => setShowQRCode(false)} className="cancel-button">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showLargeImage && item.imageUrl) {
    return (
      <div className="modal-overlay" onClick={() => setShowLargeImage(false)}>
        <div className="modal-content large-image-modal" onClick={e => e.stopPropagation()}>
          <img src={item.imageUrl} alt={item.name} className="large-item-image" />
          <button onClick={() => setShowLargeImage(false)} className="close-button">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Item</h2>
        {item.imageUrl && (
          <div className="item-image-preview" onClick={() => setShowLargeImage(true)}>
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="item-preview-image"
            />
            <span className="view-larger">Click to enlarge</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
              className={editedItem.status === 'available' ? 'active' : ''}
            >
              Available
            </button>
            <button 
              type="button" 
              onClick={() => handleStatusChange('on hold')}
              className={editedItem.status === 'on hold' ? 'active' : ''}
            >
              On Hold
            </button>
            <button 
              type="button" 
              onClick={() => handleStatusChange('sold')}
              className={editedItem.status === 'sold' ? 'active' : ''}
            >
              Sold
            </button>
          </div>

          <div className="modal-actions">
            {!showDeleteConfirm ? (
              <>
                <button type="submit" className="save-button">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => setShowQRCode(true)} 
                  className="qr-button"
                >
                  Show QR Code
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="delete-button"
                >
                  Delete Item
                </button>
                <button type="button" onClick={onClose} className="cancel-button">
                  Cancel
                </button>
              </>
            ) : (
              <div className="delete-confirmation">
                <p>Are you sure you want to delete this item?</p>
                <div className="confirm-actions">
                  <button 
                    type="button" 
                    onClick={() => onDelete(item.id)} 
                    className="confirm-delete"
                  >
                    Yes, Delete
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteConfirm(false)} 
                    className="cancel-delete"
                  >
                    No, Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemModal;