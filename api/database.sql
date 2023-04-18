-- TODO: Get Newest Inventory
SELECT entry_date, ingredient, qty_eod FROM daily_inventory WHERE entry_date = (SELECT max(entry_date) FROM daily_inventory);

-- TODO: Get Restock Report
SELECT
today.ingredient AS ingredient,
today.qty_curr AS quantity,
supply.threshold AS threshold
FROM (
SELECT DISTINCT ON (ingredient)
ingredient,
qty_eod AS qty_curr
FROM daily_inventory
ORDER  BY ingredient, entry_date DESC) AS today
INNER JOIN supply ON today.ingredient = supply.ingredient AND supply.threshold >= today.qty_curr;

-- TODO: Get Exess Report 
-- entry date is passed in, needs to be a variable
WITH cte AS (
    SELECT 
        ingredient, 
        qty_sod, 
        SUM(qty_sold) as total_qty_sold, 
        ((qty_sod - SUM(qty_sold))/qty_sod)*100 as percentage_diff
    FROM 
        daily_inventory
    WHERE 
        entry_date >= 'YYYY-MM-DD'
    GROUP BY 
        ingredient, qty_sod
)
SELECT 
    ingredient, 
    qty_sod, 
    total_qty_sold, 
    percentage_diff
FROM 
    cte
WHERE 
    percentage_diff > 10;

-- TODO: Implement Sales Report
-- Need Start and End Date Passed in, as well as Start and End Time
SELECT 
    COALESCE(menu.menu_item, 'Total') AS menu_item, 
    COALESCE(SUM(order_items.menu_item_quantity * order_items.food_price), 0) AS total_revenue 
FROM 
    orders 
    JOIN menu ON 1=1 
    LEFT JOIN order_items ON orders.order_id = order_items.order_id AND menu.menu_item = order_items.menu_item 
WHERE 
    orders.order_date BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD' 
    AND orders.order_time BETWEEN 'HH:MI:SS' AND 'HH:MI:SS' 
GROUP BY 
    ROLLUP(menu.menu_item);

-- New Order
-- CHANGE THE INPUTS
String order_query = String.format("INSERT INTO orders VALUES ((SELECT nextval('orders_order_id_seq')), %d, '%s', '%s', %f, '%s', %d);", order_num, date.toString(), time.toString(), order_total, customer_name, kiosk_id);
String query_order_id = "SELECT max(order_id) FROM orders;";
String order_item_query = String.format("INSERT INTO order_items VALUES (%d, '%s', %d, %f);", order_id, item_name, 1, food_price);
String order_item_query = String.format("INSERT INTO order_items VALUES (%d, '%s', %d, %f);", order_id, item_name, 1, food_price);





    public boolean newOrder(ArrayList<String> ordered_items, String customer_name, int kiosk_id, int order_num)
    {
        // Insert a new order without totaling the order for time complexity
        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.now();
        Double order_total = 0.0;
        String order_query = String.format("INSERT INTO orders VALUES ((SELECT nextval('orders_order_id_seq')), %d, '%s', '%s', %f, '%s', %d);", order_num, date.toString(), time.toString(), order_total, customer_name, kiosk_id);
        if (psql.query(order_query) < 0) {
            System.out.println("Error inserting order");
            System.out.println(order_query);
            return false;
        }
        // Query the order id of the new order that was just created
        String query_order_id = "SELECT max(order_id) FROM orders;";
        int order_id = -1;
        try {
            ResultSet res = psql.select(query_order_id);
            res.next();
            System.out.println(res.getString("max"));
            order_id = res.getInt("max");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error getting order id for order item");
            return false;
        }
        // Create order_item entries for each, using the order_id from the original order, while calculating the order total
        for (String item_name : ordered_items) {
            Double food_price = Double.parseDouble(get(Table.MENU).get(item_name).get("food_price"));
            order_total += food_price;
            String order_item_query = String.format("INSERT INTO order_items VALUES (%d, '%s', %d, %f);", order_id, item_name, 1, food_price);
            System.out.println(order_item_query);
            if (psql.query(order_item_query) < 0) {
                System.out.println("Error inserting order item");
                return false;
            }
            // update menu_item_quantity
        }
        // Update the original order with the calculated order total
        String update_order = String.format("UPDATE orders SET order_total = %f WHERE order_id = %d;",order_total, order_id);
        if (psql.query(update_order) != 1) {
            System.out.println(String.format("Incomplete record where order_id = %d", order_id));
            return false;
        }
        return true;
    }