const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json());

//Connect to Database
const pool = new Pool({
    user: 'csce331_904_01_user',
    host: 'csce-315-db.engr.tamu.edu',
    database: 'csce331_904_01_p3_db',
    password: 'Boba5672',
    port: 5432,
});

//testing connection
app.get('/', (req, res) => {
    res.json("From backend please");
});

//get inventory and display
app.get('/api/inventory', (req, res) => {
    const sql = "SELECT * FROM inventory where active = true";
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result.rows);
    });
});

// inserting ingredients into inventory
app.post('/api/inventory', (req, res) => {
    const { ingredient, maxCapacity, currentCapacity } = req.body;
    if (!ingredient || !maxCapacity || !currentCapacity) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = "INSERT INTO inventory (ingredient, max_capacity, current_capacity, active) VALUES ($1, $2, $3, true)";
    const values = [ingredient, maxCapacity, currentCapacity];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Inventory item added successfully' });
    });
});

// update ingredients or other values in inventory
app.put('/api/inventory', (req, res) => {
    const { newIngredient, newMaxCapacity, newCurrentCapacity, ingredient_id } = req.body;
    console.log([newIngredient, newMaxCapacity, newCurrentCapacity, ingredient_id]);

    const sql = `UPDATE inventory 
        SET ingredient = '${newIngredient}', 
            max_capacity = ${newMaxCapacity}, 
            current_capacity = ${newCurrentCapacity} 
        WHERE ingredient_id = '${ingredient_id}'`;

    const values = [newIngredient, newMaxCapacity, newCurrentCapacity, ingredient_id];

    console.log('SQL Query:', sql, '\nParameters:', [newIngredient, newMaxCapacity, newCurrentCapacity, ingredient_id]);


    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Inventory item updated successfully' });
    });
});

// delete ingredient from inventory
app.delete('/api/inventory', async (req, res) => {
    try {
        const { itemName } = req.body;

        const sql = "UPDATE inventory SET active = false WHERE ingredient = $1;";
        const values = [itemName];
        console.log("hey", sql)
        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }

            res.status(200).json({ message: 'Inventory item deleted successfully', deletedItem: result.rows[0] });
        });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get and update product usage chart based on certain inputs
app.put('/api/productUsage', (req, res) => {
    const { startTime, endTime } = req.body;

    // Check if both startTime and endTime are provided
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required' });
    }
    else {
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        const sql = `
            SELECT ingredient, COUNT(*) AS total_used
            FROM (
            SELECT UNNEST(f.ingredients) AS ingredient
            FROM orderdetails o
            JOIN food f ON f.foodid = ANY(o.foodid)
            JOIN orderhistory oh ON o.orderid = oh.orderid
            WHERE oh.time >= '${startTime}' AND oh.time <= '${endTime}'
            ) AS expanded_ingredients
            GROUP BY ingredient
            ORDER BY total_used DESC
            `;

        console.log('SQL Query:', sql, 'Parameters:', [startTime, endTime]);

        pool.query(sql, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(result.rows);
        });
    }
});

// get and update common parings chart based on certain inputs
app.put('/api/commonPairings', (req, res) => {
    const { startTime, endTime } = req.body;

    // Check if both startTime and endTime are provided
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required' });
    } else {
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        const sql = `
        SELECT
        f.foodname AS food,
        d.producttype AS drink,
        COUNT(*) AS total_orders
    FROM
        orderdetails o
    JOIN
        UNNEST(o.foodid) AS food_id ON true
    JOIN
        UNNEST(o.drinkid) AS drink_id ON true
    JOIN
        food f ON f.foodid = food_id
    JOIN
        drink d ON d.drinkid = drink_id
    JOIN
        orderhistory oh ON o.orderid = oh.orderid
    WHERE
        oh.time >= '${startTime}' AND oh.time <= '${endTime}'
    GROUP BY
        f.foodname, d.producttype
    ORDER BY
        total_orders DESC;
    
            `;

        console.log('SQL Query:', sql);

        pool.query(sql, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(result.rows);
        });
    }
});

