# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- Docker (optional, for production)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smc
DB_USER=admin
DB_PASSWORD=password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
SMTP_SECURE=true

# Monitoring Configuration
SENTRY_DSN=https://your-sentry-dsn
ERROR_REPORTING=true

# Backup Configuration
BACKUP_STORAGE=local
BACKUP_PATH=/backups
BACKUP_RETENTION_DAYS=7
BACKUP_RETENTION_WEEKS=4
BACKUP_RETENTION_MONTHS=12

# Rate Limiting
RATE_LIMIT=100
RATE_LIMIT_WINDOW=60000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```
