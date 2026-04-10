# BuildMart Cart & Checkout - Quick Start Guide

## User Flow

### 1. **Browse Materials**
- User selects city → category → sees materials list
- Each material displays in vertical card layout:
  - Seller name + checkbox
  - Phone number
  - Material details
  - **Quantity selector with +/- buttons**
  - **"🛒 Add to Cart" button**
  - **"☎️ Call Seller" button**

### 2. **Add to Cart**
- User selects quantity using +/- buttons (default: 1)
- Clicks "🛒 Add to Cart"
- Button changes to "✔ Added" (green)
- Toast message shows "✅ Added to cart!"
- Item added to CartContext state + localStorage

### 3. **Shopping Cart** (`/cart`)
**View Cart:**
- Click 🛒 icon in navbar (shows item count)
- Displays all cart items:
  - Item name, seller, price
  - Quantity controls (+/- buttons)
  - Subtotal per item
  - Remove button

**Cart Summary (Right Sidebar):**
- Subtotal: ₹XXX.XX
- GST (18%):  ₹XXX.XX
- **Total: ₹XXX.XX** (blue, bold)

**Actions:**
- "Proceed to Checkout →" - Go to payment flow
- "Continue Shopping" - Return to materials list

### 4. **Checkout - Step 1: Address** (`/checkout`)

**Form Fields:**
```
Full Name *                    [Text Input]
Mobile Number *               [Tel - 10 digits]
┌─────────────────────────────┐
│ Pincode *     City *         │
│ [6 digits]    [Text]         │
└─────────────────────────────┘
Street Address *              [Textarea]
Landmark (Optional)           [Text]
State *                        [Dropdown]
```

**Progress:**
- Step indicator: ⚫ ─────── ⚫ (Step 1 active, Step 2 inactive)

**Button:** "Save & Continue →"

### 5. **Checkout - Step 2: Payment** (`/checkout`)

**Progress:**
- Step indicator: ⚫ ─────── ⚫ (Both active)

**Select Payment Method:**

**Option 1: 💵 Cash on Delivery (Default)**
- Description: "Pay when your order arrives"
- No additional fields
- Radio button: ◉ Cash on Delivery

**Option 2: 💳 Credit/Debit Card**
- Card Number: [16 digits formatted as XXXX XXXX XXXX XXXX]
- Cardholder Name: [Text]
- Expiry Date: [MM/YY format]
- CVV: [3 digits, password input]
- Appears when selected

**Option 3: 📱 UPI**
- UPI ID: [Format: yourname@upi]
- Example: rahul.sharma@upi
- Appears when selected

**Buttons:**
- "← Back" - Return to address form
- "✓ Place Order" - Submit order

### 6. **Order Confirmation**
After successful order:
1. Cart is cleared
2. User redirected to `/order-success/:orderId`
3. Order confirmation page displays

---

## Error Handling

### **Validation Errors** (Step 1 - Address)
- "Full name is required"
- "Mobile must be 10 digits"
- "Pincode must be 6 digits"
- "Street address is required"
- "City is required"
- "State is required"

### **Validation Errors** (Step 2 - Payment)
- (For Card) "Card number must be 16 digits"
- (For Card) "Cardholder name is required"
- (For Card) "Format: MM/YY"
- (For Card) "CVV must be 3 digits"
- (For UPI) "Invalid UPI ID format"

### **Order Submission Error**
- Server error message displayed in red
- "Failed to place order" (default)
- User remains on Step 2 to retry

---

## Key Features

✅ **Quantity Management**
- +/- buttons for each item
- Update quantity before checkout
- Instant cart total update

✅ **Smart Routing**
- Empty cart → redirect to materials
- No cart items at checkout → redirect to cart
- Unauthenticated users → redirect to login

✅ **Data Persistence**
- Cart saved in localStorage
- Survives page refresh
- Auto-loaded on app start

✅ **Form Auto-fill**
- Address fetched from user profile API
- Pre-populates name, phone, address, city, state

✅ **Responsive Design**
- Mobile: Full-width, optimized spacing
- Tablet: Proper sizing, readable fonts
- Desktop: 2-column layout with sidebar

✅ **Real-time Calculations**
- Subtotal updates instantly
- GST calculated at 18%
- Total updates as cart changes

---

## API Endpoints Used

### Create Order
```
POST /api/orders/create
Authorization: Bearer {token}

Request Body:
{
  "paymentMethod": "cod" | "card" | "upi",
  "cartItems": [
    {
      "material": "material_id",
      "quantity": 5,
      "price": 1500
    }
  ],
  "deliveryAddress": {
    "fullName": "John Doe",
    "mobile": "9876543210",
    "pincode": "110001",
    "street": "123 Main St",
    "landmark": "Near Park",
    "city": "Delhi",
    "state": "Delhi"
  }
}

Response:
{
  "order": {
    "_id": "order_id",
    "status": "pending",
    ...
  }
}
```

### Fetch User Profile
```
GET /api/profile
Authorization: Bearer {token}

Response:
{
  "name": "John Doe",
  "phone": "9876543210",
  "address": "123 Main St",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  ...
}
```

---

## Styling & Constants

### Colors Used
- **Primary Blue**: #0066cc (#1B3A6B from theme)
- **Success Green**: #16a34a
- **Error Red**: #d32f2f
- **Orange**: var(--orange) [#FFA84D]
- **Background**: #f5f5f5 / #fafafa

### Quantities & Pricing
- **GST Rate**: 18% (fixed)
- **Delivery Charge**: Free
- **Max states**: 37 Indian states/territories

---

## Testing Scenarios

### Scenario 1: Successful Order
1. Add item (qty: 2) to cart
2. View cart → Proceed to Checkout
3. Fill address form
4. Select Cash on Delivery
5. Place Order
6. ✅ Redirect to order success page

### Scenario 2: Card Payment
1. Add item to cart
2. Checkout → Fill address
3. Select Card payment
4. Enter: 1234567890123456 / John Doe / 12/25 / 123
5. Place Order
6. ✅ Order submitted successfully

### Scenario 3: UPI Payment
1. Add item to cart
2. Checkout → Fill address
3. Select UPI payment
4. Enter: john.doe@okhdfcbank
5. Place Order
6. ✅ Order submitted successfully

### Scenario 4: Validation Error
1. Start checkout
2. Try to submit with empty name
3. ✅ Error message appears, cannot proceed
4. Fill name, continue
5. ✅ Form submits successfully

---

## States Supported

Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal, Delhi, Jammu & Kashmir, Ladakh, Puducherry, Chandigarh, Andaman & Nicobar, Daman & Diu, Dadra & Nagar Haveli, Lakshadweep

---

✅ **Ready for Use** - Cart and Checkout flow is fully functional!