app.put('/api/restockReport', (req, res) => {
    const sql = `
        SELECT Ingredient, Max_Capacity, Current_Capacity, 
        CASE WHEN Current_Capacity < (0.20 * Max_Capacity) THEN 'Restock' ELSE 'Sufficient' END AS Status 
        FROM inventory 
        WHERE Current_Capacity < (0.20 * Max_Capacity) 
        ORDER BY Ingredient ASC;
    `;

    console.log('SQL Query for Restock Report:', sql);

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing restock report query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result.rows);
    });
});


app.put('/api/excessReport', (req, res) => {
    const { startTime } = req.body;

    // Check if startTime is provided
    if (!startTime) {
        return res.status(400).json({ error: 'Start time is required' });
    } else {
        console.log('Start Time:', startTime);

        const sql = `
        WITH ConsumedIngredients AS (
            SELECT UNNEST(F.ingredients) AS ingredient, COUNT(*) as usageCount
            FROM OrderDetails OD
            JOIN Food F ON F.foodid = ANY(OD.foodid)
            JOIN OrderHistory OH ON OH.orderid = OD.orderid
            WHERE OH.time BETWEEN '${startTime}' AND CURRENT_TIMESTAMP
            GROUP BY ingredient
        ), TotalInventory AS (
            SELECT ingredient, 1000 as totalStock
            FROM ConsumedIngredients
        )
        SELECT CI.ingredient, CI.usageCount, TI.totalStock
        FROM ConsumedIngredients CI
        JOIN TotalInventory TI ON CI.ingredient = TI.ingredient
        WHERE CI.usageCount < (TI.totalStock * 0.1);        
        `;

        console.log('SQL Query for Excess Report:', sql);

        // Assuming you have a configured pool from pg or similar database connection pool
        pool.query(sql, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(result.rows);
        });
    }
});

app.put('/api/salesReport', (req, res) => {
    const { startTime, endTime } = req.body;

    // Check if both startTime and endTime are provided
    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required' });
    } else {
        console.log('Start Time:', startTime);
        console.log('End Time:', endTime);

        const sql = `
            SELECT item, SUM(price) AS total_sales
            FROM (
                SELECT f.foodname AS item, f.price
                FROM orderdetails o
                JOIN food f ON f.foodid = ANY(o.foodid)
                JOIN orderhistory oh ON o.orderid = oh.orderid
                WHERE oh.time >= $1 AND oh.time <= $2
                UNION ALL
                SELECT d.producttype AS item, d.price
                FROM orderdetails o
                JOIN drink d ON d.drinkid = ANY(o.drinkid)
                JOIN orderhistory oh ON o.orderid = oh.orderid
                WHERE oh.time >= $1 AND oh.time <= $2
            ) AS expanded_items
            GROUP BY item
            ORDER BY total_sales DESC
        `;

        console.log('SQL Query:', sql, 'Parameters:', [startTime, endTime]);

        // Use parameterized query to prevent SQL injection
        pool.query(sql, [startTime, endTime, startTime, endTime], (err, result) => {
            if (err) {
                console.error('Error executing sales report query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(result.rows);
        });
    }
});

// select and display food items
app.get('/api/foodItems', (req, res) => {
    const { category, endTime } = req.query;

    const sql = "SELECT * FROM food";

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result.rows);
    });
});

// create food item
app.post('/api/food', (req, res) => {
    const { type, calories, ingredients, price, name, seasonalDate } = req.body;

    if (!type || !calories || !ingredients || !price || !name || !seasonalDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }


    let sql = "INSERT INTO food (producttype, timeid, calories, ingredients, price, foodname, seasonaldate) VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6)";
    const values = [type, calories, ingredients, price, name, seasonalDate < '2999-12-31' ? '2999-12-31' : seasonalDate];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Inventory item added successfully' });
    });
});

// create drink item
app.post('/api/drink', (req, res) => {
    const { calories, price, name, seasonalDate } = req.body;

    // Check if required fields are missing
    if (!calories || !price || !name || !seasonalDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the new drink item into the database
    const sql = "INSERT INTO drink (producttype, calories, price, seasonaldate) VALUES ($1, $2, $3, $4)";
    const values = [name, calories, price, seasonalDate < '2999-12-31' ? '2999-12-31' : seasonalDate];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Drink item added successfully' });
    });
});

