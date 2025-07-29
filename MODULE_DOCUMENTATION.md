# TFMshop.com - Module Documentation

## 📚 System Architecture Overview

### Application Structure
```
tfmshop.com/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI primitives
│   ├── Header.tsx        # Main navigation
│   ├── CategoryNav.tsx   # Category navigation
│   ├── ProductCard.tsx   # Product display
│   ├── ProductGrid.tsx   # Product grid layout
│   └── Footer.tsx        # Site footer
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🧩 Module Specifications

### 1. Core Layout Modules

#### 1.1 Header Module (`components/Header.tsx`)
**Purpose:** Main site navigation and user interface  
**Type:** Client Component  
**Dependencies:** Lucide React, Radix UI, Custom UI components

**Features:**
- Logo and branding
- Search functionality with dropdown
- User account management
- Shopping cart display
- Location selection
- Mobile responsive navigation

**Props Interface:**
```typescript
// No props - self-contained component
```

**State Management:**
- `cartCount`: Shopping cart item count (currently hardcoded)

**Key Functions:**
- Search submission handling
- Cart management
- User authentication flow
- Mobile menu toggle

---

#### 1.2 CategoryNav Module (`components/CategoryNav.tsx`)
**Purpose:** Category-based navigation system  
**Type:** Server Component  
**Dependencies:** Custom UI components

**Features:**
- Horizontal scrollable category list
- Responsive design
- Hover effects

**Configuration:**
```typescript
const categories = [
  'Electronics', 'Books', 'Home & Garden', 
  'Sports & Outdoors', 'Fashion', 'Health & Beauty',
  'Toys & Games', 'Automotive', 'Music', 'Movies & TV'
];
```

---

#### 1.3 Footer Module (`components/Footer.tsx`)
**Purpose:** Site footer with links and utilities  
**Type:** Client Component  
**Dependencies:** Custom UI components

**Features:**
- Multi-column link organization
- Language/currency/region selection
- Back to top functionality
- Company information and legal links

**Sections:**
- Get to Know Us
- Make Money with Us
- Payment Products
- Customer Help

---

### 2. Product Display Modules

#### 2.1 ProductCard Module (`components/ProductCard.tsx`)
**Purpose:** Individual product display component  
**Type:** Server Component  
**Dependencies:** Lucide React, Custom UI components

**Props Interface:**
```typescript
interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
}
```

**Features:**
- Product image with hover effects
- Star rating system
- Price display with discounts
- Product badges (Best Seller, etc.)
- Add to cart functionality

**Key Functions:**
- `renderStars(rating: number)`: Generates star rating display

---

#### 2.2 ProductGrid Module (`components/ProductGrid.tsx`)
**Purpose:** Grid layout for displaying multiple products  
**Type:** Server Component  
**Dependencies:** ProductCard component

**Features:**
- Responsive grid layout (1-5 columns based on screen size)
- Sample product data
- Consistent spacing and alignment

**Data Structure:**
```typescript
const products = [
  {
    id: number,
    image: string,
    title: string,
    price: number,
    originalPrice?: number,
    rating: number,
    reviewCount: number,
    badge?: string
  }
]
```

---

### 3. UI Foundation Modules

#### 3.1 Base UI Components (`components/ui/`)
**Purpose:** Foundational UI primitives built on Radix UI  
**Type:** Various (Server/Client based on functionality)

**Components:**
- `button.tsx` - Button variants and styles
- `input.tsx` - Form input fields
- `card.tsx` - Card container components
- `dropdown-menu.tsx` - Dropdown menu functionality
- `badge.tsx` - Status and category badges
- And 30+ other UI primitives

**Styling System:**
- CSS variables for theming
- Class variance authority for component variants
- Tailwind CSS for styling
- Custom animations and transitions

---

### 4. Utility Modules

#### 4.1 Utils Module (`lib/utils.ts`)
**Purpose:** Utility functions for styling and class management  
**Dependencies:** clsx, tailwind-merge

**Key Functions:**
```typescript
function cn(...inputs: ClassValue[]): string
// Combines and merges Tailwind CSS classes safely
```

---

#### 4.2 Toast Hook (`hooks/use-toast.ts`)
**Purpose:** Toast notification system  
**Type:** Custom React hook

**Features:**
- Toast state management
- Multiple toast types
- Auto-dismiss functionality
- Positioning and animations

---

### 5. Configuration Modules

#### 5.1 Tailwind Config (`tailwind.config.ts`)
**Purpose:** Tailwind CSS configuration and theming  
**Features:**
- Custom color scheme with CSS variables
- Dark mode support
- Custom animations
- Component-specific styling

**Key Configurations:**
- Color system with HSL values
- Border radius variables
- Animation keyframes
- Plugin integrations

---

#### 5.2 Components Config (`components.json`)
**Purpose:** Shadcn/ui component configuration  
**Settings:**
- TypeScript support
- Tailwind CSS integration
- Component aliases and paths
- Style preferences

---

### 6. Page Modules

#### 6.1 Home Page (`app/page.tsx`)
**Purpose:** Main landing page  
**Type:** Server Component
**Dependencies:** All major components

**Layout Structure:**
1. Header navigation
2. Category navigation
3. Hero banner section
4. Featured products section
5. Site footer

**Content Sections:**
- Welcome banner with gradient background
- Featured products grid
- Responsive design elements

---

#### 6.2 Root Layout (`app/layout.tsx`)
**Purpose:** Application shell and global configuration  
**Type:** Root Layout Component

**Features:**
- HTML document structure
- Global CSS imports
- Metadata configuration
- Font optimization

---

## 🔄 Data Flow & State Management

### Current State Management
- **Local Component State:** Using React useState for cart counts, UI states
- **Props Drilling:** Data passed down through component hierarchy
- **Static Data:** Product information currently hardcoded

### Planned State Management
- **Global State:** Context API or Zustand for cart management
- **Server State:** React Query for API data fetching
- **Form State:** React Hook Form for user inputs

## 🔌 Integration Points

### External Dependencies
- **Radix UI:** Accessible component primitives
- **Lucide React:** Icon library
- **Tailwind CSS:** Utility-first CSS framework
- **Next.js:** React framework with SSR/SSG
- **TypeScript:** Type safety and development experience

### Future Integrations
- **Authentication:** NextAuth.js or Auth0
- **Database:** PostgreSQL with Prisma ORM
- **Payment:** Stripe or PayPal integration
- **Analytics:** Google Analytics or Mixpanel
- **Search:** Algolia or Elasticsearch

## 📋 Module Development Guidelines

### Component Structure
```typescript
// 1. Imports
import React from 'react';
import { ComponentProps } from './types';

// 2. Type definitions
interface Props {
  // Define props
}

// 3. Component implementation
const Component: React.FC<Props> = ({ ...props }) => {
  // Component logic
  return (
    // JSX structure
  );
};

// 4. Export
export default Component;
```

### Naming Conventions
- **Components:** PascalCase (e.g., `ProductCard`)
- **Files:** PascalCase for components, camelCase for utilities
- **Props:** camelCase
- **CSS Classes:** Tailwind utility classes

### Code Quality Standards
- TypeScript for all new code
- ESLint and Prettier for formatting
- Component documentation with JSDoc
- Unit tests for utility functions
- Integration tests for critical user flows

---

**Last Updated:** July 28, 2025  
**Module Version:** 1.0  
**Architecture Review Date:** TBD
