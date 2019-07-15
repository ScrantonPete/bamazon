DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  position INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  departmen_ID INT NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  sales INT NOT NULL,
  overhead_costs INT NOT NULL,
  PRIMARY KEY (position)
);

SELECT * FROM products;