// select and display drinks
app.get('/api/drinkItems', (req, res) => {
    const { category, endTime } = req.query;

    const sql = "SELECT * FROM drink";

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result.rows);
    });
});

// insert drink into drinks table
app.post('/api/drinkItems', (req, res) => {
    const { drinkid, producttype, calories, price, carbonation, temperature } = req.body;

    if (!drinkid || !producttype || !calories || !price || !carbonation || !temperature) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = "INSERT INTO drink (drinkid, producttype, calories, price, carbonation, temperature) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [drinkid, producttype, calories, price, carbonation, temperature];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Inventory item added successfully' });
    });
});

// create utensil item
app.post('/api/utensil', (req, res) => {
    const { producttype, nameid, quantity } = req.body;

    // Check if required fields are missing
    if (!producttype || !nameid || !quantity) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the new drink item into the database
    const sql = "INSERT INTO utensil (producttype, name_id, quantity) VALUES ($1, $2, $3)";
    const values = [producttype, nameid, quantity];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Drink item added successfully' });
    });
});

// select and display utensils
app.get('/api/utensilItems', (req, res) => {
    const { category, endTime } = req.query;

    const sql = "SELECT * FROM utensil";

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(result.rows);
    });
});

// insert utensil in table
app.post('/api/utensilItems', (req, res) => {
    const { utensilid, producttype, name_id, quantity } = req.body;

    if (!utensilid || !producttype || !name_id || !quantity) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = "INSERT INTO utensil (utensilid, producttype, name_id, quantity) VALUES ($1, $2, $3, $4)";
    const values = [utensilid, producttype, name_id, quantity];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Inventory item added successfully' });
    });
});

app.put('/api/utensil/:id', (req, res) => {

    const { producttype, name_id, quantity } = req.body;
    const utensilId = req.params.id;

    if (!producttype || !quantity) {
        return res.status(400).json({ error: 'Name and Amount are required fields' });
    }

    const sql = "UPDATE utensil SET producttype = $1, quantity = $2 WHERE utensilid = $3";
    const values = [producttype, quantity, utensilId];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Utensil updated successfully' });
    });
});

