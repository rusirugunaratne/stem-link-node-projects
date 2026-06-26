# Deploying to Render

This guide provides step-by-step instructions for deploying this Express + Prisma + TypeScript application to [Render](https://render.com/).

Since this project is located in a subdirectory (`sample-projects/node-d01-example`) of a monorepo, some specific configurations are required to ensure Render builds and runs it correctly.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Database Setup (PostgreSQL)](#2-database-setup-postgresql)
3. [Web Service Setup on Render](#3-web-service-setup-on-render)
4. [Environment Variables Reference](#4-environment-variables-reference)
5. [Applying Database Migrations](#5-applying-database-migrations)
6. [Alternative: Using Render Blueprints (render.yaml)](#6-alternative-using-render-blueprints-renderyaml)

---

## 1. Prerequisites

Before starting, ensure that:
- Your local changes are committed and pushed to GitHub (e.g., to your current branch or `main`).
- You have a Render account.
- You have external service credentials (such as Clerk and Cloudflare R2 if using image uploads).

---

## 2. Database Setup (PostgreSQL)

Prisma is configured to use PostgreSQL. You can create a free PostgreSQL instance directly on Render:

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New** (top right) and select **PostgreSQL**.
3. Configure the database details:
   - **Name**: `stem-link-db` (or any preferred name)
   - **Database Name**: `stem_link`
   - **User**: `stem_link_user`
   - **Region**: Select a region close to your users (e.g., `Oregon (US West)`).
   - **Instance Type**: Select the **Free** tier.
4. Click **Create Database**.
5. Once active, find the **Connection Info** section:
   - Copy the **Internal Database URL** (if you deploy the Web Service in the same region on Render).
   - Copy the **External Database URL** (for connecting from outside Render or if deploying in different regions).

---

## 3. Web Service Setup on Render

1. From the Render Dashboard, click **New** and select **Web Service**.
2. Connect your GitHub repository: `rusirugunaratne/stem-link-node-projects`.
3. Configure the Web Service settings:
   - **Name**: `stem-link-api`
   - **Language**: `Node`
   - **Branch**: Select your current branch (e.g., `node-d06-testing` or `main`).
   - **Root Directory**: `sample-projects/node-d01-example` *(Crucial for monorepo setup)*
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Select the **Free** tier.
4. Click **Advanced** to add environment variables.

---

## 4. Environment Variables Reference

Add the following environment variables in the **Environment** tab of your Render Web Service:

| Variable Name | Description | Example Value |
|---|---|---|
| `NODE_ENV` | Run environment | `production` |
| `PORT` | Render sets this automatically | *Do not set manually (handled by app.ts)* |
| `DATABASE_URL` | The PostgreSQL connection string | `postgresql://user:pass@host:port/db` (Use your Render External/Internal DB URL) |
| `CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key | `pk_live_...` |
| `CLERK_SECRET_KEY` | Clerk Secret Key | `sk_live_...` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontends | `https://your-frontend.vercel.app,http://localhost:5173` |

### Cloudflare R2 Uploads (Optional)
If your app utilizes Cloudflare R2 for uploading files:
- `R2_ENDPOINT_URL`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_DOMAIN_URL`

---

## 5. Applying Database Migrations

Prisma requires applying migrations to your database schema in production. You can automate this process during deployment so that migrations are applied before the new code goes live.

### Option A: Automate in Build Command (Recommended)
Change your Web Service's **Build Command** on Render to:
```bash
npm install && npm run build && npx prisma migrate deploy
```
This guarantees that your database schema is updated every time a new version of the API is built and deployed.

### Option B: Run Manual Migrations
If you prefer to run migrations manually, you can execute the command from your local machine using the **External Database URL**:
```bash
DATABASE_URL="your-external-database-url" npx prisma migrate deploy
```

---

## 6. Alternative: Using Render Blueprints (render.yaml)

Render supports **Infrastructure as Code** using a `render.yaml` file. This lets you provision the Database and the Web Service together with a single click.

1. Create a `render.yaml` file at the **root of your Git repository** (`stem-link-node-projects/render.yaml`):

```yaml
services:
  - type: web
    name: stem-link-api
    plan: free
    runtime: node
    buildCommand: npm install && npm run build && npx prisma migrate deploy
    startCommand: npm run start
    rootDir: sample-projects/node-d01-example
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: stem-link-db
          property: connectionString
      - key: CLERK_PUBLISHABLE_KEY
        sync: false
      - key: CLERK_SECRET_KEY
        sync: false
      - key: ALLOWED_ORIGINS
        sync: false
      - key: R2_ENDPOINT_URL
        sync: false
      - key: R2_ACCESS_KEY_ID
        sync: false
      - key: R2_SECRET_ACCESS_KEY
        sync: false
      - key: R2_BUCKET_NAME
        sync: false
      - key: R2_PUBLIC_DOMAIN_URL
        sync: false

databases:
  - name: stem-link-db
    plan: free
```

2. Go to the [Blueprints page on Render](https://dashboard.render.com/blueprints).
3. Click **New Blueprint Instance** and connect your repository.
4. Render will auto-detect the `render.yaml` file, spin up the PostgreSQL database, and build/run your Web Service, auto-linking the `DATABASE_URL`.
5. Enter the values for Clerk and R2 variables when prompted in the UI, then deploy!
