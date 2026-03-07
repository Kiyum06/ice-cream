// Import the express module
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// Load the environment variables from .env file
dotenv.config();

// Create an instance of an express application
const app = express();

//Define a port number where our server will listen
const PORT = 3007; 

app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

const orders = [];

// Create a database connection pool with multiple connections
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Database test route (for debugging)
app.get('/db-test', async (req, res) => {
    try {
  const orders = await pool.query('SELECT * FROM orders');
       res.send(orders[0]);
    } catch (err) {
       console.error('Database error:', err);
       res.status(500).send('Database error: ' + err.message);
    }
});

// Define our main route ('/')
app.get('/', (req, res) => {
    res.render('home');
});

// // admin route ('/')
// app.get('/admin', (req, res) => {
//     res.render('admin', { orders });
// });

// Display all orders

app.get('/admin', async (req, res) => {
    try {
        // Fetch all orders from database, newest first
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');  
        // Render the admin page
        res.render('admin', { orders });        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: ' + err.message);
    }
});

// // Define /sumbit-order route ('/')
// app.post('/submit-order', (req, res) => {

//     // create a json object to store the order data
//     const order = {
//         name: req.body.name,
//         email: req.body.email,
//         cone: req.body.cone,
//         flavor: req.body.flavor,
//         toppings: req.body.toppings ? req.body.toppings: "none",        
//         comment: req.body.comment,
//         timestamp: new Date()
//     };

//     // Add order object to orders array 
//     orders.push(order);
//     res.render('confirmation', { order });
// });

// Confirmation route - handles form submission
app.post('/submit-order', async (req, res) => {

    try {
        // Get form data from req.body
        const order = req.body;        

        order.timestamp = new Date();
        order.name = order.customer;

        // Log the order data (for debugging)
        console.log('New order submitted:', order);

        // Convert toppings array to comma-separated string 
        order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : ""; 

        // SQL INSERT query with placeholders to prevent SQL injection
        const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings) 
                     VALUES (?, ?, ?, ?, ?);`;

        // Parameters array must match the order of ? placeholders
        // Make sure your property names match your order names
        const params = [
            order.customer,
            order.email,
            order.flavor,
            order.cone,
            order.toppings
        ];
        // Execute the query and grab the primary key of the new row
        const result = await pool.execute(sql, params);
        console.log('Order saved with ID:', result[0].insertId);
        // Render confirmation page with the adoption data
        res.render('confirmation', { order });        
    } catch (err) {
        console.error('Error saving order:', err);
        res.status(500).send('Sorry, there was an error processing your order. Please try again.');
    }
});



// Start server and listed on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});