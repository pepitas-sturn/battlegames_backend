#!/bin/bash

echo "🔁 Starting MongoDB Backup..."

TIMESTAMP=$(date +"%F-%H-%M")
BACKUP_DIR="/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

mongodump \
  --host "$MONGO_HOST" \
  --username "$MONGO_USER" \
  --password "$MONGO_PASS" \
  --authenticationDatabase "$MONGO_AUTH_DB" \
  --out "$BACKUP_DIR"

echo "✅ Backup stored at: $BACKUP_DIR"

# Delete backups older than 7 days
find /backups -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;

echo "🧹 Old backups (older than 7 days) cleaned."
