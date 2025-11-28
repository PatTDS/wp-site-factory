# WordPress Troubleshooting Guide

## Quick Diagnostic Commands

```bash
# System Status Check
docker-compose ps                    # Container status
wp core verify-checksums             # WordPress file integrity
wp plugin verify-checksums --all     # Plugin file integrity
wp config get                        # Configuration values
wp doctor check                      # Comprehensive health check

# Error Investigation
tail -f wp-content/debug.log        # Real-time error log
docker-compose logs wordpress -f     # Container logs
grep -r "Fatal error" wp-content/   # Find PHP fatal errors
wp db check                          # Database integrity
```

## Common Issues & Solutions

### 🔴 Critical Issues (Site Down)

#### White Screen of Death (WSOD)
**Symptoms:** Blank white page, no content displayed

**Diagnosis:**
```bash
# Enable debug mode
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_LOG true --raw
wp config set WP_DEBUG_DISPLAY false --raw

# Check error log
tail -100 wp-content/debug.log
```

**Common Causes & Fixes:**
1. **PHP Memory Limit**
   ```bash
   wp config set WP_MEMORY_LIMIT 256M
   wp config set WP_MAX_MEMORY_LIMIT 512M
   ```

2. **Plugin Conflict**
   ```bash
   # Deactivate all plugins
   wp plugin deactivate --all

   # Reactivate one by one to find culprit
   wp plugin list --status=inactive
   wp plugin activate [plugin-name]
   ```

3. **Theme Issue**
   ```bash
   # Switch to default theme
   wp theme activate twentytwentyfour
   ```

4. **Corrupted .htaccess**
   ```bash
   # Backup and regenerate
   mv .htaccess .htaccess.backup
   wp rewrite flush --hard
   ```

#### Database Connection Error
**Symptoms:** "Error establishing a database connection"

**Diagnosis & Fix:**
```bash
# Test database connection
wp db check

# If container issue:
docker-compose restart db
docker-compose logs db

# Verify credentials
wp config get DB_HOST
wp config get DB_NAME
wp config get DB_USER

# Test manual connection
docker-compose exec db mysql -u root -p

# Repair tables if corrupted
wp db repair
wp db optimize
```

#### 500 Internal Server Error
**Common Causes:**
1. **.htaccess corruption**
   ```bash
   mv .htaccess .htaccess.old
   echo "# BEGIN WordPress" > .htaccess
   wp rewrite flush
   ```

2. **PHP version mismatch**
   ```bash
   php -v
   wp cli info
   # Ensure PHP 8.0+ for WordPress 6.7
   ```

3. **File permissions**
   ```bash
   find . -type f -exec chmod 644 {} \;
   find . -type d -exec chmod 755 {} \;
   chmod 600 wp-config.php
   ```

### 🟡 Performance Issues

#### Slow Page Load
**Diagnosis:**
```bash
# Query Monitor plugin
wp plugin install query-monitor --activate

# Check database queries
wp db query "SHOW PROCESSLIST"

# Check autoloaded options
wp db query "SELECT COUNT(*) as count, SUM(LENGTH(option_value)) as size FROM wp_options WHERE autoload='yes'"
```

**Solutions:**
1. **Clear transients**
   ```bash
   wp transient delete --all
   ```

2. **Optimize database**
   ```bash
   wp db optimize
   wp db query "DELETE FROM wp_options WHERE option_name LIKE '_transient_%'"
   ```

3. **Regenerate critical CSS**
   ```bash
   ./scripts/generate-critical-css.sh
   ```

4. **Check for slow queries**
   ```sql
   -- Find slow queries
   SELECT * FROM wp_postmeta WHERE meta_key = 'large_data' LIMIT 10;

   -- Add index if needed
   ALTER TABLE wp_postmeta ADD INDEX meta_key_value (meta_key(191), meta_value(50));
   ```

#### High Memory Usage
**Diagnosis:**
```bash
# Check memory usage
wp eval 'echo "Memory: " . memory_get_usage(true) / 1024 / 1024 . " MB\n";'
wp eval 'echo "Peak: " . memory_get_peak_usage(true) / 1024 / 1024 . " MB\n";'
```

**Solutions:**
1. **Increase limits**
   ```php
   define('WP_MEMORY_LIMIT', '256M');
   define('WP_MAX_MEMORY_LIMIT', '512M');
   ```

2. **Disable resource-heavy plugins**
   ```bash
   wp plugin deactivate wordfence
   wp plugin deactivate jetpack
   ```

### 🟢 Content & Display Issues

