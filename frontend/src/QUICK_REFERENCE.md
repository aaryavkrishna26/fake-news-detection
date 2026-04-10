# BuildMart - Quick Reference Guide

## 🗂️ New Routes Added

| Route | Component | Type | Access |
|-------|-----------|------|--------|
| `/profile` | PersonalDashboard | Protected | Logged-in users |
| `/` | HomePage | Public | All users |

## 📦 Components Cheat Sheet

### ProductCard
**Location**: `src/components/ProductCard.js`
```jsx
import ProductCard from '../components/ProductCard';

<ProductCard 
  product={{id, name, price, category, rating, discount}}
  onAddToCart={(product) => {}}
  onViewDetails={(product) => {}}
/>
```

### UI Components
**Location**: `src/components/UIComponents.js`
```jsx
import { LoadingSpinner, EmptyState, Toast, ErrorMessage, Modal } from '../components/UIComponents';

<LoadingSpinner />
<EmptyState icon="📭" title="No items" />
<Toast message="Success!" type="success" />
<ErrorMessage message="Error occurred" />
<Modal isOpen={true} title="Confirm">Content</Modal>
```

### Form Fields
**Location**: `src/components/FormFields.js`
```jsx
import { FormField, SelectField, RadioGroup, CheckboxField, FormGroup } from '../components/FormFields';

<FormField label="Email" name="email" type="email" required />
<SelectField label="Category" options={[]} />
<RadioGroup label="Type" options={[]} direction="horizontal" />
<CheckboxField label="I agree" />
<FormGroup columns={2}>{children}</FormGroup>
```

## 🎨 CSS Variables

```css
/* Colors */
--blue: #2563EB
--blue-dark: #1e40af
--blue-light: #3b82f6
--orange: #EA580C
--green: #16A34A
--red: #DC2626
--gray-50 to --gray-800

/* Shadows */
--shadow (1px)
--shadow-md (4px)
--shadow-lg (10px)

/* Layout */
--radius: 8px
```

## 🎯 Common Patterns

### Loading State
```jsx
{isLoading ? <SkeletonLoader count={6} /> : <ProductGrid products={products} />}
```

### Error Handling
```jsx
{error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
```

### Empty State
```jsx
{items.length === 0 ? (
  <EmptyState 
    icon="📭" 
    title="No items" 
    actionLabel="Browse"
    onAction={handleBrowse}
  />
) : (
  <ItemList items={items} />
)}
```

### Form Validation
```jsx
const [errors, setErrors] = useState({});
const [formData, setFormData] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    return;
  }
  // Submit
};
```

### Multi-Column Form
```jsx
<FormGroup columns={2} gap={16}>
  <FormField label="First Name" />
  <FormField label="Last Name" />
  <SelectField label="Category" columns={1} />
</FormGroup>
```

## 📱 Responsive Breakpoints

| Device | Breakpoint | Columns |
|--------|-----------|---------|
| Mobile | < 480px | 1-2 |
| Tablet | 480-768px | 2-3 |
| Desktop | > 768px | 3-4+ |

## 🎯 Button Styles

```jsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-outline">Outline</button>
<button className="btn btn-orange">Orange</button>
<button className="btn btn-small">Small</button>
<button className="btn btn-full">Full Width</button>
```

## 📝 Form Field Props

### FormField
- `label` - Field label
- `name` - Input name
- `type` - Input type (text, email, number, etc.)
- `value` - Current value
- `onChange` - Change handler
- `error` - Error message
- `placeholder` - Placeholder text
- `required` - Mark as required
- `icon` - Icon emoji
- `helperText` - Helper message

## 🎬 Toast Messages

```jsx
const [toast, setToast] = useState(null);

// Show toast
setToast({ message: 'Item added!', type: 'success' });

// Close toast
setToast(null);

// Render toast
{toast && <Toast {...toast} onClose={() => setToast(null)} />}
```

## 🎨 Color Usage Guide

| Color | Usage |
|-------|-------|
| Blue | Primary actions, links, highlights |
| Orange | Secondary CTA, warnings, accents |
| Green | Success, positive actions |
| Red | Errors, destructive actions |
| Gray | Text, dividers, backgrounds |

## 📊 Grid Layouts

### Products Grid
```jsx
<div className="products-grid">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```
Auto-responsive: 4 cols desktop → 2 cols mobile

### Benefits Grid
```jsx
<div className="benefits-grid">
  {benefits.map(b => <div key={b.id} className="benefit-card">{b.title}</div>)}
</div>
```

## 🔍 Search Patterns

### Find Component Usage
```bash
grep -r "ProductCard" src/pages/
grep -r "FormField" src/components/
grep -r "Toast\|Modal" src/pages/
```

## 🚀 Performance Tips

1. Use `SkeletonLoader` instead of plain loaders
2. Avoid rendering full product grids on first load
3. Implement image lazy-loading
4. Use React.memo for ProductCard lists
5. Debounce search/filter inputs

## 🐛 Debugging

### Check Build Errors
```bash
npm run build 2>&1 | findstr "error"
```

### Run Development Server
```bash
npm start
```

### Browser Console Tips
- Check for React warnings
- Monitor network requests
- Use React DevTools

## 📚 File Locations Reference

| Component | File |
|-----------|------|
| ProductCard | `src/components/ProductCard.js` |
| ProductCard Styles | `src/styles/ProductCard.css` |
| UI Components | `src/components/UIComponents.js` |
| UI Components Styles | `src/styles/UIComponents.css` |
| Form Fields | `src/components/FormFields.js` |
| Form Fields Styles | `src/styles/FormFields.css` |
| Personal Dashboard | `src/pages/PersonalDashboard.js` |
| Dashboard Styles | `src/styles/PersonalDashboard.css` |
| HomePage | `src/pages/HomePage.jsx` |
| HomePage Styles | `src/styles/HomePage.css` |
| Global Styles | `src/styles/global.css` |

## ✅ Pre-Launch Checklist

- [ ] All components tested in development
- [ ] Build completes without errors
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] All forms validate correctly
- [ ] Error messages display properly
- [ ] Loading states show smoothly
- [ ] Empty states are helpful
- [ ] Accessibility checked (keyboard nav, screen reader)
- [ ] Performance optimized (no console errors)
- [ ] API endpoints ready for integration

## 🎓 Best Practices

1. **Always use FormField for consistency**
   - Don't create custom inputs
   - Reuse existing components

2. **Handle errors gracefully**
   - Show error messages
   - Provide recovery options

3. **Show loading states**
   - Use SkeletonLoader
   - Prevent layout shift

4. **Use proper spacing**
   - Consistent gaps using FormGroup
   - Maintain breathing room

5. **Validate forms**
   - Real-time validation
   - Clear error messages

6. **Mobile-first approach**
   - Test on small screens first
   - Use responsive classes

## 📞 Support Resources

- Component Guide: `src/COMPONENTS_GUIDE.md`
- UI/UX Improvements Doc: `src/UI_UX_IMPROVEMENTS.md`
- Global Styles: `src/styles/global.css`
- Color System: CSS variables in `:root`

---

**Last Updated**: April 10, 2026  
**Version**: 1.0
