FROM alpine:latest

# Install dependencies
RUN apk add --no-cache bash curl mongodb-tools tzdata

# Create backup directory
RUN mkdir -p /backups

# Copy scripts
COPY backup.sh /backup.sh
COPY crontab.txt /etc/crontabs/root
RUN chmod +x /backup.sh

# Run cron in foreground
CMD ["crond", "-f", "-L", "/dev/stdout"]