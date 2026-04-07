
# Felrro S.R.L – Database Schema

Este documento describe la **estructura final de la base de datos** del proyecto **Felrro**, obtenida directamente desde la base de datos utilizando herramientas de Laravel como `Tinker`, `SHOW CREATE TABLE` y `Schema::getColumnListing()`.

La base de datos está diseñada para soportar un **CMS corporativo multilenguaje**, catálogo de productos industriales, módulos comerciales, RRHH y contenido institucional.

---

# Información General

Framework: Laravel 12  
Base de Datos: MySQL  
Arquitectura CMS: Page + PageSection  
Multilenguaje: JSON {es, en}  
SoftDeletes: usado en módulos críticos  
Storage: storage/app/public  

Total aproximado de tablas: **31**

---

# 1. CMS (Gestión de páginas)

## pages

Tabla que representa las páginas principales del sitio.

| Campo | Tipo |
|------|------|
| id | bigint |
| slug | string |
| title | json |
| meta_title | string |
| meta_description | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

Ejemplos:

home  
nosotros  
contacto  
calidad  

---

## page_sections

Secciones dentro de cada página.

| Campo | Tipo |
|------|------|
| id | bigint |
| page_id | bigint |
| type | string |
| title | json |
| subtitle | json |
| content | json |
| button_text | json |
| image | string |
| button_link | string |
| order | integer |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

Relación:

page_sections.page_id → pages.id

---

## page_section_images

Imágenes asociadas a una sección.

| Campo | Tipo |
|------|------|
| id | bigint |
| page_section_id | bigint |
| image | string |
| order | integer |
| title | string |
| subtitle | string |
| button_text | string |
| button_link | string |
| video_url | string |
| media_type | string |
| created_at | timestamp |
| updated_at | timestamp |

---

# 2. Catálogo de Productos

## products

Tabla principal del catálogo.

| Campo | Tipo |
|------|------|
| id | bigint |
| category_id | bigint |
| name | json |
| short_description | json |
| description | json |
| slug | string |
| featured | boolean |
| home_order | integer |
| featured_order | string |
| image | string |
| ficha_tecnica_file | string |
| ficha_tecnica_weight | string |
| ficha_tecnica_format | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |
| deleted_at | timestamp |

Relación:

products.category_id → product_categories.id

Índices:

UNIQUE slug  
INDEX featured_order  
INDEX home_order  

SoftDeletes:

deleted_at

---

## product_categories

| Campo | Tipo |
|------|------|
| id | bigint |
| name | json |
| description | json |
| slug | string |
| image | string |
| order | string |
| is_active | boolean |
| is_featured | boolean |
| featured_order | string |
| created_at | timestamp |
| updated_at | timestamp |

---

## product_images

| Campo | Tipo |
|------|------|
| id | bigint |
| product_id | bigint |
| image | string |
| order | integer |
| is_primary | boolean |
| created_at | timestamp |
| updated_at | timestamp |

Relación:

product_images.product_id → products.id

---

## product_specifications

| Campo | Tipo |
|------|------|
| id | bigint |
| product_id | bigint |
| title | json |
| content | json |
| order | integer |
| created_at | timestamp |
| updated_at | timestamp |

---

## product_applications

| Campo | Tipo |
|------|------|
| id | bigint |
| product_id | bigint |
| type | string |
| title | json |
| content | json |
| order | integer |
| created_at | timestamp |
| updated_at | timestamp |

Tipos posibles:

application  
construction  
extra  

---

# 3. Módulos Corporativos

## sectors

| Campo | Tipo |
|------|------|
| id | bigint |
| name | json |
| description | json |
| slug | string |
| order | string |
| image | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

## clients

| Campo | Tipo |
|------|------|
| id | bigint |
| name | json |
| logo | string |
| website | string |
| order | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

## certificates

| Campo | Tipo |
|------|------|
| id | bigint |
| name | json |
| slug | string |
| format | string |
| weight | string |
| file | string |
| image_logo | string |
| order | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

## downloads

| Campo | Tipo |
|------|------|
| id | bigint |
| name | string |
| slug | string |
| format | string |
| weight | string |
| file | string |
| order | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

## videos

| Campo | Tipo |
|------|------|
| id | bigint |
| title | string |
| format | string |
| weight | string |
| file | string |
| duration | string |
| thumbnail | string |
| page_slug | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

# 4. Módulo Comercial

## quotations

| Campo | Tipo |
|------|------|
| id | bigint |
| nombre | string |
| email | string |
| telefono | string |
| empresa | string |
| mensaje | text |
| created_at | timestamp |
| updated_at | timestamp |

---

## quotation_items

| Campo | Tipo |
|------|------|
| id | bigint |
| quotation_id | bigint |
| product_id | bigint |
| metros | integer |
| created_at | timestamp |
| updated_at | timestamp |

Relaciones:

quotation_items.quotation_id → quotations.id  
quotation_items.product_id → products.id  

---

# 5. Recursos Humanos

## job_applications

| Campo | Tipo |
|------|------|
| id | bigint |
| first_name | string |
| last_name | string |
| email | string |
| phone | string |
| document_type | string |
| document_number | string |
| genero | string |
| nacionalidad | string |
| country | string |
| provincia | string |
| localidad | string |
| fecha_nacimiento | date |
| job_position_id | bigint |
| job_sector_id | bigint |
| cv_path | string |
| cover_letter_path | string |
| is_reviewed | boolean |
| is_contacted | boolean |
| created_at | timestamp |
| updated_at | timestamp |
| deleted_at | timestamp |

---

## job_positions

| Campo | Tipo |
|------|------|
| id | bigint |
| title | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

## job_sectors

| Campo | Tipo |
|------|------|
| id | bigint |
| name | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

# 6. Configuración del Sistema

## site_settings

| Campo | Tipo |
|------|------|
| id | bigint |
| key | string |
| value | text |
| created_at | timestamp |
| updated_at | timestamp |

Ejemplos de claves:

company_name  
email  
phone  
address  

---

# 7. Tablas internas de Laravel

users  
sessions  
password_reset_tokens  
migrations  
jobs  
failed_jobs  
job_batches  
cache  
cache_locks  
newsletter_subscribers  

---

# Conclusión

La base de datos de **Felrro** implementa una arquitectura modular que incluye:

- CMS dinámico multilenguaje
- catálogo de productos industriales
- sistema de cotizaciones
- módulos corporativos
- RRHH
- blog y descargas
- configuración global del sitio

Stack final:

Laravel 12  
MySQL  
Inertia + React (Admin)  
Blade (Web)  
JSON multilenguaje  
SoftDeletes  
