
# Felrro — Setup After Cloning

This guide explains the steps required to run the **Felrro Corporate CMS Platform** after cloning the repository.

The repository does **not include build artifacts or dependency folders** such as:

- vendor/
- node_modules/
- public/build/

These will be generated during installation.

---

# 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/santiagoAbasto/Felrro-S.R.L.git
cd Felrro-S.R.L
```

---

# 2. Install PHP Dependencies

Laravel uses **Composer** to manage backend dependencies.

Run:

```bash
composer install
```

This command installs all Laravel packages and creates the folder:

```
vendor/
```

---

# 3. Install Frontend Dependencies

The admin panel uses **React + Inertia + Vite**, so Node dependencies must be installed.

Run:

```bash
npm install
```

This will create:

```
node_modules/
```

---

# 4. Create Environment File

Copy the example environment configuration:

```bash
cp .env.example .env
```

Then edit the `.env` file and configure your database connection.

Example:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=felrro
DB_USERNAME=root
DB_PASSWORD=
```

---

# 5. Generate Application Key

Laravel requires a secure application key.

Run:

```bash
php artisan key:generate
```

---

# 6. Run Database Migrations

Create the database tables:

```bash
php artisan migrate
```

If the project contains seeders you may run:

```bash
php artisan db:seed
```

---

# 7. Create Storage Symlink

Uploaded files and images are stored in:

```
storage/app/public
```

Create the public link:

```bash
php artisan storage:link
```

This generates:

```
public/storage → storage/app/public
```

---

# 8. Compile Frontend Assets

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
```

This will generate:

```
public/build/
```

---

# 9. Start the Development Server

Run:

```bash
php artisan serve
```

The application will be available at:

```
http://localhost:8000
```

---

# System Requirements

To run this project you need:

- PHP 8+
- Composer
- Node.js 18+
- NPM
- MySQL

---

# Generated Directories

After installation the following directories will exist locally but are **not included in the repository**:

```
vendor/
node_modules/
public/build/
storage/app/public/
```

These directories are automatically generated during the setup process.
