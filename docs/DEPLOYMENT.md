# Deployment Guide - Coolify

A comprehensive guide to deploying your Next.js application using Coolify.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Variables](#environment-variables)
- [Docker Configuration](#docker-configuration)
- [Coolify Integration](#coolify-integration)
- [Health Checks](#health-checks)
- [Monitoring](#monitoring)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

## Overview

**Coolify** is an open-source, self-hostable platform that simplifies application deployment with features like:

- Automatic deployments from Git repositories
- Environment variable management
- Built-in SSL certificates
- Health monitoring
- Zero-downtime deployments
- Easy rollbacks

This guide assumes you're using Coolify to deploy this Next.js template.

## Prerequisites

Before deploying, ensure you have:

### Coolify Setup

- A Coolify instance running (self-hosted or cloud)
- Admin access to Coolify dashboard
- A server configured in Coolify (with Docker installed)

### Application Requirements

- Git repository (GitHub, GitLab, or Bitbucket)
- Environment variables prepared (see [Environment Variables](#environment-variables))
- Database setup complete (if using database features)

### Domain & DNS

- Domain name configured
- DNS A record pointing to your server's IP
- SSL certificate (Coolify handles this automatically)

## Initial Setup

### 1. Prepare Your Repository

Ensure your repository has these files:

```
your-repo/
├── Dockerfile              # Docker build configuration
├── .dockerignore          # Files to exclude from Docker build
├── next.config.mjs        # Next.js configuration
└── .env.example           # Environment variable template
```

#### Create Dockerfile

```dockerfile
# Multi-stage Dockerfile for Next.js 16
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
```

#### Create .dockerignore

```
node_modules
.next
.git
.env*
!.env.example
.DS_Store
*.log
coverage
.vscode
.idea
README.md
docs
```

#### Update next.config.mjs

Enable standalone output for Docker:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone for Docker
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
```

### 2. Create Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Optional: Check database connectivity
    // await db.execute(sql`SELECT 1`)

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
```

### 3. Push to Git Repository

```bash
git add .
git commit -m "Prepare for Coolify deployment"
git push origin main
```

## Environment Variables

### Required Variables

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=My Awesome Site
NEXT_PUBLIC_SITE_URL=https://mysite.com
PRODUCTION_SITE_URL=https://mysite.com

# Database (if using)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Build Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Optional Variables

```bash
# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email/SMTP (if using)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
AWS_SES_FROM_EMAIL=noreply@mysite.com
EMAIL_ENABLED=true

# Analytics (if using)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Environment Variable Best Practices

1. **Never commit secrets** - Use `.env.example` for templates only
2. **Use NEXT_PUBLIC_ prefix** - For client-side variables
3. **Document all variables** - In `.env.example` with comments
4. **Use production URLs** - Never localhost in production env vars

## Docker Configuration

### Build Settings

Coolify automatically detects the Dockerfile. Key build settings:

- **Build Pack**: Dockerfile
- **Build Path**: `/` (root of repository)
- **Dockerfile Location**: `./Dockerfile`
- **Build Context**: `.`

### Runtime Settings

- **Port**: 3000 (exposed in Dockerfile)
- **Health Check**: `/api/health` endpoint
- **Restart Policy**: Always
- **Memory Limit**: 512MB - 1GB (adjust based on needs)

### Multi-Stage Build Benefits

Our Dockerfile uses multi-stage builds for:

1. **Smaller image size** - Only production dependencies
2. **Faster deployments** - Cached layers
3. **Security** - Non-root user (nextjs)
4. **Separation of concerns** - deps → builder → runner

## Coolify Integration

### Step 1: Create New Resource

1. Log into Coolify dashboard
2. Navigate to your server
3. Click **+ New Resource**
4. Select **Public Repository** or **Private Repository**

### Step 2: Configure Repository

**For Public Repository:**

- Repository URL: `https://github.com/username/repo.git`
- Branch: `main`

**For Private Repository:**

- Add deploy key or personal access token
- Repository URL: `git@github.com:username/repo.git`
- Branch: `main`

### Step 3: Configure Build

- **Build Pack**: Dockerfile
- **Publish Directory**: Not needed (Docker handles this)
- **Port**: 3000
- **Build Command**: Handled by Dockerfile

### Step 4: Add Environment Variables

Click **Environment** tab and add all required variables:

```
NEXT_PUBLIC_APP_NAME=My Site
NEXT_PUBLIC_SITE_URL=https://mysite.com
DATABASE_URL=postgresql://...
NODE_ENV=production
```

**Tip**: Use Coolify's "Bulk Add" to paste all variables at once.

### Step 5: Configure Domain

1. Go to **Domains** tab
2. Click **Add Domain**
3. Enter your domain: `mysite.com`
4. Coolify automatically provisions SSL via Let's Encrypt

**Optional**: Add `www` redirect:

- Main domain: `mysite.com`
- Redirect: `www.mysite.com` → `mysite.com`

### Step 6: Deploy

1. Click **Deploy** button
2. Monitor build logs in real-time
3. Wait for "Deployment successful" message
4. Visit your domain to verify

## Health Checks

### Configuring Health Checks

Coolify uses the Docker HEALTHCHECK defined in Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

**Parameters:**

- `--interval=30s` - Check every 30 seconds
- `--timeout=10s` - Fail if response takes >10s
- `--start-period=40s` - Grace period during startup
- `--retries=3` - Mark unhealthy after 3 failed checks

### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
export async function GET() {
  // Basic health check
  return NextResponse.json({ status: 'healthy' }, { status: 200 })

  // Advanced: Check database
  try {
    await db.execute(sql`SELECT 1`)
    return NextResponse.json({ status: 'healthy' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 })
  }
}
```

### Monitoring Health

View health status in Coolify:

1. Navigate to your application
2. Check **Health** indicator (green = healthy)
3. Click **Logs** to see health check results

## Monitoring

### Application Logs

View real-time logs in Coolify:

1. Navigate to application
2. Click **Logs** tab
3. Filter by severity (info, error, warn)

**Log best practices:**

```typescript
// Use production-safe logging
import { logger } from '@/lib/logger'

logger.info('[API] Request processed')
logger.error('[API] Error occurred:', error)
logger.debug('[API] Debug info') // Only in development
```

### Resource Monitoring

Monitor application resources:

1. **CPU Usage** - Check container CPU consumption
2. **Memory Usage** - Monitor RAM usage (set limits)
3. **Network** - Track bandwidth usage
4. **Disk** - Monitor storage usage

**Setting Limits:**

In Coolify resource settings:

- Memory Limit: `1GB`
- Memory Reservation: `512MB`
- CPU Limit: `1.0` (1 CPU core)

### Uptime Monitoring

**Option 1: Coolify Built-in**

Coolify monitors container health automatically.

**Option 2: External Monitoring**

Use services like:

- **UptimeRobot** - Free tier available
- **Pingdom**
- **Better Uptime**

Monitor URL: `https://mysite.com/api/health`

## Rollback Procedures

### Quick Rollback (via Coolify)

1. Navigate to application in Coolify
2. Go to **Deployments** tab
3. Find previous successful deployment
4. Click **Redeploy** on that version

### Manual Rollback (via Git)

```bash
# View commit history
git log --oneline

# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit (use with caution)
git reset --hard abc123
git push --force origin main
```

**Warning**: Force push requires force-push permissions and triggers a new deployment.

### Database Rollback

If deployment includes database migrations:

1. **Before deploying** - Create database backup
2. **If rollback needed** - Restore from backup
3. **Run down migrations** - If using migration system

```bash
# Example: Rollback Drizzle migration
npm run db:rollback
```

## Troubleshooting

### Build Failures

**Issue**: Build fails during `npm install`

```bash
# Solution: Clear build cache in Coolify
# 1. Go to application settings
# 2. Click "Advanced"
# 3. Enable "Clear Build Cache"
# 4. Redeploy
```

**Issue**: TypeScript errors during build

```bash
# Solution: Ensure all type errors are fixed locally first
npm run build  # Test locally
git add .
git commit -m "Fix type errors"
git push
```

### Runtime Errors

**Issue**: Application crashes on startup

```bash
# Check logs in Coolify
# Look for:
# - Missing environment variables
# - Database connection errors
# - Port conflicts
```

**Issue**: Database connection timeout

```bash
# Verify DATABASE_URL is correct
# Check database is accessible from Coolify server
# Ensure database allows connections from server IP
```

### Performance Issues

**Issue**: Slow response times

```bash
# Solutions:
# 1. Increase memory limit in Coolify
# 2. Enable Next.js caching
# 3. Optimize database queries
# 4. Enable CDN for static assets
```

**Issue**: High memory usage

```bash
# Monitor memory in Coolify
# Identify memory leaks
# Increase memory limit or optimize code
```

### SSL/Domain Issues

**Issue**: SSL certificate not provisioning

```bash
# 1. Verify DNS A record points to server IP
# 2. Wait 5-10 minutes for propagation
# 3. Check Coolify logs for Let's Encrypt errors
# 4. Ensure port 80 and 443 are open
```

**Issue**: Domain not accessible

```bash
# 1. Verify DNS with: dig mysite.com
# 2. Check domain configuration in Coolify
# 3. Verify application is running (check health)
# 4. Check firewall rules
```

### Environment Variables

**Issue**: Environment variables not working

```bash
# Ensure variables are added in Coolify, not .env files
# Restart application after adding new variables
# Check for typos in variable names
# Verify NEXT_PUBLIC_ prefix for client-side vars
```

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured in Coolify
- [ ] Database migrations applied
- [ ] DNS configured and propagated
- [ ] Health check endpoint working
- [ ] Build tested locally with `npm run build`
- [ ] TypeScript errors resolved
- [ ] Sensitive data removed from codebase
- [ ] .dockerignore includes .env files
- [ ] Backup of database created
- [ ] Monitoring/alerts configured
- [ ] SSL certificate provisioned
- [ ] Application tested in production environment

## Post-Deployment

After successful deployment:

1. **Test all features** - Navigate through your site
2. **Check logs** - Monitor for errors
3. **Verify health checks** - Ensure passing
4. **Test forms** - Submit test data
5. **Check database** - Verify data persistence
6. **Monitor performance** - Check response times
7. **Set up alerts** - Configure uptime monitoring

## Continuous Deployment

Enable automatic deployments:

1. In Coolify, enable **Auto Deploy**
2. Choose deployment trigger:
   - **Push to branch** - Deploy on every push to `main`
   - **Tag** - Deploy on Git tag (e.g., `v1.0.0`)
   - **Manual** - Deploy manually only

**Recommended**: Use `main` branch for auto-deploy with proper testing workflow.

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

Your application is now deployed and accessible to the world!
