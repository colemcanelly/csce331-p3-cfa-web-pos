-- Remove all previous tables
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS menu CASCADE;
DROP TABLE IF EXISTS supply CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS daily_inventory CASCADE;

-- This creates the tables we need and fills the with the generated data
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY, -- Autoincrementing PK
    permissions INT,            -- {0 => Customer, 1 => Server, 2 => Manager}
    user_email VARCHAR(255),
    user_pw VARCHAR(255),
    fname VARCHAR(255),
    lname VARCHAR(255),
    is_oauth BOOLEAN
);

CREATE TABLE menu (
    menu_item VARCHAR(255) PRIMARY KEY,
    menu_cat VARCHAR(255),
    combo BOOLEAN,
    food_price FLOAT,
    img VARCHAR(255)
);

CREATE TABLE supply (
    ingredient VARCHAR(255) PRIMARY KEY,
    threshold FLOAT,
    restock_quantity FLOAT
);

CREATE TABLE recipes (
    menu_item VARCHAR(255),
    ingredient VARCHAR(255),
    portion_count FLOAT,
    PRIMARY KEY (menu_item, ingredient),
    FOREIGN KEY (menu_item) REFERENCES menu(menu_item),
    FOREIGN KEY (ingredient) REFERENCES supply(ingredient)
);

-- REMOVE `order_num`
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,    -- Autoincrementing PK
    order_date DATE,
    order_time TIME,
    order_total FLOAT,              -- REDUNDANCY
    customer_fname VARCHAR(255),    -- change "name" -> "fname"
    order_creator INT,              -- who created the order
    FOREIGN KEY (order_creator) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_id INT,
    menu_item VARCHAR(255),
    menu_item_quantity INT,
    food_price FLOAT,               -- REDUNDACY
    PRIMARY KEY (order_id, menu_item),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (menu_item) REFERENCES menu(menu_item)
);

CREATE TABLE daily_inventory (
    entry_date DATE,
    ingredient VARCHAR(255),
    qty_sod FLOAT,
    qty_eod FLOAT,
    qty_new FLOAT,
    qty_sold FLOAT,
    PRIMARY KEY (entry_date, ingredient),
    FOREIGN KEY (ingredient) REFERENCES supply(ingredient)
);

-- Populate new tables with CSV's
\copy users from './csv/users.csv' CSV
\copy menu from './csv/menu.csv' CSV
\copy supply from './csv/supply.csv' CSV
\copy recipes from './csv/recipes.csv' CSV
\copy orders from './csv/orders.csv' CSV
\copy order_items from './csv/order_items.csv' CSV
\copy daily_inventory from './csv/daily_inventory.csv' CSV

-- Set the sequence value for entering new data
SELECT setval('orders_order_id_seq', (SELECT max(order_id) FROM orders));
SELECT setval('users_user_id_seq', (SELECT max(user_id) FROM users));

-- Get a list of customers that use OAuth2.0
CREATE OR REPLACE VIEW google_customers AS
SELECT user_id, permissions
FROM users
WHERE is_oauth = true;