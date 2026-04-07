# 🔒 SECURITY CHECKLIST - PRODUCCIÓN

## ✅ PRE-DEPLOYMENT CHECKS

### 1. Configuración de Entorno
- [ ] `APP_DEBUG=false` ✓ (ya configurado)
- [ ] `APP_ENV=production` ✓ (ya configurado)
- [ ] `APP_URL` = tu dominio actual (actualizar en `.env.production`)
- [ ] Generar nuevo `APP_KEY` para producción: `php artisan key:generate`
- [ ] Verificar que `.env` no está en version control (en `.gitignore`)
- [ ] Database credentials seguros (usuario con permisos limitados)
- [ ] Redis/Cache credentials seguros

### 2. Session & Security
- [ ] `SESSION_ENCRYPT=true` ✓ (ya configurado)
- [ ] `SESSION_SECURE_COOKIE=true` ✓ (ya configurado)
- [ ] `SESSION_HTTP_ONLY=true` ✓ (ya configurado)
- [ ] `SESSION_SAME_SITE=strict` ✓ (ya configurado)
- [ ] `SESSION_LIFETIME=60` ✓ (ya configurado - 60 minutos)
- [ ] SSL/TLS certificate instalado en servidor
- [ ] Redirect HTTP → HTTPS configurado en `.htaccess` o Nginx

### 3. Credenciales Críticas
- [ ] **ROTAR Mailtrap credentials** - las actuales están expostas:
  ```
  MAIL_USERNAME=c97f6cd0569220
  MAIL_PASSWORD=6eebca28620d9d
  ```
  Pasos:
  1. Ir a https://mailtrap.io/
  2. Cambiar contraseña de la cuenta
  3. Generar nuevas credenciales (Settings → API Tokens)
  4. Actualizar en `.env.production`

- [ ] Stripe/Payment API keys (si aplica) - usar env vars, nunca hardcodear
- [ ] Database credentials no compartidas
- [ ] SSH keys con permisos 600

### 4. Archivos y Directorios
- [ ] `/storage` NO debe estar en public_html
- [ ] `/bootstrap/cache` debe tener permisos de escritura (755)
- [ ] `/storage` permisos 775, propiedad del usuario web (www-data, nobody, etc.)
- [ ] `.env` permisos 600, NO accesible públicamente
- [ ] `composer.lock` presente y versionado
- [ ] `package-lock.json` presente y versionado

### 5. Base de Datos
- [ ] Respaldos automáticos configurados (diarios mínimo)
- [ ] Usuario DB con permisos limitados (NO root)
- [ ] Conexión encrypted (SSL en producción)
- [ ] Migrations: `php artisan migrate --force`
- [ ] Seeds ejecutados si necesario

### 6. Autenticación & Autorización
- [ ] ❌ **ISSUE CRÍTICO**: Falta role-based authorization en admin routes
  - Cualquier usuario autenticado = acceso admin
  - TODO: Implementar roles (admin, editor, viewer)

  **FIX**: Crear tabla roles y ajustar middleware:
  ```php
  // En admin routes: ->middleware('auth', 'admin')
  // Con middleware que verifica: Auth::user()->isAdmin()
  ```

- [ ] Email verification habilitada para nuevos users
- [ ] 2FA/MFA configurada para admin users (opcional pero recomendado)
- [ ] Password reset emails enviadas por HTTPS

### 7. API & Endpoints
- [ ] Rate limiting en endpoints públicos ✓ (ya configurado)
  - Formulario de contacto: 5 por minuto
  - Aplicaciones de empleo: 5 por minuto
  - Newsletter: 10 por minuto
  - Cotizaciones: 5 por minuto

- [ ] CSRF tokens en todos los formularios ✓
- [ ] Validación de entrada en todos los controllers ✓
- [ ] SQL injection prevention: nunca usar `whereRaw()` sin placeholders ✓
- [ ] No exponer IDs internos en URLs si es sensible

### 8. Archivos Subidos
- [ ] Validación de tipo MIME ✓
- [ ] Límites de tamaño razonables ✓
- [ ] Almacenamiento FUERA de public_html para documentos sensibles
  - CVs de candidatos están en `/storage/public/job-applications/cvs` ⚠️
  - Moverlos a `/storage/app/job-applications/` (no públicos)