#### Images Not Displaying
**Common Causes:**
1. **Broken URLs after migration**
   ```bash
   wp search-replace 'old-domain.com' 'new-domain.com' --skip-columns=guid
   ```

2. **Missing image sizes**
   ```bash
   wp media regenerate --yes
   ```

3. **Permissions issue**
   ```bash
   chmod -R 755 wp-content/uploads
   ```

#### Styles Not Loading (Broken CSS)
**Diagnosis:**
```bash
# Check if CSS file exists
ls -la wp-content/themes/natigeo-theme/style.css
ls -la wp-content/themes/natigeo-theme/assets/css/

# Check build status
cd wp-content/themes/natigeo-theme
npm run build
```

**Solutions:**
1. **Clear cache**
   ```bash
   wp cache flush
   wp rocket clean  # if WP Rocket installed
   ```

2. **Rebuild assets**
   ```bash
   cd wp-content/themes/natigeo-theme
   npm install
   npm run build
   ```

3. **Fix asset URLs**
   ```php
   // In functions.php
   wp_enqueue_style('theme-style', get_stylesheet_uri(), [], filemtime(get_stylesheet_directory() . '/style.css'));
   ```

#### Forms Not Submitting
**Common Issues:**
1. **Missing nonce**
   ```php
   // Add to form
   wp_nonce_field('form_action', 'form_nonce');

   // Verify in handler
   if (!wp_verify_nonce($_POST['form_nonce'], 'form_action')) {
       wp_die('Security check failed');
   }
   ```

2. **JavaScript errors**
   ```bash
   # Check browser console
   # Common fix: jQuery not loaded
   wp enqueue script jquery
   ```

3. **Plugin conflict**
   ```bash
   wp plugin deactivate --all
   # Test form
   wp plugin activate contact-form-7
   ```

### 🔒 Security Issues

#### Hacked Site Recovery
**Immediate Actions:**
```bash
# 1. Backup current state (for forensics)
tar -czf hacked-backup-$(date +%Y%m%d).tar.gz ./

# 2. Scan for malware
wp plugin install wordfence --activate
wp wordfence scan

# 3. Check file modifications
wp core verify-checksums
wp plugin verify-checksums --all
wp theme verify-checksums --all

# 4. Find recently modified files
find . -type f -mtime -7 -ls

# 5. Search for suspicious code
grep -r "eval(" --include="*.php"
grep -r "base64_decode" --include="*.php"
grep -r "shell_exec" --include="*.php"
```

**Clean-up Process:**
1. **Replace core files**
   ```bash
   wp core download --force
   ```

2. **Reinstall plugins/themes**
   ```bash
   wp plugin reinstall --all
   wp theme reinstall twentytwentyfour
   ```

3. **Change all passwords**
   ```bash
   wp user update admin --user_pass=NewSecurePassword123!
   ```

4. **Harden security**
   ```bash
   # Disable file editing
   wp config set DISALLOW_FILE_EDIT true --raw

   # Change salts
   wp config shuffle-salts
   ```

#### Permission Denied Errors
**Fix permissions systematically:**
```bash
#!/bin/bash
# fix-permissions.sh

# Set ownership
chown -R www-data:www-data ./

# Set directory permissions
find . -type d -exec chmod 755 {} \;

# Set file permissions
find . -type f -exec chmod 644 {} \;

# Secure sensitive files
chmod 600 wp-config.php
chmod 600 .htaccess

# Uploads need write permission
chmod -R 775 wp-content/uploads
```

### 🔧 Plugin & Theme Issues

#### Plugin Won't Activate
**Diagnosis:**
```bash
# Check PHP version requirements
wp plugin get plugin-name --field=requires_php

# Check WordPress version requirements
wp plugin get plugin-name --field=requires

# Check error log during activation
tail -f wp-content/debug.log &
wp plugin activate plugin-name
```

**Common Fixes:**
1. **Dependency missing**
   ```bash
   # Check plugin dependencies
   grep -r "require" wp-content/plugins/plugin-name/
   ```

2. **Database table creation failed**
   ```sql
   -- Check if tables exist
   SHOW TABLES LIKE 'wp_plugin_%';

   -- Grant create permissions
   GRANT CREATE ON database.* TO 'wp_user'@'localhost';
   ```

#### Theme Customizations Lost
**Recovery Options:**
1. **Check child theme**
   ```bash
   ls -la wp-content/themes/natigeo-child/
   ```

2. **Restore from customizer backup**
   ```bash
   wp option get theme_mods_natigeo-theme
   ```

