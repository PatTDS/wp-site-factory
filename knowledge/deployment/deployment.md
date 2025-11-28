# WordPress Deployment Workflows

## Pre-Deployment Checklist

### Automated Validation (MUST PASS ALL)
```bash
#!/bin/bash
# pre-deploy-check.sh

echo "🔍 Running Pre-Deployment Checks..."

# 1. Run all tests
npm test || { echo "❌ Tests failed"; exit 1; }

# 2. Check Lighthouse score
LIGHTHOUSE_SCORE=$(npm run lighthouse:score)
if [ "$LIGHTHOUSE_SCORE" -lt 70 ]; then
    echo "❌ Lighthouse score below 70: $LIGHTHOUSE_SCORE"
    exit 1
fi

# 3. Security scan
./scripts/security-scan.sh || { echo "❌ Security issues found"; exit 1; }

# 4. Check for debug mode
grep -q "WP_DEBUG.*true" wp-config.php && {
    echo "⚠️  WP_DEBUG is enabled - disable for production"
    exit 1
}

# 5. Verify backups
./scripts/verify-backup.sh || { echo "❌ Backup verification failed"; exit 1; }

echo "✅ All pre-deployment checks passed!"
```

## Development to Staging Workflow

### Step 1: Prepare Files
```bash
# Build production assets
cd wp-content/themes/natigeo-theme
npm run build

# Optimize images
find wp-content/uploads -type f \( -name "*.jpg" -o -name "*.jpeg" \) \
  -exec convert {} -strip -quality 85 {} \;

# Clear development artifacts
rm -rf wp-content/debug.log
rm -rf wp-content/cache/*
```

### Step 2: Database Export & Sanitization
```bash
# Export database
wp db export staging-deploy-$(date +%Y%m%d-%H%M%S).sql

# Replace URLs for staging
wp search-replace 'http://localhost:8080' 'https://staging.example.com' \
  --skip-columns=guid \
  --export=staging-ready.sql
```

### Step 3: Deploy to Staging
```bash
#!/bin/bash
# deploy-to-staging.sh

STAGING_HOST="staging.example.com"
STAGING_USER="deploy"
STAGING_PATH="/var/www/staging"

# Sync files (excluding development files)
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'wp-config.php' \
  --exclude 'wp-content/debug.log' \
  --exclude 'wp-content/cache/*' \
  --exclude '.env' \
  ./ ${STAGING_USER}@${STAGING_HOST}:${STAGING_PATH}/

# Import database
ssh ${STAGING_USER}@${STAGING_HOST} << EOF
  cd ${STAGING_PATH}
  wp db import staging-ready.sql
  wp cache flush
  wp rewrite flush
EOF

echo "✅ Deployed to staging"
```

### Step 4: Staging Validation
```bash
# Automated staging tests
curl -I https://staging.example.com | grep "200 OK" || exit 1
npm run e2e:staging
npm run lighthouse:staging

# Manual QA checklist
echo "📋 Manual QA Checklist:"
echo "[ ] Homepage loads correctly"
echo "[ ] Navigation works"
echo "[ ] Forms submit successfully"
echo "[ ] Images display properly"
echo "[ ] Mobile responsive"
echo "[ ] Search functionality"
echo "[ ] Admin login works"
```

## Staging to Production Workflow

### CRITICAL: Production Deployment Gates
```bash
#!/bin/bash
# production-deploy-gates.sh

echo "🚨 PRODUCTION DEPLOYMENT SAFETY CHECKS"

# Gate 1: Staging must be validated
read -p "Has staging been validated for 24+ hours? (y/n): " staging_validated
[ "$staging_validated" != "y" ] && { echo "❌ Validate staging first"; exit 1; }

# Gate 2: All tests must pass
./scripts/run-all-tests.sh || { echo "❌ Tests failed"; exit 1; }

# Gate 3: Security scan must be clean
SECURITY_RESULTS=$(./scripts/security-scan.sh)
echo "$SECURITY_RESULTS" | grep -q "CRITICAL" && {
    echo "❌ Critical security issues found"
    exit 1
}

# Gate 4: Backup must exist
BACKUP_FILE="production-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
./scripts/backup-production.sh "$BACKUP_FILE" || {
    echo "❌ Backup failed"
    exit 1
}

# Gate 5: Manual approval required
echo "⚠️  FINAL PRODUCTION DEPLOYMENT CONFIRMATION"
echo "Backup created: $BACKUP_FILE"
read -p "Deploy to PRODUCTION? Type 'DEPLOY' to confirm: " confirmation
[ "$confirmation" != "DEPLOY" ] && { echo "❌ Deployment cancelled"; exit 1; }

echo "✅ All gates passed - proceeding with production deployment"
```