- [ ] Scan de virus en uploads (opcional: integrar ClamAV)
- [ ] Renombrar archivos a nombres random (evita path traversal)

### 9. Headers de Seguridad HTTP
Agregar en `.htaccess` o Nginx config:

```apache
# .htaccess
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
```

### 10. Logging & Monitoring
- [ ] Logs configurados a `/storage/logs/`
- [ ] Log retention configurada (evitar disco lleno)
- [ ] Monitoreo de errores: Sentry, Bugsnag, o similar
- [ ] Alertas para errores críticos configuradas
- [ ] Acceso a logs restringido (no accesible vía web)

### 11. Backups
- [ ] Respaldos diarios de BD programados
- [ ] Respaldos automáticos de `/storage/app/`
- [ ] Prueba de restore mensual
- [ ] Backups almacenados en ubicación segura (no en servidor)

### 12. SSL/TLS
- [ ] Certificado SSL válido (Let's Encrypt gratis)
- [ ] HSTS habilitado (Strict-Transport-Security)
- [ ] Renovación automática configurada
- [ ] TLS 1.2+ mínimo

### 13. Seguridad de Servidor
- [ ] Firewall configurado (UFW, iptables, etc.)
  - Puertos abiertos: 80 (HTTP), 443 (HTTPS), 22 (SSH admin only)

- [ ] Fail2ban o similar para bloquear ataques brute-force
- [ ] SSH:
  - [ ] Key-based auth habilitado
  - [ ] Password auth deshabilitado
  - [ ] Root login deshabilitado
  - [ ] Puerto no-estándar (opcional)

- [ ] Actualizaciones de seguridad automáticas habilitadas
- [ ] Servicios innecesarios deshabilitados

---

## 🚨 VULNERABILIDADES CONOCIDAS (CORREGIDAS)

### ✓ XSS en contacto.blade.php
**Status**: FIXED
- Agregado validación estricta de Google Maps iframes
- Bloquea scripts y event handlers

### ✓ Rate Limiting
**Status**: FIXED
- Agregado throttle a formularios públicos

### ✓ Session Encryption
**Status**: FIXED
- Habilitada encriptación de sesiones

### ✓ Debug Mode
**Status**: FIXED
- `APP_DEBUG=false` en producción

### ❌ Role-Based Authorization
**Status**: NOT YET FIXED
- Admin routes NO verifican si user es realmente admin
- TODO: Implementar sistema de roles

### ❌ CVs en directorio público
**Status**: PARTIALLY FIXED
- CVs almacenados en `/storage/public/` (accesible vía URL)
- TODO: Mover a `/storage/app/` (no público)

---

## 📋 DEPLOYMENT SCRIPT

```bash
#!/bin/bash

# 1. Crear .env de producción
cp .env.example .env.production
# ... editar credenciales, URL, etc.

# 2. Instalar dependencias
composer install --no-dev --optimize-autoloader
npm install
npm run build

# 3. Generar app key
php artisan key:generate --env=production

# 4. Ejecutar migrations
php artisan migrate --env=production --force

# 5. Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# 6. Set permissions
chmod -R 755 bootstrap/cache
chmod -R 755 storage
chown -R www-data:www-data storage bootstrap/cache

# 7. Verificar seguridad
php artisan config:cache
```

---

## 📞 POST-DEPLOYMENT

- [ ] Test de HTTPS (use https://www.ssllabs.com/ssltest/)
- [ ] Test de seguridad (use OWASP ZAP or Burp Suite)
- [ ] Verificar logs no contienen información sensible
- [ ] Prueba todos los formularios públicos
- [ ] Verifica autenticación de admin
- [ ] Simula ataques comunes (SQLi, XSS, CSRF)

---

## 📚 REFERENCIAS

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security](https://laravel.com/docs/security)
- [PHP Security](https://www.php.net/manual/en/security.php)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)

---

**Última actualización**: 2026-03-09
**Status**: ⚠️ Requiere fixes antes de producción