app.delete('/api/utensil/:id', async (req, res) => {
    try {
        const utensilId = req.params.id;

        const sql = "DELETE FROM utensil WHERE utensilid = $1";
        const values = [utensilId];

        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Utensil not found' });
            }

            res.status(200).json({ message: 'Utensil deleted successfully', deletedutensilId: utensilId });
        });
    } catch (error) {
        console.error('Error deleting utensil:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get products
app.get('/api/products', (req, res) => {
    const foodSql = `SELECT foodid AS itemid, producttype, timeid::varchar AS timeid, calories, ingredients, price, foodname, seasonaldate
    FROM food
    WHERE active = true;`;

    const drinkSql = `SELECT drinkid AS itemid, producttype, null::varchar AS timeid, calories, price, seasonaldate
    FROM drink
    WHERE active = true;`;

    const foodPromise = new Promise((resolve, reject) => {
        pool.query(foodSql, (err, result) => {
            if (err) {
                console.error('Error executing food query:', err);
                reject(err);
            }
            resolve(result.rows);
            // console.log("food", result.rows)
        });
    });

    const drinkPromise = new Promise((resolve, reject) => {
        pool.query(drinkSql, (err, result) => {
            if (err) {
                console.error('Error executing drink query:', err);
                reject(err);
            }
            resolve(result.rows);
        });
    });

    Promise.all([foodPromise, drinkPromise])
        .then(([foodResult, drinkResult]) => {
            const foodItems = foodResult.map(row => ({
                id: row.itemid,
                name: row.foodname,
                pic: '/' + row.foodname + '.jpg',
                price: row.price,
                description: `Calories: ${row.calories}, Ingredients: ${row.ingredients.join(', ')}`,
                food: true,
                seasonal: new Date(row.seasonaldate) < new Date('2999-01-01') // Compare dates after conversion
            }));

            const drinkItems = drinkResult.map(row => ({
                id: row.itemid,
                name: row.producttype,
                pic: '/' + row.producttype + '.jpg',
                price: row.price,
                description: `Calories: ${row.calories}`,
                food: false,
                seasonal: new Date(row.seasonaldate) < new Date('2999-01-01') // Compare dates after conversion
            }));


            const menuItems = [...foodItems, ...drinkItems];
            res.json(menuItems);
        })
        .catch(error => {
            console.error('Error fetching menu items:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});




app.put('/api/food/ingredients', (req, res) => {
    const { id, ingredients } = req.body;

    // Update the ingredients in the database for the specified food ID
    pool.query(`
        UPDATE food
        SET ingredients = $1
        WHERE foodid = $2
    `, [ingredients, id], (err, result) => {
        if (err) {
            console.error('Error updating ingredients:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Ingredients updated successfully' });
    });
});


// update products
app.put('/api/products', (req, res) => {
    const productId = req.params.productId;
    console.log("body", req.body)
    const item = req.body;

    let sql = "";
    let values = [];
    if (item.food) {
        sql = `
    UPDATE food
    SET foodname = $1, price = $2
    WHERE foodid = $3`; // Adjust the placeholder to $3
    } else {
        sql = `
    UPDATE drink
    SET producttype = $1, price = $2
    WHERE drinkid = $3`; // Adjust the placeholder to $3
    }

    values = [item.name, item.price, item.id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Product updated successfully' });
    });
});

// delete products
app.delete('/api/products', (req, res) => {
    const { id, food } = req.body;
    console.log("id", id, "food", food)
    let sql = "";
    let values = [];

    // Determine whether the product is a food or drink based on request body
    if (food) {
        sql = `
            UPDATE food
            SET active = false
            WHERE foodid = $1`; // Adjust the placeholder to $1
    } else {
        sql = `
            UPDATE drink
            SET active = false
            WHERE drinkid = $1`; // Adjust the placeholder to $1
    }
    values = [id];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log("result", result)
        res.json({ message: 'Product deleted successfully' });
    });
});



app.get('/api/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing employee query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(result.rows);
    });
});

app.post('/api/employee', (req, res) => {
    const { name, contactinfo, role } = req.body;
    if (!name || !role) {
        return res.status(400).json({ error: 'Name and role are required fields' });
    }

    const sql = "INSERT INTO employee (name, contactinfo, role) VALUES ($1, $2, $3)";
    const values = [name, contactinfo, role];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Employee added successfully' });
    });
});

app.put('/api/employee/:id', (req, res) => {
    const { name, contactinfo, role } = req.body;
    const employeeId = req.params.id;

    if (!name || !role) {
        return res.status(400).json({ error: 'Name and role are required fields' });
    }

    const sql = "UPDATE employee SET name = $1, contactinfo = $2, role = $3 WHERE employeeid = $4";
    const values = [name, contactinfo, role, employeeId];

    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Employee updated successfully' });
    });
});

app.delete('/api/employee/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;

        const sql = "DELETE FROM employee WHERE employeeid = $1";
        const values = [employeeId];

        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            res.status(200).json({ message: 'Employee deleted successfully', deletedEmployeeId: employeeId });
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/orders/:orderId/complete', async (req, res) => {
    const orderId = req.params.orderId;
    try {
        // Execute SQL update statement to set iscomplete to true for the given order ID
        const sql = 'UPDATE orderhistory SET iscomplete = true WHERE orderID = $1';
        await pool.query(sql, [orderId]);
        res.json({ success: true, message: 'Order completed successfully' });
    } catch (error) {
        console.error('Error completing order:', error);
        res.status(500).json({ success: false, message: 'Failed to complete order' });
    }
});

