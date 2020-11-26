file="mysqlconfig.txt"
echo "use mysql;" > $file
echo "CREATE USER '$2'@'localhost' IDENTIFIED BY '$1';" >> $file
echo "GRANT ALL PRIVILEGES ON *.* TO '$2'@'localhost' WITH GRANT OPTION;" >> $file
echo "flush privileges;" >> $file
echo "exit;" >> $file
cat $file