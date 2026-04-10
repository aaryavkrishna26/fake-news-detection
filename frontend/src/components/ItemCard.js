import React, { useState } from 'react';
import '../styles/ItemCard.css';

const ItemCard = ({
  item,
  onAddToCart,
  onCallSeller,
  onRemove,
  onToggleSelect,
  isSelected,
  isSellerOwned,
  isInCart,
  userRole,
  token
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity);
      setQuantity(1);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    if (onRemove) {
      onRemove(item._id);
    }
  };

  return (
    <div className={`item-card ${isSelected ? 'selected' : ''}`}>
      {/* Top Section: Seller Name + Checkbox */}
      <div className="seller-header">
        <h3 className="seller-name">{item.shopName}</h3>
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item._id)}
            className="select-checkbox"
            title="Select to compare"
          />
        )}
      </div>

      {/* Phone Number */}
      <p className="seller-contact">📞 {item.seller?.phone || 'N/A'}</p>

      {/* Divider */}
      <div className="card-divider"></div>

      {/* Material Details Section */}
      <div className="details-section">
        <div className="detail-group">
          <label className="detail-label">Material:</label>
          <span className="detail-value">{item.category}</span>
        </div>

        <div className="detail-group">
          <label className="detail-label">Price:</label>
          <span className="detail-value price">₹{item.price}/{item.unit}</span>
        </div>

        <div className="detail-group">
          <label className="detail-label">Quantity:</label>
          <span className="detail-value">{item.quantity} {item.unit}</span>
        </div>

        <div className="detail-group">
          <label className="detail-label">Location:</label>
          <span className="detail-value">
            {item.location?.city || item.location}, {item.location?.state || ''}
          </span>
        </div>

        {item.description && (
          <div className="detail-group">
            <label className="detail-label">Details:</label>
            <span className="detail-value description">{item.description}</span>
          </div>
        )}

        <div className="detail-group">
          <label className="detail-label">Status:</label>
          <span className={`detail-value status ${item.isAvailable ? 'available' : 'unavailable'}`}>
            {item.isAvailable ? '✓ Available' : '✗ Out of Stock'}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="card-divider"></div>

      {/* Actions Section */}
      {isSellerOwned ? (
        // Seller view: Show remove button
        <button
          className="btn-action btn-remove"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          🗑️ Remove
        </button>
      ) : (
        // Buyer view: Show quantity selector, add to cart, and call seller
        <>
          {token && userRole === 'buyer' && item.isAvailable && (
            <>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  readOnly
                  className="qty-input"
                />
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
              <button
                className={`btn-action btn-add-to-cart ${isInCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? '✔ Added' : '🛒 Add to Cart'}
              </button>
            </>
          )}
          <button
            className="btn-action btn-call-seller"
            onClick={() => onCallSeller(item.seller?.phone)}
            disabled={!item.seller?.phone}
          >
            ☎️ Call Seller
          </button>
        </>
      )}

      {isSelected && <div className="selected-badge">✓ Selected</div>}
    </div>
  );
};

export default ItemCard;