// get user thru email
app.put('/api/users', async (req, res) => {
    const userEmail = req.body.email;
    console.log("email", userEmail)
    try {
        // Check if there is a user with the given email
        const existingUser = await pool.query('SELECT role FROM employee WHERE contactinfo = $1', [userEmail]);
        if (existingUser.rows.length > 0) {
            // If user exists, return the user's role
            res.json({ role: existingUser.rows[0].role });
        } else {
            // console.log("hello")
            // If user does not exist, insert the user with the "customer" role
            await pool.query('INSERT INTO employee (contactinfo, role, name) VALUES ($1, $2, $3)', [userEmail, 'customer', "John Doe"]);
            res.json({ role: 'customer' });
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user role' });
    }
});

// submit order
app.post('/api/orders', async (req, res) => {
    const { cart } = req.body;
    try {
        let totalPrice = 0;

        // Calculate total price
        cart.forEach(cartItem => {
            totalPrice += cartItem.quantity * cartItem.item.price;
        });
        // ! FIX WHEN WE HAVE ACTUAL EMPLOYEE VALUES
        let userId = 1;
        // Insert order into orderhistory table
        const orderInsertQuery = 'INSERT INTO orderhistory (userid, time, totalPrice) VALUES ($1, $2, $3) RETURNING orderid';
        const orderInsertValues = [userId, new Date(), totalPrice]; // You need to define userId
        const orderInsertResult = await pool.query(orderInsertQuery, orderInsertValues);
        const orderId = orderInsertResult.rows[0].orderid;
        // Insert each product into order details table
        const orderDetailInsertQuery = `
        INSERT INTO orderdetails (orderid, foodid, drinkid, utensilid) 
        VALUES ($1, $2, $3, $4)
        `;

        // Construct arrays for foodIDs and drinkIDs from the cart items
        const foodIDs = cart.map(cartItem => cartItem.item.food ? cartItem.item.id : null);
        const drinkIDs = cart.map(cartItem => cartItem.item.food ? null : cartItem.item.id);
        // console.log("orderID", orderId)
        // console.log("foodIDs", foodIDs)
        // console.log("drinkIDs", drinkIDs)

        // Execute the query with the arrays of foodIDs and drinkIDs
        const orderDetailValues = [orderId, foodIDs, drinkIDs, null];
        await pool.query(orderDetailInsertQuery, orderDetailValues);

        res.json({ success: true, message: 'Order completed successfully' });
    } catch (error) {
        console.error('Error completing order:', error);
        res.status(500).json({ success: false, message: 'Failed to complete order' });
    }
});



app.get('/api/orders', (req, res) => {
    const sql = `
    (
        SELECT oh.orderID AS id, oh.time, f.foodname AS name
        FROM OrderHistory AS oh
        LEFT JOIN OrderDetails AS od ON oh.orderID = od.orderID
        LEFT JOIN LATERAL unnest(od.foodID) AS food_id ON true
        LEFT JOIN Food AS f ON food_id = f.foodID
        WHERE oh.iscomplete = false -- Add condition for completed orders
        UNION
        SELECT oh.orderID AS id, oh.time, d.productType AS name
        FROM OrderHistory AS oh
        LEFT JOIN OrderDetails AS od ON oh.orderID = od.orderID
        LEFT JOIN LATERAL unnest(od.drinkID) AS drink_id ON true
        LEFT JOIN Drink AS d ON drink_id = d.drinkID
        WHERE oh.iscomplete = false -- Add condition for completed orders
      )
    `;

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const orders = [];
        let currentOrder;
        let processedOrders = 0; // Track the number of processed orders

        for (const row of result.rows) {
            if (processedOrders >= 20) { // Stop processing if 20 orders have been collected
                break;
            }

            if (!currentOrder || currentOrder.id !== row.id) {
                if (currentOrder) {
                    orders.push(currentOrder);
                    processedOrders++; // Increment processed orders
                }
                currentOrder = {
                    id: row.id,
                    products: [{ name: row.name, quantity: 1 }], // Default quantity is set to 1
                    complete: false,
                    time: row.time
                };
            } else {
                currentOrder.products.push({ name: row.name, quantity: 1 }); // Default quantity is set to 1
            }
        }
        if (currentOrder) {
            orders.push(currentOrder);
            processedOrders++; // Increment processed orders
        }
        res.json(orders);
    });
});



const PORT = 8081;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };