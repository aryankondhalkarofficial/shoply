# Shoply Premium

# Build Shoply — Premium Tech Accessories E-commerce Frontend

Create a complete modern e-commerce frontend for a project called **Shoply**.

This is a portfolio project, so the goal is to make it look like a real premium e-commerce application with polished UI, animations, proper architecture, and complete user flows.

Do not create a fake backend. Connect everything to the existing backend APIs described below.

---

# Tech Stack

You can choose the frontend stack, but prioritize:

* Modern React architecture
* TypeScript preferred
* Responsive design
* Clean component structure
* Maintainable code
* Reusable components
* Proper state management
* API service layer

Use any libraries you think are appropriate.

---

# Backend Information

Backend:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* HTTP-only cookies
* Auth middleware protection

All protected requests require cookies to be sent.

Important:

Every API request must include:

```javascript
credentials: "include"
```

because authentication uses HTTP-only cookies.

---

# Authentication Flow

The backend authentication works like this:

## Register

Endpoint:

```
POST /api/users/register
```

Body:

```json
{
  "name": "Test User",
  "email": "test@shoply.com",
  "password": "Test1234",
  "address": "Address",
  "city": "City",
  "postalCode": "Postal Code",
  "state": "State",
  "country": "Country"
}
```

---

## Login

Endpoint:

```
POST /api/users/login
```

Body:

```json
{
  "email": "test@shoply.com",
  "password": "Test1234"
}
```

The backend creates an HTTP-only JWT cookie.

Do not store JWT tokens in localStorage.

---

## Current User

Endpoint:

```
GET /api/users/me
```

Use this as the source of truth for authentication state.

On app load:

1. Check current user
2. If authenticated:

   * show application content
3. If not authenticated:

   * show public landing pages

---

# Route Protection

Implement protected routes.

Public users should see:

```
/
Landing page
/products
Product browsing
/login
/register
```

Authenticated users can access:

```
/cart
/checkout
/orders
/profile
```

If a user tries to access protected routes without authentication:

Redirect to login.

If an already logged-in user visits login/register:

Redirect to the application.

---

# Product APIs

## Get Products

Endpoint:

```
GET /api/products
```

Supports:

Pagination:

```
?page=1&limit=6
```

Filters:

```
?category=Audio
```

Search:

```
?search=wireless
```

Price:

```
?minPrice=1000&maxPrice=5000
```

Sorting:

```
?sort=price_asc
?sort=price_desc
?sort=rating
```

Response:

```json
{
  "success": true,
  "products": [],
  "pagination": {
    "totalProducts": 12,
    "currentPage": 1,
    "totalPages": 2,
    "limit": 6
  }
}
```

Implement frontend pagination.

Default:

* 6 products per page
* Pagination controls
* Loading states
* Empty states

---

## Get Single Product

Endpoint:

```
GET /api/products/:id
```

Display:

* Product images
* Name
* Description
* Price
* Category
* Ratings
* Reviews
* Add to cart button

---

# Cart APIs

Cart routes are protected.

## Get Cart

```
GET /api/carts
```

Returns current user's cart.

---

## Create First Cart Item

```
POST /api/carts
```

Body:

```json
{
  "product": "PRODUCT_ID",
  "quantity": 1
}
```

Used when creating the first cart.

---

## Update Cart

```
PATCH /api/carts
```

Body:

```json
{
  "product": "PRODUCT_ID",
  "quantity": 2
}
```

Logic:

* quantity > 0 → update/add item
* quantity = 0 → remove item

---

Cart UI should support:

* Increase quantity
* Decrease quantity
* Remove item
* Show total price
* Dynamic cart badge

---

# Order APIs

Protected routes.

## Create Order

```
POST /api/orders
```

Body contains:

* Items
* Product snapshot information
* Total amount
* Shipping address

---

## Get Orders

```
GET /api/orders
```

Show order history.

---

## Get Single Order

```
GET /api/orders/:id
```

Show order details.

---

# Review APIs

## Get Product Reviews

Public:

```
GET /api/reviews/:productId
```

---

## Create Review

Protected:

```
POST /api/reviews/:productId
```

Body:

```json
{
  "rating": 5,
  "comment": "Great product"
}
```

---

# UI Requirements

Create a premium modern landing page.

Style inspiration:

* Apple
* Linear
* Vercel
* Modern SaaS websites

Requirements:

* Beautiful hero section
* Smooth animations
* Modern cards
* Premium spacing
* High-quality typography
* Responsive design

Use:

* Josefin Sans font globally
* Smooth transitions
* Micro interactions
* Hover effects

---

# Landing Page

Create:

* Hero section
* Featured products
* Benefits section
* Call-to-action sections
* Modern animated sections

If images are required, ask me and I can provide them.

---

# Authentication Pages

Login/Register should include:

* Confirm password field on register
* Password visibility eye icon
* Form validation
* Loading states
* Error handling
* Modern UI

---

# Theme

Add:

* Dark mode
* Light mode
* Theme toggle
* Persist user preference

---

# Footer

Create a complete footer.

Include dummy links:

Example:

* About
* Careers
* Privacy
* Terms
* Contact
* Documentation

These pages are placeholders.

When clicked, show:

"This project is not a real service. This is a placeholder page created for a personal portfolio project."

Do not leave any buttons or links non-functional.

Every button should:

* Perform an actual action
  OR
* Navigate to a placeholder page
  OR
* Show a meaningful message

No dead buttons.

---

# Code Architecture

Create a clean folder structure.

Separate:

* Components
* Pages
* Routes
* API services
* Hooks
* Context/state management
* Utilities
* Types

Use reusable components.

Provide the final folder structure after completion.

---

# Additional Requirements

* Add loading skeletons
* Add error states
* Add empty states
* Make mobile responsive
* Keep UI consistent
* Avoid hardcoded fake data after API integration
* Handle authentication globally
* Handle API errors gracefully
* Make the application production-style

Before finishing:

1. Verify every route works
2. Verify authentication flow
3. Verify cart flow
4. Verify order flow
5. Verify pagination
6. Provide final folder structure
7. Explain setup steps

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/70338d3a-f494-412d-bf9d-03406b42f127).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
