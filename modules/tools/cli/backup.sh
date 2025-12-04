#!/bin/bash
#
# wpf backup - Create full backup of project
#

# Find current project
CURRENT_DIR=$(pwd)
if [ -f "$CURRENT_DIR/.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR"
    source "$CURRENT_DIR/.wpf-config"
else
    echo -e "${RED}Error:${NC} Not in a WPF project directory"
    exit 1
fi

print_banner
echo -e "${GREEN}Creating backup for:${NC} $PROJECT_NAME"
echo ""

BACKUP_DIR="$PROJECT_DIR/backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${PROJECT_NAME}-backup-${TIMESTAMP}"

# =====================================================
# Backup Files
# =====================================================
echo -e "${CYAN}Backing up files...${NC}"

tar -czf "${BACKUP_FILE}-files.tar.gz" \
    --exclude='node_modules' \
    --exclude='backups' \
    --exclude='*.log' \
    -C "$PROJECT_DIR" . 2>/dev/null

FILE_SIZE=$(du -h "${BACKUP_FILE}-files.tar.gz" | cut -f1)
echo -e "${GREEN}✓ Files backed up (${FILE_SIZE})${NC}"

# =====================================================
# Backup Database
# =====================================================
echo -e "${CYAN}Backing up database...${NC}"

if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
    cd "$PROJECT_DIR"

    # Check if containers are running
    if docker-compose ps 2>/dev/null | grep -q "Up"; then
        # Export database
        docker-compose exec -T db mysqldump -u wordpress -pwordpress wordpress > "${BACKUP_FILE}-database.sql" 2>/dev/null

        if [ -f "${BACKUP_FILE}-database.sql" ]; then
            DB_SIZE=$(du -h "${BACKUP_FILE}-database.sql" | cut -f1)
            echo -e "${GREEN}✓ Database backed up (${DB_SIZE})${NC}"
        else
            echo -e "${YELLOW}⚠ Database backup failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Docker not running - skipping database backup${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No docker-compose.yml - skipping database backup${NC}"
fi

# =====================================================
# Create Combined Backup
# =====================================================
echo -e "${CYAN}Creating combined backup...${NC}"

cd "$BACKUP_DIR"
COMBINED_FILE="${PROJECT_NAME}-full-backup-${TIMESTAMP}.tar.gz"

# Combine all backups
tar -czf "$COMBINED_FILE" \
    "${PROJECT_NAME}-backup-${TIMESTAMP}"* 2>/dev/null

# Clean up individual files
rm -f "${BACKUP_FILE}-files.tar.gz" "${BACKUP_FILE}-database.sql" 2>/dev/null

FINAL_SIZE=$(du -h "$COMBINED_FILE" | cut -f1)

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Backup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Location: $BACKUP_DIR/$COMBINED_FILE"
echo "Size: $FINAL_SIZE"
echo ""

# List recent backups
echo "Recent backups:"
ls -lth "$BACKUP_DIR"/*.tar.gz 2>/dev/null | head -5 | awk '{print "  " $9 " (" $5 ")"}'
