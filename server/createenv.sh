file=".env"
echo "DB_PASSWORD=$1" > $file
echo "DB_USER=$2" >> $file
echo "DB_HOST=localhost" >> $file
echo "DB_NAME=database_cloud" >> $file
cat $file