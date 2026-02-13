# RetailIQ Zustand Stores

This directory contains all the state management stores for the RetailIQ application using Zustand 5.

## Store Files

### 1. authStore.ts
**Purpose**: Manages user authentication and profile data

**State**:
- `user`: Current user object (User | null)
- `isAuthenticated`: Authentication status (boolean)
- `isLoading`: Loading state for auth operations (boolean)
- `error`: Error message (string | null)
- `token`: Authentication token (string | null)

**Actions**:
- `login(email, password)`: Mock login that accepts any credentials
- `loginWithGoogle()`: Google OAuth login
- `loginWithFacebook()`: Facebook OAuth login
- `register(name, email, password)`: User registration
- `logout()`: Clear auth state and log out
- `updateProfile(data)`: Update user profile
- `clearError()`: Clear error messages

**Features**:
- Mock authentication (accepts any email/password)
- Creates mock user with subscription tier 'free'
- Persists to localStorage with key `retailiq-auth`
- Auto-generates user avatars using ui-avatars.com

---

### 2. productStore.ts
**Purpose**: Manages product catalog, filtering, and watchlist

**State**:
- `products`: All products (Product[])
- `watchlist`: User's watched products (Product[])
- `trending`: Trending products (Product[])
- `searchQuery`: Current search term (string)
- `filters`: Active filters (category, platform, priceRange, rating)
- `isLoading`: Loading state (boolean)
- `selectedProduct`: Currently selected product (Product | null)

**Actions**:
- `fetchProducts()`: Load products from sample data
- `searchProducts(query)`: Update search query
- `addToWatchlist(product)`: Add product to watchlist
- `removeFromWatchlist(id)`: Remove from watchlist
- `setFilters(filters)`: Apply product filters
- `clearFilters()`: Reset all filters
- `selectProduct(product)`: Select a product for detail view
- `getFilteredProducts()`: Get filtered product list

**Features**:
- Imports initial data from `../data/sampleData`
- Auto-generates trending products (top rated)
- Advanced filtering by category, platform, price, rating
- Full-text search across name, description, brand

---

### 3. notificationStore.ts
**Purpose**: Manages notifications and user notification preferences

**State**:
- `notifications`: All notifications (Notification[])
- `unreadCount`: Number of unread notifications (number)
- `preferences`: Notification preferences (NotificationPreferences)
- `isPermissionGranted`: Browser notification permission (boolean)

**Actions**:
- `addNotification(notif)`: Add new notification
- `markAsRead(id)`: Mark notification as read
- `markAllAsRead()`: Mark all as read
- `deleteNotification(id)`: Delete a notification
- `updatePreferences(prefs)`: Update notification settings
- `requestPermission()`: Request browser notification permission
- `clearAll()`: Clear all notifications

**Features**:
- Generates 6 mock notifications on init
- Persists to localStorage with key `retailiq-notifications`
- Browser notification support (when permission granted)
- Notification types: price_drop, stock, deal, system

---

### 4. appStore.ts
**Purpose**: General application state and UI preferences

**State**:
- `viewMode`: Consumer or MSME mode ('consumer' | 'msme')
- `sidebarOpen`: Sidebar visibility (boolean)
- `language`: App language ('en' | 'hi')
- `theme`: Color theme ('light' | 'dark' | 'system')
- `isOnline`: Network connectivity status (boolean)
- `installPromptEvent`: PWA install prompt event (any)

**Actions**:
- `setViewMode(mode)`: Switch between consumer/MSME views
- `toggleSidebar()`: Toggle sidebar visibility
- `setSidebarOpen(open)`: Set sidebar state
- `setLanguage(lang)`: Change app language
- `setTheme(theme)`: Change color theme
- `setOnline(status)`: Update online status
- `setInstallPrompt(event)`: Store PWA install prompt

**Features**:
- Persists to localStorage with key `retailiq-app`
- Auto-detects system theme preference
- Listens to online/offline events
- PWA install prompt handling
- Updates document.documentElement for theme

---

### 5. subscriptionStore.ts
**Purpose**: Manages subscriptions, payments, and transaction history

