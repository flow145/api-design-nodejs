#!/usr/bin/env bash
set -euo pipefail

create_db_if_missing() {
  local db_name="$1"

  exists=$(psql -tAc "SELECT 1 FROM pg_database WHERE datname = '${db_name}'" \
    --username "$POSTGRES_USER" \
    --dbname "$MAINTENANCE_DATABASE")

  if [[ -z "$exists" ]]; then
    psql --username "$POSTGRES_USER" --dbname "$MAINTENANCE_DATABASE" \
      -c "CREATE DATABASE \"${db_name}\";"
  fi
}

create_db_if_missing habit_tracker
create_db_if_missing habit_tracker_test
