import { QRCodeSVG } from 'qrcode.react';

function QRCodeModal({ item, onClose }) {
  const itemUrl = `${window.location.origin}/item/${item.id}`;

  return (
    <div className="modal-overlay">
      <div className="modal-content qr-modal">
        <h2>QR Code for {item.name}</h2>
        <div className="qr-container">
          <QRCodeSVG 
            value={itemUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="item-details">SKU: {item.sku}</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
}