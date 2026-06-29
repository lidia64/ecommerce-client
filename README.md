# Modern Market

Modern Market is a responsive e-commerce web client built with React, Vite, Tailwind CSS, Axios, TanStack Query, and Zustand. It provides a marketplace-style shopping experience with category browsing, product search, product details, cart persistence, checkout, and order history.

## Description

The app connects to the Platzi Fake Store API for demo product and category data. Server data is managed with TanStack Query, cart data is stored locally with Zustand, and React Router handles all page navigation. The interface is styled with Tailwind CSS and follows a modern marketplace layout with a product-first home page, category navigation, and reusable UI components.

## Folder Structure

```text
modern-market/
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── dist/
│   └── production build output
├── node_modules/
│   └── installed dependencies
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── Feedback.jsx
    │   ├── Navbar.jsx
    │   ├── ProductCard.jsx
    │   └── Skeletons.jsx
    ├── features/
    │   ├── cart/
    │   │   └── cartStore.js
    │   ├── orders/
    │   │   └── orderQueries.js
    │   └── products/
    │       └── productQueries.js
    ├── hooks/
    │   └── useDebounce.js
    ├── lib/
    │   ├── apiClient.js
    │   └── queryClient.js
    └── pages/
        ├── CartPage.jsx
        ├── CheckoutPage.jsx
        ├── HomePage.jsx
        ├── NotFoundPage.jsx
        ├── OrderConfirmationPage.jsx
        ├── OrderDetailPage.jsx
        ├── OrdersPage.jsx
        ├── ProductDetailPage.jsx
        └── ProductsPage.jsx
```

## Key Features

- Marketplace-style home page with hero section, categories, quick links, and featured products.
- Product catalog with debounced search, category filtering, and pagination.
- Product detail page with image gallery and add-to-cart action.
- Cart management with add, remove, quantity update, subtotal, and localStorage persistence.
- Checkout form with client-side validation.
- Order confirmation, order history, and order detail pages.
- Reusable loading skeletons, empty states, and error messages.
- Responsive layout for mobile, tablet, and desktop screens.

## Tech Stack

| Area | Tool |
| --- | --- |
| UI | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| API client | Axios |
| Server state | TanStack Query |
| Client state | Zustand |
| Build tool | Vite |

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## API

Modern Market currently uses the Platzi Fake Store API:

```text
https://api.escuelajs.co/api/v1
```

The Axios instance lives in `src/lib/apiClient.js`. Product API hooks are in `src/features/products/productQueries.js`, and order API hooks are in `src/features/orders/orderQueries.js`.
