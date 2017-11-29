sudo -u postgres bash -c "psql -c \"CREATE USER pi WITH PASSWORD '';\""
sudo -u postgres bash -c "createdb -U pi simmer"