### Production Deployment Script
```bash
#!/bin/bash
# deploy-to-production.sh

set -e  # Exit on any error

PRODUCTION_HOST="production.example.com"
PRODUCTION_USER="deploy"
PRODUCTION_PATH="/var/www/production"
BACKUP_PATH="/backups"

# Step 1: Create pre-deployment snapshot
echo "📸 Creating pre-deployment snapshot..."
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} << EOF
  cd ${PRODUCTION_PATH}
  tar -czf ${BACKUP_PATH}/pre-deploy-$(date +%Y%m%d-%H%M%S).tar.gz ./
  wp db export ${BACKUP_PATH}/database-pre-deploy-$(date +%Y%m%d-%H%M%S).sql
EOF

# Step 2: Enable maintenance mode
echo "🔧 Enabling maintenance mode..."
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} << EOF
  cd ${PRODUCTION_PATH}
  touch .maintenance
EOF

# Step 3: Deploy files
echo "📦 Deploying files..."
rsync -avz --delete \
  --exclude 'wp-config.php' \
  --exclude 'wp-content/uploads' \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.env' \
  --exclude '.maintenance' \
  ./ ${PRODUCTION_USER}@${PRODUCTION_HOST}:${PRODUCTION_PATH}/

# Step 4: Database updates (if needed)
echo "🗄️ Updating database..."
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} << EOF
  cd ${PRODUCTION_PATH}
  wp core update-db
  wp cache flush
  wp rewrite flush
EOF

# Step 5: Post-deployment validation
echo "✔️ Running post-deployment checks..."
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} << EOF
  cd ${PRODUCTION_PATH}
  wp core verify-checksums
  wp plugin verify-checksums --all
EOF

# Step 6: Disable maintenance mode
echo "🚀 Disabling maintenance mode..."
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} << EOF
  cd ${PRODUCTION_PATH}
  rm -f .maintenance
EOF

# Step 7: Smoke tests
echo "🔍 Running smoke tests..."
curl -f -s -o /dev/null -w "%{http_code}" https://production.example.com || {
    echo "❌ Site not responding - ROLLING BACK"
    ./scripts/rollback-production.sh
    exit 1
}

echo "✅ Production deployment complete!"
```

## Rollback Procedure

### Automatic Rollback Triggers
- Site returns 500 error
- Homepage fails to load within 5 seconds
- Database connection errors
- Critical functionality broken

### Manual Rollback Script
```bash
#!/bin/bash
# rollback-production.sh

PRODUCTION_HOST="production.example.com"
PRODUCTION_USER="deploy"
PRODUCTION_PATH="/var/www/production"
BACKUP_PATH="/backups"

echo "🔄 INITIATING ROLLBACK"

# Find latest backup
LATEST_BACKUP=$(ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} \
  "ls -t ${BACKUP_PATH}/pre-deploy-*.tar.gz | head -1")

LATEST_DB=$(ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} \
  "ls -t ${BACKUP_PATH}/database-pre-deploy-*.sql | head -1")

# Enable maintenance mode
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} "touch ${PRODUCTION_PATH}/.maintenance"

# Restore files
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} << EOF
  cd ${PRODUCTION_PATH}
  tar -xzf ${LATEST_BACKUP} ./
EOF

# Restore database
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} << EOF
  cd ${PRODUCTION_PATH}
  wp db import ${LATEST_DB}
  wp cache flush
EOF

# Disable maintenance mode
ssh ${PRODUCTION_USER}@${PRODUCTION_HOST} "rm -f ${PRODUCTION_PATH}/.maintenance"

echo "✅ Rollback complete"
```

## Zero-Downtime Deployment

### Blue-Green Deployment Setup
```bash
# Directory structure
/var/www/
├── blue/       # Current production
├── green/      # New deployment
└── current -> /var/www/blue  # Symlink

# Deploy to green environment
rsync -avz ./ deploy@server:/var/www/green/

# Test green environment
curl https://green.example.com

# Switch production
ssh deploy@server "ln -sfn /var/www/green /var/www/current"

# Verify and clean up
ssh deploy@server "rm -rf /var/www/blue"
ssh deploy@server "mv /var/www/green /var/www/blue"
```

## Docker-Based Deployment

### Container Build & Push
```bash
# Build production image
docker build -t natigeo/wordpress:latest \
  --build-arg WP_VERSION=6.7 \
  --build-arg PHP_VERSION=8.0 \
  .

# Tag with version
docker tag natigeo/wordpress:latest \
  natigeo/wordpress:v$(date +%Y%m%d-%H%M%S)

# Push to registry
docker push natigeo/wordpress:latest
docker push natigeo/wordpress:v$(date +%Y%m%d-%H%M%S)
```

