# 📘 PRD — Personal Bookshelf Web Application (MERN)

## Project Name

**ShelfWise**
*A minimal personal bookshelf & reading tracker application.*

---

# 1. 📌 Product Overview

ShelfWise is a minimal MERN-stack web application that helps users:

* organize personal books
* categorize books
* track reading progress
* manage borrowed/lent books
* search and filter books easily

The goal is simplicity, clean UI, and fast user experience — not a bloated library management system.

---

# 2. 🎯 Product Goals

## Primary Goals

* Easy personal bookshelf management
* Simple reading progress tracking
* Clean searching & filtering
* Track who borrowed books

## Non-Goals

❌ eCommerce
❌ Multi-user social platform
❌ AI recommendations
❌ Online book reading
❌ Complex analytics

---

# 3. 👤 Target Users

### Primary Users

* Students
* Readers
* Book collectors
* Personal library owners

---

# 4. 🧩 Core Features (MVP)

---

# 📚 4.1 Add & Manage Books

## Description

Users can add books to their personal shelf.

## Fields

* Title
* Author
* Category
* Total Pages
* Cover Image
* Status

## Status Types

* Not Started
* Reading
* Completed

## Actions

* Add book
* Edit book
* Delete book
* View details

---

# 🗂️ 4.2 Category Shelving

## Description

Books are organized using categories/shelves.

## Example Categories

* Islamic
* Technology
* Self Help
* Fiction
* Biography

## Features

* Create category
* Rename category
* Delete category
* Filter by category

---

# 🔍 4.3 Search & Multi Filter

## Search

Search by:

* title
* author

## Filters

* Category
* Reading status
* Progress percentage

## Sorting

* Recently added
* Title A-Z
* Progress

---

# 📖 4.4 Reading Progress Tracker

## Description

Track progress using page numbers only.

## Fields

* Current page
* Total pages

## Logic

Progress % automatically calculated.

Example:

```txt
currentPage / totalPages * 100
```

## UI Ideas

* Progress bar
* Circular progress
* “Page 45 of 200”

---

# 🤝 4.5 Lending Tracker

## Description

Track books given to others.

## Fields

* Borrower name
* Borrow date
* Return date
* Notes

## Features

* Mark as lent
* Mark as returned
* Overdue indicator

---

# 5. 📄 Recommended Pages

Keep pages minimal and professional.

---

# 🏠 5.1 Dashboard Page

## Purpose

Quick overview.

## Components

* Total books
* Currently reading
* Lent books
* Reading progress summary
* Recently added books

---

# 📚 5.2 Books Page (Main Page)

## Purpose

Main bookshelf interface.

## Features

* Grid/List view
* Search bar
* Multi filters
* Sort dropdown
* Book cards

## Book Card

* Cover
* Title
* Author
* Category
* Progress bar

---

# ➕ 5.3 Add/Edit Book Page

## Features

* Form validation
* Cover image upload
* Category selection

---

# 📖 5.4 Book Details Page

## Features

* Full book info
* Reading progress
* Lending status
* Edit/Delete buttons

---

# 🤝 5.5 Lending Tracker Page

## Features

* Lent books list
* Returned books
* Due dates
* Borrower info

---

# ⚙️ 5.6 Categories Page

## Features

* Create category
* View category stats
* Manage shelves

---

# 👤 5.7 Authentication Pages

## Pages

* Login
* Register

---

# 6. 🧱 Recommended Tech Stack (Best for This Project)

---

# 🎨 Frontend

## Recommended

### React + Vite

Why?

* Fast
* Modern
* Cleaner than CRA

---

## Styling

### Tailwind CSS

Why?

* Fast UI building
* Modern dashboard styling
* Great for responsive design

---

## State Management

### Context API

Why?

* Enough for MVP
* Simpler than Redux

---

## API Calls

### Axios

Why?

* Cleaner interceptors
* Easier auth handling

---

## Routing

### React Router DOM

---

# ⚙️ Backend

## Runtime

### Node.js

---

## Framework

### Express.js

Why?

* Perfect for CRUD APIs
* Lightweight

---

# 🗄️ Database

## Recommended

### MongoDB Atlas

Why?

* Flexible schema
* Easy category relations
* Good for MERN

---

## ODM

### Mongoose

---

# 🔐 Authentication

## Recommended

### JWT Authentication

Simple and portfolio-friendly.

---

# ☁️ Image Upload

## Recommended

### Cloudinary

Store book covers.

---

# 🚀 Deployment

## Frontend

* Vercel

## Backend

* Render / Railway

## Database

* MongoDB Atlas

---

# 7. 🧠 Suggested Database Models

---

# User

```js
{
  name,
  email,
  password
}
```

---

# Category

```js
{
  userId,
  name
}
```

---

# Book

```js
{
  userId,
  title,
  author,
  category,
  totalPages,
  currentPage,
  status,
  coverImage,
  isLent,
  borrower
}
```

---

# Lending

```js
{
  bookId,
  borrowerName,
  borrowDate,
  returnDate,
  returned
}
```

---

# 8. 🎨 UI/UX Recommendations

## Theme

Minimal modern bookshelf design.

## UI Style

* Clean cards
* Soft shadows
* Dark mode
* Responsive grid

---

## Dashboard Inspiration

* Notion
* Goodreads
* Minimal SaaS dashboards

---

# 9. 🔥 Recommended MVP Scope

Keep Version 1 SIMPLE.

## MUST INCLUDE

✅ Auth
✅ Add/Edit/Delete Books
✅ Categories
✅ Search
✅ Multi Filter
✅ Reading Progress
✅ Lending Tracker
✅ Responsive UI

---

## AVOID NOW

❌ AI features
❌ Social system
❌ Chat
❌ Reviews
❌ Realtime sockets
❌ Notifications

---

# 10. 📂 Recommended Frontend Structure

```txt
src/
 ├── api/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── context/
 ├── hooks/
 ├── utils/
 └── assets/
```

---

# 11. 📂 Recommended Backend Structure

```txt
server/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── config/
 ├── utils/
 └── validators/
```

---

# 12. 🏆 Portfolio Strength

This project becomes strong because it demonstrates:

* CRUD operations
* Authentication
* File uploads
* Filtering/searching
* Data relationships
* Progress calculations
* Clean UI architecture

Much better than another generic todo app.

---

# 13. 🚀 Future Enhancements (Later)

After MVP:

* Reading goals
* Charts/analytics
* Notes/highlights
* Book wishlist
* Export/import
* PWA support
* Goodreads API integration

---

# 14. 💼 Resume Description

> Built a full-stack MERN personal bookshelf management application featuring categorized shelving, reading progress tracking, lending management, advanced search/filtering, JWT authentication, and responsive dashboard UI.
