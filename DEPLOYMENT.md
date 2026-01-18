# TanStack Start Docker Deployment Guide

This Dockerfile is optimized for deploying TanStack Start applications to Dokploy.

## Features

- Multi-stage build for minimal image size
- Node.js 20 LTS base
- Production-optimized with non-root user
- Proper environment variable handling

## Dokploy Setup Instructions

### 1. Repository Setup

- Push your code to a Git repository (GitHub, GitLab, etc.)
- Ensure the Dockerfile and .dockerignore are in the root

### 2. Dokploy Configuration

1. Create a new application in Dokploy
2. Select "Docker" as the deployment type
3. Connect your Git repository
4. Configure the following:

**Build Settings:**

- Dockerfile Path: `./Dockerfile`
- Build Context: `./`
- No additional build arguments needed

**Environment Variables:**

```
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

**Port Configuration:**

- Internal Port: `3000`
- External Port: Choose your desired port (e.g., 3000)

### 3. Environment-Specific Variables

Add any required environment variables:

- `GITHUB_TOKEN` (for GitHub API features)
- `VITE_GITHUB_TOKEN` (alternative GitHub token)
- Any other secrets your app needs

### 4. Deploy

- Click "Deploy" in Dokploy
- The build will take 2-5 minutes
- Once deployed, your app will be available at the configured URL

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are in package.json
2. **App won't start**: Ensure port 3000 is exposed and accessible
3. **Environment variables**: Verify all required env vars are set in Dokploy

### Logs:

- Check Dokploy application logs
- Use `docker logs <container-id>` for local testing
