-- Garante acesso remoto ao usuário definido
CREATE USER IF NOT EXISTS 'ong_user'@'%' IDENTIFIED BY 'rootpassword';
GRANT ALL PRIVILEGES ON ong_db.* TO 'ong_user'@'%';
FLUSH PRIVILEGES;