3. **Export/Import customizer settings**
   ```bash
   wp plugin install customizer-export-import --activate
   ```

### 🗄️ Database Issues

#### Database Bloat
**Diagnosis:**
```sql
-- Check table sizes
SELECT
    table_name AS `Table`,
    round(((data_length + index_length) / 1024 / 1024), 2) `Size in MB`
FROM information_schema.TABLES
WHERE table_schema = 'wordpress_db'
ORDER BY (data_length + index_length) DESC;
```

**Clean-up:**
```bash
# Delete post revisions
wp post delete $(wp post list --post_type='revision' --format=ids) --force

# Delete spam comments
wp comment delete $(wp comment list --status=spam --format=ids) --force

# Clean transients
wp transient delete --expired
wp transient delete --all

# Optimize tables
wp db optimize
```

#### Duplicate Posts/Pages
**Find and fix:**
```sql
-- Find duplicates
SELECT post_title, COUNT(*)
FROM wp_posts
WHERE post_status = 'publish'
GROUP BY post_title
HAVING COUNT(*) > 1;

-- Delete duplicates (keep oldest)
DELETE p1 FROM wp_posts p1
INNER JOIN wp_posts p2
WHERE p1.ID > p2.ID
AND p1.post_title = p2.post_title
AND p1.post_status = 'publish'
AND p2.post_status = 'publish';
```

### 🐳 Docker-Specific Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs wordpress
docker-compose logs db

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check port conflicts
netstat -tulpn | grep :8080
lsof -i :3306
```

#### File Sync Issues
```bash
# Manual sync
docker cp ./wp-content/themes/natigeo-theme/. natigeo_wordpress:/var/www/html/wp-content/themes/natigeo-theme/

# Verify sync
docker exec natigeo_wordpress ls -la /var/www/html/wp-content/themes/natigeo-theme/

# Fix permissions in container
docker exec natigeo_wordpress chown -R www-data:www-data /var/www/html/
```

## Emergency Recovery Procedures

### Complete Site Recovery
```bash
#!/bin/bash
# emergency-recovery.sh

# 1. Stop everything
docker-compose down

# 2. Restore from backup
LATEST_BACKUP=$(ls -t /backups/complete-*.tar.gz | head -1)
tar -xzf $LATEST_BACKUP ./

# 3. Import database
LATEST_DB=$(ls -t /backups/database-*.sql | head -1)
docker-compose up -d db
sleep 10
wp db import $LATEST_DB

# 4. Clear all caches
wp cache flush
rm -rf wp-content/cache/*
wp transient delete --all

# 5. Verify and restart
wp core verify-checksums
docker-compose up -d

echo "Recovery complete - verify site functionality"
```

## Diagnostic Information Collection

### Generate Full Diagnostic Report
```bash
#!/bin/bash
# diagnostic-report.sh

echo "=== WordPress Diagnostic Report ===" > diagnostic.txt
echo "Generated: $(date)" >> diagnostic.txt

echo -e "\n=== System Info ===" >> diagnostic.txt
uname -a >> diagnostic.txt
php -v >> diagnostic.txt
mysql --version >> diagnostic.txt

echo -e "\n=== WordPress Info ===" >> diagnostic.txt
wp core version >> diagnostic.txt
wp plugin list >> diagnostic.txt
wp theme list >> diagnostic.txt

echo -e "\n=== Database Status ===" >> diagnostic.txt
wp db size --tables >> diagnostic.txt
wp db check >> diagnostic.txt

echo -e "\n=== Error Log (last 50 lines) ===" >> diagnostic.txt
tail -50 wp-content/debug.log >> diagnostic.txt

echo -e "\n=== Performance Metrics ===" >> diagnostic.txt
wp option get _transient_doing_cron >> diagnostic.txt
wp cron event list >> diagnostic.txt

echo "Report saved to diagnostic.txt"
```

## Prevention Strategies

### Regular Maintenance Tasks
```bash
# Weekly
wp core check-update
wp plugin update --all --dry-run
wp db optimize

# Monthly
wp transient delete --expired
wp post delete $(wp post list --post_type='revision' --format=ids) --force
wp media regenerate --only-missing

# Quarterly
wp doctor check
Full backup and test restore
Security audit
```

### Monitoring Setup
```bash
# Install monitoring plugins
wp plugin install query-monitor --activate
wp plugin install health-check --activate

# Set up error logging
wp config set WP_DEBUG_LOG true --raw
wp config set WP_DEBUG_DISPLAY false --raw

# Enable object cache monitoring
wp plugin install redis-cache --activate
wp redis enable
```