**State**:
- `currentPlan`: User's current subscription (SubscriptionPlan)
- `plans`: All available plans (SubscriptionPlan[])
- `transactions`: Payment history (Transaction[])
- `paymentMethods`: Saved payment methods (PaymentMethod[])
- `isProcessing`: Payment processing state (boolean)

**Actions**:
- `selectPlan(plan)`: Upgrade/change subscription plan
- `processPayment(method)`: Process a payment
- `addPaymentMethod(method)`: Add new payment method
- `removePaymentMethod(id)`: Remove payment method
- `getTransactionHistory()`: Get transaction list
- `cancelSubscription()`: Cancel and downgrade to free

**Subscription Tiers**:
1. **Free** (₹0/mo): 10 products, 30 days history, basic alerts
2. **Basic** (₹999/mo): 50 products, 90 days history, no ads
3. **Pro** (₹2999/mo): Unlimited products, 1 year history, API access
4. **Enterprise** (₹9999/mo): Everything + multi-user, custom integrations

**Features**:
- Persists to localStorage with key `retailiq-subscription`
- Mock payment processing with delays
- Indian market pricing (INR)
- Detailed feature limits per tier
- Transaction history tracking

---

### 6. index.ts
**Purpose**: Barrel export file for convenient imports

**Exports**:
- All store hooks (useAuthStore, useProductStore, etc.)
- Re-exported types for convenience

**Usage**:
```typescript
import { useAuthStore, useProductStore, useNotificationStore } from './stores';
```

---

## Usage Examples

### Authentication
```typescript
import { useAuthStore } from './stores';

function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  
  const handleLogin = async () => {
    await login('user@example.com', 'password123');
  };
}
```

### Products & Watchlist
```typescript
import { useProductStore } from './stores';

function ProductList() {
  const { products, searchQuery, searchProducts, addToWatchlist } = useProductStore();
  const filteredProducts = useProductStore(state => state.getFilteredProducts());
}
```

### Notifications
```typescript
import { useNotificationStore } from './stores';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
}
```

### Theme & Settings
```typescript
import { useAppStore } from './stores';

function ThemeToggle() {
  const { theme, setTheme } = useAppStore();
}
```

### Subscriptions
```typescript
import { useSubscriptionStore } from './stores';

function PricingPage() {
  const { currentPlan, plans, selectPlan } = useSubscriptionStore();
}
```

---

## Features Summary

### Persistence
- authStore: ✅ (user, token, isAuthenticated)
- productStore: ❌ (loads from sampleData)
- notificationStore: ✅ (notifications, preferences)
- appStore: ✅ (viewMode, language, theme, sidebarOpen)
- subscriptionStore: ✅ (currentPlan, transactions, paymentMethods)

### Mock Data
- authStore: Mock login with auto-generated users
- productStore: Imports from `../data/sampleData`
- notificationStore: 6 pre-generated notifications
- subscriptionStore: 4 subscription tiers, 3 mock transactions

### Real-time Features
- appStore: Online/offline detection, PWA install prompt
- notificationStore: Browser notifications (when permitted)
- appStore: System theme detection

---

## Dependencies

All stores use:
- `zustand` (v5): State management
- `zustand/middleware`: Persist middleware
- Types from `../types/index`

Make sure these are installed:
```bash
npm install zustand
```

---

## Notes

1. **Mock Authentication**: The authStore accepts any email/password combination for development
2. **Sample Data**: productStore imports products from `../data/sampleData`
3. **Indian Market**: All pricing and examples use INR currency
4. **Type Safety**: Full TypeScript support with imported types
5. **Performance**: Uses Zustand's built-in optimization (no unnecessary re-renders)

---

## File Structure
```
stores/
├── authStore.ts           # Authentication & user management
├── productStore.ts        # Product catalog & filtering
├── notificationStore.ts   # Notifications & preferences
├── appStore.ts           # App settings & UI state
├── subscriptionStore.ts  # Subscriptions & payments
├── index.ts              # Barrel exports
└── README.md             # This file
```
