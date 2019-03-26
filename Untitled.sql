DROP DATABASE IF EXISTS top_songsDB;

CREATE DATABASE top_songsDB;

USE top_songsDB;

CREATE TABLE Top5000 (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 1,
  stock_quantity INT NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  product_sales DECIMAL(20,2) NULL,
  PRIMARY KEY (item_id)
);