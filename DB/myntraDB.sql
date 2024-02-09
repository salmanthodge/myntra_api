create database myntradb;

use myntradb;
show tables;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(50) not null,
    is_active boolean,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(25) NOT NULL,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp
);

create table products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(50) not null,
    description varchar(100) not null,
    image varchar(255) not null,
    rating float default 0,
    price float not null,
    discount float,
    is_active boolean,
    type enum('Men','Women') not null,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp
);

create table sizes(
	size_id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(50),
    is_active boolean,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp
);

create table product_size(
	product_size_id INT PRIMARY KEY AUTO_INCREMENT,
	product_id INT,
    size_id INT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (size_id) REFERENCES sizes(size_id),
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp
    );
    
create table wishlist(
	wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    is_active boolean,
    quantity int,
    created_at datetime default current_timestamp,
    updated_at datetime on update current_timestamp
    );