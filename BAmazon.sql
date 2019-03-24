DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 1,
  stock_quantity INT NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  product_sales DECIMAL(20,2) NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(20,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Frozen Food", 15000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Fruits and Vegetables", 10000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("School Supplies", 5000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Meat and Poultry", 20000);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Vanilla Ice Cream", 1, 2, 10, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Apple Pie", 1, 5, 5, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Spinach", 2, 1, 20, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Watermelon", 3, 2.50, 10, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Apples", 2, 0.50, 40, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Small Notebooks", 3, 2, 50, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Pencils", 3, 0.50, 100, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Beef Filet Mignon", 4, 9.50, 50, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Salmon", 4, 5.50, 40, true, 0);

INSERT INTO products (product_name, department_id, price, stock_quantity, is_active, product_sales)
VALUES ("Whole Chicken", 4, 4.50, 40, true, 0);

SELECT * FROM products;

SELECT * FROM departments;