import React from 'react';
import '../styles/UIComponents.css';

/* ═══════════════════════════════════════════════════════════════════
   LOADING SPINNER COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  return (
    <div className={`loading-spinner ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SKELETON LOADER COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const SkeletonLoader = ({ count = 4, type = 'product' }) => {
  const items = Array.from({ length: count });

  if (type === 'product') {
    return (
      <div className="products-grid">
        {items.map((_, i) => (
          <div key={i} className="skeleton-product">
            <div className="skeleton skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton skeleton-text skeleton-title"></div>
              <div className="skeleton skeleton-text skeleton-text-short"></div>
              <div className="skeleton skeleton-text skeleton-text-short"></div>
              <div className="skeleton-buttons">
                <div className="skeleton skeleton-button"></div>
                <div className="skeleton skeleton-button"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="skeleton-list">
        {items.map((_, i) => (
          <div key={i} className="skeleton-item">
            <div className="skeleton skeleton-text skeleton-title"></div>
            <div className="skeleton skeleton-text skeleton-text-short"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const EmptyState = ({
  icon = '📭',
  title = 'No items found',
  message = 'There are no items to display',
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   TOAST NOTIFICATION COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const Toast = ({ message, type = 'info', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => onClose && onClose()}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ERROR MESSAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <div className="error-content">
        <p className="error-text">{message}</p>
      </div>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SUCCESS MESSAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const SuccessMessage = ({ message, onDismiss }) => {
  return (
    <div className="success-message">
      <span className="success-icon">✅</span>
      <p className="success-text">{message}</p>
      {onDismiss && (
        <button className="success-dismiss" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ALERT BOX COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const AlertBox = ({ type = 'info', title, message, icon }) => {
  return (
    <div className={`alert alert-${type}`}>
      {icon && <span className="alert-icon">{icon}</span>}
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        {message && <p className="alert-message">{message}</p>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MODAL COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export const Modal = ({ isOpen, title, children, onClose, size = 'medium' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal-${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};
