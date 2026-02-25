// Import the express module
import express from 'express';

// Create an instance of an express application
const app = express();

//Define a port number where our server will listen
const PORT = 3006; 

app.use(express.static('public'));

// Define our main route ('/')
app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Start server and listed on the specified port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});