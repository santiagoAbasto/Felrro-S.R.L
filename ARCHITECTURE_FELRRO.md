
# Felrro S.R.L – System Architecture

This document describes the **technical architecture of the Felrro project**, including backend structure, frontend architecture, database design philosophy, CMS system, and infrastructure decisions.

This file is intended for **developers, maintainers, and contributors** who need to understand how the system is structured.

---

# Project Overview

Felrro is a **corporate industrial website with a dynamic CMS**, designed to manage:

- Product catalog (industrial cables)
- Corporate pages
- News/blog
- Certificates and downloads
- Clients and sectors
- HR job applications
- Contact forms
- Product quotations

The architecture is designed to be **modular, scalable, and enterprise‑ready**.

---

# Technology Stack

Backend

- Laravel 12
- PHP 8+
- MySQL
- Eloquent ORM

Frontend

Public Website:
- Blade Templates
- Custom CSS
- JavaScript (minimal)

Admin Panel:
- Inertia.js
- React
- Tailwind CSS

Storage

- Laravel Storage System
- storage/app/public
- public/storage symlink

Multilingual System

- JSON fields in database
- Structure: { "es": "...", "en": "..." }
- Helpers for fallback language

---

# Application Architecture

Felrro follows a **hybrid architecture**:

Public website:
```
Laravel Blade
Controllers
Models
Database
```

Admin panel:
```
Laravel Controllers
Inertia.js
React Components
Tailwind UI
Database
```

This separation allows:

- Fast server‑side rendering for SEO
- Modern SPA‑like admin panel
- Clean separation of concerns

---

# CMS Architecture

The CMS uses a **Page + PageSection architecture**.

```
pages
   │
   └── page_sections
          │
          └── page_section_images
```

### pages

Represents a page of the website.

Examples:

```
home
nosotros
contacto
calidad
``

### page_sections

Reusable content blocks used by each page.

Examples:

```
hero
about_main
about_metrics
contact_banner
contact_map
``

### page_section_images

Media elements used inside sections.

Examples:

- hero slider images
- multimedia sections

This architecture allows **flexible CMS editing without code changes**.

---

# Product Catalog Architecture

Products are modeled using a **normalized relational structure**.

```
product_categories
        │
        └── products
              │
              ├── product_images
              ├── product_specifications
              └── product_applications
```

Advantages:

- Clean separation of product data
- Scalable catalog
- Flexible specifications
- Multiple images
- Structured applications

---

# Multilingual System

Felrro implements a **database‑driven multilingual system**.

Fields that support multiple languages use JSON.

Example:

```
name = {
  "es": "Cable Armado",
  "en": "Armored Cable"
}
```

Benefits:

- No external translation service
- CMS editable translations
- Easy fallback logic

Example helper:

```
getName()
getTitle()
getContent()
```

Fallback strategy:

```
requested language → fallback to Spanish
```

---

# Storage Architecture

All uploaded files use Laravel storage.

Structure:

```
storage/app/public/

products/
clients/
certificates/
downloads/
pages/
videos/
jobs/
```

Files are accessed via:

```
public/storage/
```

Using:

```
php artisan storage:link
```

Advantages:

- Compatible with cloud storage
- Safe file management
- Avoids orphan files

---

# Admin Panel Architecture

Admin routes are protected and separated from the public site.

Example route structure:

```
/admin/dashboard
/admin/products
/admin/categories
/admin/certificates
/admin/clients
/admin/posts
/admin/contact
/admin/quotations
/admin/hr
```

Admin uses:

- Inertia.js
- React components
- Tailwind UI

Advantages:

- SPA-like navigation
- Laravel controllers remain backend logic
- No API duplication

---

# Public Website Architecture

Public routes are optimized for SEO.

Example:

```
/
/productos
/producto/{slug}
/sectores
/calidad
/novedades
/contacto
/rrhh
```

Rendered using Blade templates.

Advantages:

- SEO friendly
- Fast initial render
- No JS dependency

---

# Database Design Philosophy

The database design follows:

- Normalized relationships
- SoftDeletes where needed
- Indexed ordering fields
- Foreign key constraints
- JSON multilingual content

Example best practices:

- slug unique indexes
- order fields for UI control
- featured flags
- cascade deletes

---

# Key Modules

Felrro contains several functional modules:

### CMS

Manages dynamic website content.

Tables:

- pages
- page_sections
- page_section_images

---

### Product Catalog

Manages industrial cable products.

Tables:

- products
- product_categories
- product_images
- product_specifications
- product_applications

---

### Corporate Modules

Company information.

Tables:

- sectors
- clients
- certificates
- downloads
- videos

---

### Blog / News

Corporate blog posts.

Table:

- posts

---

### Commercial

Customer quotation system.

Tables:

- quotations
- quotation_items

---

### HR

Job applications.

Tables:

- job_applications
- job_positions
- job_sectors

---

### Contact

Customer messages.

Table:

- contact_messages

---

# Deployment Considerations

Recommended production setup:

- Nginx
- PHP-FPM
- MySQL
- Redis (optional)
- Queue workers

Example commands:

```
php artisan migrate
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

# Conclusion

Felrro is structured as a **modular enterprise-ready Laravel application**.

Key strengths:

- Clean CMS architecture
- Structured product catalog
- Multilingual content system
- Modern admin interface
- SEO-friendly public frontend
- Scalable database design

The system is designed to support **corporate growth and future integrations**.
