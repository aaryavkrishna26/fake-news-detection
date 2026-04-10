import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <div className="product-image-container">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span>📦</span>
          </div>
        )}
        {product.discount && (
          <div className="product-discount">{product.discount}% Off</div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-seller">
          By {product.sellerName || 'Local Seller'}
        </div>

        {product.rating && (
          <div className="product-rating">
            <span className="stars">⭐ {product.rating}</span>
            {product.reviews && (
              <span className="review-count">({product.reviews})</span>
            )}
          </div>
        )}

        {product.quantity && (
          <div className="product-quantity">
            {product.quantity} units available
          </div>
        )}
      </div>

      {/* Product Footer */}
      <div className="product-footer">
        <div className="product-prices">
          <div className="product-price">₹{product.price}</div>
          {product.originalPrice && (
            <div className="product-original-price">
              ₹{product.originalPrice}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="product-actions">
          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-small product-btn"
            title="Add to Cart"
          >
            🛒 Cart
          </button>
          <button
            onClick={handleViewDetails}
            className="btn btn-outline btn-small product-btn"
            title="View Details"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