### Docker Compose Production
```yaml
# docker-compose.production.yml
version: '3.8'

services:
  wordpress:
    image: natigeo/wordpress:latest
    restart: always
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: ${DB_USER}
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD}
      WORDPRESS_DB_NAME: ${DB_NAME}
    volumes:
      - wordpress_data:/var/www/html
      - ./uploads:/var/www/html/wp-content/uploads
    networks:
      - wordpress_net
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - wordpress_net

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    networks:
      - wordpress_net

volumes:
  wordpress_data:
  db_data:

networks:
  wordpress_net:
```

## GitHub Actions CI/CD

### Automated Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Build production assets
        run: |
          npm ci
          npm run build

      - name: Deploy to server
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "./"
          TARGET: "/var/www/production"
          EXCLUDE: "node_modules, .git, .github"

      - name: Post-deployment tasks
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/production
            wp cache flush
            wp rewrite flush
```

## Monitoring Post-Deployment

### Health Check Script
```bash
#!/bin/bash
# post-deploy-monitor.sh

SITE_URL="https://production.example.com"
ALERT_EMAIL="admin@example.com"

# Monitor for 15 minutes post-deployment
for i in {1..15}; do
    echo "Health check $i/15..."

    # Check HTTP status
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $SITE_URL)
    if [ "$HTTP_STATUS" != "200" ]; then
        echo "❌ Site returning $HTTP_STATUS"
        echo "Site down - HTTP $HTTP_STATUS" | mail -s "URGENT: Production Site Issue" $ALERT_EMAIL
        ./scripts/rollback-production.sh
        exit 1
    fi

    # Check response time
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" $SITE_URL)
    if (( $(echo "$RESPONSE_TIME > 5" | bc -l) )); then
        echo "⚠️  Slow response: ${RESPONSE_TIME}s"
    fi

    # Check critical endpoints
    curl -f -s "${SITE_URL}/wp-json/" > /dev/null || echo "⚠️  REST API not responding"
    curl -f -s "${SITE_URL}/wp-admin/" > /dev/null || echo "⚠️  Admin not accessible"

    sleep 60
done

echo "✅ Post-deployment monitoring complete"
```

## Emergency Procedures

### Production Hotfix Workflow
```bash
#!/bin/bash
# emergency-hotfix.sh

# 1. Create hotfix branch
git checkout -b hotfix/critical-issue main

# 2. Apply fix
# ... make changes ...

# 3. Fast-track testing
npm run test:critical
npm run security:scan

# 4. Deploy directly to production
./scripts/deploy-to-production.sh --skip-staging

# 5. Backport to develop
git checkout develop
git merge hotfix/critical-issue
```

### Database Recovery
```bash
#!/bin/bash
# database-recovery.sh

# Find latest clean backup
BACKUP_FILE=$(ls -t /backups/database-*.sql | head -1)

# Stop application
docker-compose stop wordpress

# Restore database
wp db import $BACKUP_FILE

# Verify integrity
wp db check
wp db repair

# Restart application
docker-compose start wordpress
```

## Deployment Best Practices

### DO's ✅
- Always backup before deployment
- Test in staging first (minimum 24 hours)
- Use atomic deployments when possible
- Monitor for 15+ minutes post-deployment
- Have rollback plan ready
- Document deployment in changelog
- Notify team of deployment schedule

### DON'Ts ❌
- Never deploy on Fridays
- Never skip staging validation
- Never deploy during high traffic
- Never ignore failing tests
- Never deploy with WP_DEBUG enabled
- Never deploy without backup verification
- Never deploy major changes without announcement

## Deployment Checklist Template

```markdown
## Deployment Checklist - [Date]

### Pre-Deployment
- [ ] All tests passing
- [ ] Lighthouse score > 70
- [ ] Security scan clean
- [ ] Staging validated for 24+ hours
- [ ] Backup created and verified
- [ ] Team notified of deployment window
- [ ] Maintenance window scheduled

### Deployment
- [ ] Maintenance mode enabled
- [ ] Files deployed
- [ ] Database migrated
- [ ] Cache cleared
- [ ] Permissions verified

### Post-Deployment
- [ ] Maintenance mode disabled
- [ ] Smoke tests passing
- [ ] Critical functions tested
- [ ] Performance acceptable
- [ ] Monitoring active for 15 minutes
- [ ] Changelog updated
- [ ] Team notified of completion

### Rollback (if needed)
- [ ] Issue identified: ___________
- [ ] Rollback initiated at: _______
- [ ] Backup restored
- [ ] Site functional
- [ ] Root cause documented
```
- do not create guides and summaries unless user asks, when prompt to do a task, plan, execute, finish it.