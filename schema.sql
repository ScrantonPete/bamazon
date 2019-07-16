DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  position INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  department_ID INT NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  stock_quantity INT NOT NULL,
  sales INT NOT NULL,
  overhead_costs DECIMAL(7,2) NOT NULL,
  PRIMARY KEY (position)
);

SELECT * FROM products;

