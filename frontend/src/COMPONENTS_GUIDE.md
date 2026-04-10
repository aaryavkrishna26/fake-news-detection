// ═══════════════════════════════════════════════════════════════════
// UI COMPONENTS USAGE GUIDE
// ═══════════════════════════════════════════════════════════════════

/**
 * REUSABLE COMPONENTS DOCUMENTATION
 * BuildMart UI/UX Enhancement
 */

// ──────────────────────────────────────────────────────────────────
// 1. PRODUCT CARD COMPONENT
// ──────────────────────────────────────────────────────────────────

import ProductCard from '../components/ProductCard';

const product = {
  id: 1,
  name: 'Premium Cement Bag',
  category: 'Cement',
  price: 350,
  originalPrice: 400,
  discount: 12,
  rating: 4.5,
  reviews: 128,
  sellerName: 'BuildCare Delhi',
  quantity: 500,
  imageUrl: 'https://example.com/image.jpg', // or null for placeholder
};

<ProductCard 
  product={product}
  onAddToCart={(product) => console.log('Add to cart:', product)}
  onViewDetails={(product) => console.log('View details:', product)}
/>

// ──────────────────────────────────────────────────────────────────
// 2. UI COMPONENTS (Loading, Empty State, Toast, etc.)
// ──────────────────────────────────────────────────────────────────

import {
  LoadingSpinner,
  SkeletonLoader,
  EmptyState,
  Toast,
  ErrorMessage,
  SuccessMessage,
  AlertBox,
  Modal,
} from '../components/UIComponents';

// Loading Spinner
<LoadingSpinner fullScreen={false} message="Loading..." />

// Skeleton Loader
<SkeletonLoader count={6} type="product" />
<SkeletonLoader count={3} type="list" />

// Empty State
<EmptyState 
  icon="📭"
  title="No items found"
  message="Browse materials to add to your cart"
  actionLabel="Browse Materials"
  onAction={() => navigate('/select-location')}
/>

// Toast Notification
const [toast, setToast] = useState(null);

<Toast 
  message="Item added to cart!"
  type="success"
  onClose={() => setToast(null)}
/>

// Error Message
<ErrorMessage 
  message="Failed to load products. Please try again."
  onDismiss={() => setError(null)}
/>

// Success Message
<SuccessMessage 
  message="Order placed successfully!"
  onDismiss={() => setSuccess(null)}
/>

// Alert Box
<AlertBox 
  type="info"
  title="Important"
  message="Delivery might be delayed due to weather"
  icon="ℹ️"
/>

// Modal
const [isModalOpen, setIsModalOpen] = useState(false);

<Modal 
  isOpen={isModalOpen}
  title="Confirm Order"
  onClose={() => setIsModalOpen(false)}
  size="medium"
>
  <p>Are you sure you want to place this order?</p>
  <button onClick={() => setIsModalOpen(false)}>Cancel</button>
</Modal>

// ──────────────────────────────────────────────────────────────────
// 3. FORM FIELDS COMPONENTS
// ──────────────────────────────────────────────────────────────────

import {
  FormField,
  TextAreaField,
  SelectField,
  RadioGroup,
  CheckboxField,
  FormGroup,
  FormActions,
  ValidationMessage,
} from '../components/FormFields';

// Text Input Field
<FormField
  label="Email Address"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  placeholder="your@email.com"
  icon="✉️"
  required
/>

// Text Area
<TextAreaField
  label="Description"
  name="description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  error={errors.description}
  placeholder="Enter description..."
  rows={5}
  required
/>

// Select Dropdown
<SelectField
  label="Category"
  name="category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  error={errors.category}
  placeholder="Choose a category"
  options={[
    { value: 'cement', label: 'Cement' },
    { value: 'sand', label: 'Sand' },
    { value: 'steel', label: 'Steel' },
  ]}
  required
/>

// Radio Group
<RadioGroup
  label="Delivery Type"
  name="deliveryType"
  value={deliveryType}
  onChange={(e) => setDeliveryType(e.target.value)}
  error={errors.deliveryType}
  direction="horizontal"
  options={[
    { value: 'standard', label: 'Standard Delivery' },
    { value: 'express', label: 'Express Delivery' },
  ]}
  required
/>

// Checkbox
<CheckboxField
  name="agreeTerms"
  label="I agree to terms and conditions"
  checked={agreeTerms}
  onChange={(e) => setAgreeTerms(e.target.checked)}
  error={errors.agreeTerms}
  required
/>

// Form Group (Multi-column layout)
<FormGroup columns={2} gap={16}>
  <FormField label="First Name" name="firstName" value={firstName} change={handleChange} />
  <FormField label="Last Name" name="lastName" value={lastName} onChange={handleChange} />
