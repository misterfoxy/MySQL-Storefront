CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INTEGER(10) NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES  (0,'Dove Shampoo', 'Cosmetics', 5.75, 500),
		(1,'Dove Conditioner', 'Cosmetics', 6.25, 627),
		(2,'Glad 12 Gal Trash Bags', 'Grocery', 5.99, 300),
		(3,'Brawny Paper Towels', 'Grocery', 4.25, 400),
		(4,'Granny Smith Apples', 'Produce', 0.35, 800),
		(5,'Chiquita Bannana', 'Produce', 0.20, 10000),
		(6,'Tropicana Orange Juice', 'Grocery', 4.45, 267),
		(7,'Horizon Organic Milk', 'Grocery', 4.50, 200),
		(8,'Huggies Diapers', 'Children', 2.75, 476),
		(9,'Charmin Toiler Paper', 'Grocery', 12.99, 575),
		(10,'Pampers Baby Wipes', 'Children', 1.50, 423),
		(11,'Yoga Mat', 'Sports', 12.75, 150),
		(12,'5lb Dumb bell', 'Sports', 7.99, 89),
		(13,'Tie Dye Shirt', 'Clothing', 5.55, 120),
		(14,'Nike Shorts', 'Clothing', 17.88, 250),
		(15,'Purina Cat Chow', 'Pet', 7.25, 157),
		(16,'Fancy Feast Wet Cat Food', 'Pet', 12.50, 163),
		(17,'Ibuprophen', 'Pharmacy', 4.95, 389),
		(18,'Band Aid', 'Pharmacy', 3.25, 550),
(19,'Ben & Jerry Ice Cream', 'Grocery', 3.25, 432);
