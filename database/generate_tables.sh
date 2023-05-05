# Update CSVs
# RUN THIS COMMAND
# . ./generate_tables.sh

PGPASSWORD='airplane'
export PGPASSWORD
HOST='csce-315-db.engr.tamu.edu'
DB='csce315331_delta'
MASTER='csce315331_delta_master'
FILE='./populate.sql'

psql -h $HOST -U $MASTER -d $DB -f "$FILE"