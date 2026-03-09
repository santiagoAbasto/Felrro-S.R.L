
# Felrro — Corporate Website & CMS Platform

Enterprise corporate website and dynamic CMS built for **Felrro S.R.L.**, a company specialized in the manufacturing of special electrical conductors.

The platform was developed using a **modern Laravel architecture** with a fully administrable CMS, multilingual content management, and pixel‑perfect frontend implementation based on Figma designs.

This repository contains both:

- The **public corporate website**
- The **administration panel (CMS)**

The system allows administrators to manage all corporate content without modifying the codebase.

---

# Project Overview

Felrro is a **corporate content management platform** designed to provide:

- Product catalog management
- Industrial sector presentation
- Corporate blog/news system
- Certification and quality documentation
- Human resources recruitment module
- Client showcase
- Contact system with message storage
- Downloadable technical documentation

All sections are editable through a **React-based admin panel**.

The frontend public website is built using **Blade templates optimized for performance, SEO and maintainability**.

---

# Architecture

The project follows a **hybrid architecture** separating public content from administrative operations.

Laravel 12

│

├ Public Website

│ └ Blade templates

│

├ Admin Panel

│ └ Inertia.js + React

│

├ Database

│ └ MySQL

│

└ File Storage

└ storage/app/public

---

## Frontend (Public Website)

Technologies:

- Blade
- Vanilla JavaScript (minimal usage)
- Custom CSS
- Responsive layout
- SEO optimized markup

---

## Admin Panel

Technologies:

- React
- Inertia.js
- Ziggy for Laravel route usage in React
- FormData uploads
- Modular CMS forms

The admin panel allows administrators to manage all website sections.

---

# Technology Stack

## Backend

- Laravel 12
- PHP 8+
- Eloquent ORM
- Laravel Storage
- Database Transactions
- SoftDeletes

## Frontend

Public website:

- Blade
- Custom CSS
- Responsive design

Admin panel:

- React
- Inertia.js
- Ziggy

## Database

- MySQL

## File Management

All uploaded files are stored using Laravel Storage:

storage/app/public

Public access is provided through:

php artisan storage:link

---

# Multilingual System

The CMS implements a **JSON‑based multilingual architecture**.

Editable content fields follow this structure:

{
  "es": "Texto en español",
  "en": "English text"
}

Language resolution uses:

- session locale
- automatic fallback to Spanish

Model helpers simplify usage:

$product->getName()

$product->getDescription()

$pageSection->getTitle()

This architecture avoids external translation services and ensures full CMS control.

---

# CMS Architecture

The CMS is built using a **Page + PageSection architecture**.

This allows pages to be dynamically composed from multiple content blocks.

Example:

Page: Home

Sections:

- hero
- about_preview
- featured_products

Example structure:

Page

└ PageSection

├ hero

├ about_preview

├ contact_banner

└ contact_info

This modular design allows flexible page composition and easier future expansion.

---

# Modules

## Hero CMS

Dynamic homepage hero slider.

Features:

- multiple images
- multilingual titles
- optional button
- configurable order
- activation toggle

---

## About Page

Structured into modular sections:

- about_main
- about_metrics
- about_values
- about_video

Supports:

- institutional images
- local video uploads
- YouTube/Vimeo embeds

---

## Products

Industrial product catalog system.

Features:

- product categories
- image gallery
- downloadable technical sheet
- technical specifications
- industrial applications
- automatic slug generation
- featured products
- SoftDeletes

Public routes:

/productos

/producto/{slug}

---

## Sectors

Industrial sectors where products are applied.

Features:

- multilingual descriptions
- sector images
- enterprise ordering system

Public route:

/sectores

---

## Quality

Corporate quality policies and certifications.

Features:

- quality policy content
- certification documents
- downloadable files

Public route:

/calidad

---

## Certificates

Certification document management.

Features:

- multilingual name
- logo image
- downloadable PDF
- enterprise ordering

---

## Blog / News

Corporate news and articles.

Features:

- automatic slug generation
- featured image
- excerpt
- full content
- publish date
- featured posts

Public routes:

/novedades

/novedades/{slug}

---

## Clients

Client logo showcase module.

Features:

- logo upload
- ordering system
- activation toggle

Public route:

/clientes

---

## Human Resources

Job application management system.

Features:

- job positions
- job sectors
- CV upload
- application form

Public route:

/rrhh

---

## Contact System

Contact page with CMS‑managed content.

Features:

- banner section
- company contact information
- Google Maps embed
- message storage in database

Public route:

/contacto

---

# Database Structure

Main tables:

users

pages

page_sections

product_categories

products

product_images

product_specifications

product_applications

sectors

posts

downloads

certificates

clients

job_positions

job_sectors

job_applications

contact_messages

site_settings

quotations

quotation_items

---

# Enterprise Ordering System

Several modules implement an **alphabetical ordering system** similar to Excel columns.

Example:

A

AA

AB

AC

Used in:

- products
- sectors
- certificates

This allows manual ordering without numeric limits.

---

# File Storage Structure

Files are stored in:

storage/app/public

Directory structure:

products/

clients/

posts/

sectors/

pages/

certificates/

downloads/

Access is exposed through:

/storage/

---

# Installation

Clone repository

git clone https://github.com/your-username/felrro.git

Install backend dependencies

composer install

Install frontend dependencies

npm install

Copy environment configuration

cp .env.example .env

Configure database

DB_CONNECTION=mysql

DB_DATABASE=felrro

DB_USERNAME=root

DB_PASSWORD=

Run migrations

php artisan migrate

Create storage symlink

php artisan storage:link

Start frontend build

npm run dev

Run server

php artisan serve

---

# Environment Variables

Important configuration variables:

APP_NAME=Felrro

APP_ENV=local

APP_DEBUG=true

DB_CONNECTION=mysql

DB_DATABASE=felrro

DB_USERNAME=root

DB_PASSWORD=

FILESYSTEM_DISK=public

---

# Routes

## Public

/

/nosotros

/productos

/producto/{slug}

/sectores

/calidad

/novedades

/novedades/{slug}

/clientes

/rrhh

/contacto

---

## Admin

/admin/login

/admin/dashboard

/admin/products

/admin/sectors

/admin/posts

/admin/certificates

/admin/clients

/admin/hr

/admin/contact

---

# Security

Implemented practices:

- strict backend validation
- database transactions
- safe file replacement
- physical file deletion
- SoftDeletes support
- protected admin routes

---

# Design

Frontend layout was implemented following **pixel‑perfect specifications from Figma designs**.

Design characteristics:

- centered container (~1240px)
- Montserrat typography
- corporate color palette
- responsive grid system

---

# Project Status

Current status:

Production Ready

Modules implemented:

- Hero CMS
- About Page
- Products
- Sectors
- Quality
- Certificates
- Blog / News
- Clients
- Human Resources
- Contact System

The architecture is stable and prepared for future module expansion.

---

# Author

Santiago Alfredo Abasto Ortega

Systems Engineering

---

# License

Developed for corporate use by **Felrro S.R.L.**
