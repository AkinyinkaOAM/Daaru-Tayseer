# Daaru Tayseer Frontend - Implementation Plan

## Completed
- [x] Removed old backend stubs (configdb.js, models.js)
- [x] Public pages: Home, Programme, Gallery, Contact, Login
- [x] API service with auth interceptor
- [x] AuthContext with role-based checks
- [x] Admin dashboard with protected routes
- [x] Create Student form
- [x] Student list with search & delete
- [x] Score upload per student/term/session
- [x] Admin management (create, delete, change roles)
- [x] Build verified - `vite build` succeeds

## Steps

### 1. Update index.html
- [x] Update title to "Daaru Tayseer | دار تيسير"
- [x] Remove Vite default favicon reference
- [x] Add Arabic lang support + meta description

### 2. Dependencies (already installed)
- [x] axios, bootstrap, react-router-dom, react-hook-form, react-icons

### 3. Core Setup
- [x] Update `src/main.jsx` - Bootstrap CSS import, RouterProvider
- [x] Update `src/App.jsx` - Router setup with all routes
- [x] Update `src/App.css` - Custom app styles
- [x] Update `src/index.css` - Clean base/reset styles

### 4. Services
- [x] Create `src/services/api.js` - Axios instance with base URL

### 5. Context
- [x] Create `src/context/AuthContext.jsx` - Auth state management

### 6. Components
- [x] Create `src/components/Navbar.jsx` - Navigation bar with logo
- [x] Create `src/components/Footer.jsx` - Footer with contact info
- [x] Create `src/components/Layout.jsx` - Layout wrapper (Navbar + Footer + children)

### 7. Pages
- [x] Create `src/pages/Home.jsx` - Landing page with hero, about, features
- [x] Create `src/pages/Programme.jsx` - Academic programmes info
- [x] Create `src/pages/Gallery.jsx` - Cloudinary gallery placeholder
- [x] Create `src/pages/Contact.jsx` - Contact form + info
- [x] Create `src/pages/Login.jsx` - Login page

### 8. Default Assets
- [x] Create `public/favicon.svg` - School logo as favicon
- [x] Remove unused Vite/React default assets

### 9. Final
- [x] Build verified - `vite build` succeeded (94 modules, 3.11s)
- [x] Responsive design (Bootstrap grid + custom breakpoints)
- [x] Cloudinary-ready gallery (backend integration)

