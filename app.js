// Import the express module
import express from 'express';

// Create an instance of an express application
const app = express();

//Define a port number where our server will listen
const PORT = 3007; 

app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

const orders = [];

// Define our main route ('/')
app.get('/', (req, res) => {
    res.render('home');
});

// admin route ('/')
app.get('/admin', (req, res) => {
    res.render('admin', { orders });
});

// Define /sumbit-order route ('/')
app.post('/submit-order', (req, res) => {

    // create a json object to store the order data
    const order = {
        name: req.body.name,
        email: req.body.email,
        cone: req.body.cone,
        flavor: req.body.flavor,
        toppings: req.body.toppings ? req.body.toppings: "none",        
        comment: req.body.comment,
        timestamp: new Date()
    };

    // Add order object to orders array 
    orders.push(order);
    res.render('confirmation', { order });
});



// Start server and listed on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});