</FormGroup>

// Form Actions
<FormActions align="right">
  <button className="btn btn-outline" type="button">Cancel</button>
  <button className="btn btn-primary" type="submit">Submit</button>
</FormActions>

// Validation Message
<ValidationMessage type="error" message="Please enter a valid email" />
<ValidationMessage type="success" message="Form submitted successfully" />

// ──────────────────────────────────────────────────────────────────
// 4. PERSONAL DASHBOARD
// ──────────────────────────────────────────────────────────────────

import PersonalDashboard from '../pages/PersonalDashboard';

// Add route in App.js:
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <PersonalDashboard />
    </ProtectedRoute>
  } 
/>

// ──────────────────────────────────────────────────────────────────
// 5. COMPLETE FORM EXAMPLE
// ──────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  FormField,
  SelectField,
  CheckboxField,
  FormGroup,
  FormActions,
  ValidationMessage,
} from '../components/FormFields';
import { Toast } from '../components/UIComponents';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    console.log('Submitting:', formData);
    setToast({ message: 'Product added successfully!', type: 'success' });
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
      agreeTerms: false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup columns={2}>
        <FormField
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g., Premium Cement"
          required
        />
        <SelectField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          placeholder="Select category"
          options={[
            { value: 'cement', label: 'Cement' },
            { value: 'sand', label: 'Sand' },
          ]}
          required
        />
      </FormGroup>

      <FormGroup columns={2}>
        <FormField
          label="Price per Unit"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="₹"
          icon="💰"
          required
        />
        <FormField
          label="Quantity Available"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Units"
        />
      </FormGroup>

      <CheckboxField
        name="agreeTerms"
        label="I agree to terms and conditions"
        checked={formData.agreeTerms}
        onChange={handleChange}
        error={errors.agreeTerms}
        required
      />

      <FormActions align="right">
        <button type="reset" className="btn btn-outline">Clear</button>
        <button type="submit" className="btn btn-primary">Add Product</button>
      </FormActions>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
};

export default AddProductForm;

// ──────────────────────────────────────────────────────────────────
// 6. USAGE PATTERNS & BEST PRACTICES
// ──────────────────────────────────────────────────────────────────

/**
 * GRID LAYOUTS
 * Use CSS grid for product listings
 */
<div className="products-grid">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
// Auto-responsive: 2 cols on mobile, 3 on tablet, 4 on desktop

/**
 * LOADING STATES
 * Always show loading while fetching data
 */
{isLoading ? <SkeletonLoader count={6} type="product" /> : (
  <div className="products-grid">
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

/**
 * ERROR HANDLING
 * Display error messages gracefully
 */
{error && (
  <ErrorMessage 
    message={error}
    onDismiss={() => setError(null)}
  />
)}

/**
 * EMPTY STATES
 * Show helpful empty states instead of blank screens
 */
{products.length === 0 ? (
  <EmptyState
    icon="📭"
    title="No products found"
    message="Try adjusting your filters"
    actionLabel="View All Products"
    onAction={handleViewAll}
  />
) : (
  <div className="products-grid">
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

/**
 * FORM VALIDATION
 * Validate on blur, show errors on submit
 */
const handleBlur = (e) => {
  const { name, value } = e.target;
  if (!value) {
    setErrors(prev => ({
      ...prev,
      [name]: `${name} is required`
    }));
  }
};

/**
 * RESPONSIVE FORMS
 * Forms stack on mobile, multi-column on desktop
 */
<FormGroup columns={2}>
  {/* On mobile: 1 column, On tablet/desktop: 2 columns */}
</FormGroup>

// ──────────────────────────────────────────────────────────────────
// 7. COLOR & TYPOGRAPHY SYSTEM
// ──────────────────────────────────────────────────────────────────

/**
 * CSS Variables available:
 * 
 * COLORS:
 * --blue, --blue-dark, --blue-light
 * --orange
 * --green
 * --red
 * --gray-50 to --gray-800
 * --white
 * 
 * SHADOWS:
 * --shadow (small)
 * --shadow-md (medium)
 * --shadow-lg (large)
 * 
 * OTHER:
 * --radius (border radius)
 */

// ──────────────────────────────────────────────────────────────────
// 8. ACCESSIBILITY NOTES
// ──────────────────────────────────────────────────────────────────

/**
 * - All form fields have associated labels
 * - Error messages are linked to inputs
 * - Color is not the only indicator (use icons + text)
 * - Focus states are visible
 * - Proper ARIA attributes where needed
 * - Keyboard navigation supported
 * - Sufficient color contrast
 */
