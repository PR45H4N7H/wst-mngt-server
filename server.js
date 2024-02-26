const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import JWT package

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://martinsmec6:prashanth@cluster0.x3ii5tn.mongodb.net")
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(() => {
        console.log('Error')
    });

const JWT_SECRET = '3n4npN@9s7$#jdm2*!sK)zdpw&NS!x*'; // Define your secret key

const ProjSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    weight: {
        type: Number,
        required: true
    },
    buyerName: {
        type: String
    },
    revenue: {
        type: Number
    },
    landfillFee: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Collection = new mongoose.model('Data', ProjSchema);

const AuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const CollectionAuth = new mongoose.model('Author', AuthSchema);

const ManagerAuthSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const CollectionManagerAuth = new mongoose.model('ManageAuthor', ManagerAuthSchema);

// Login route with JWT token generation
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await CollectionAuth.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET); // Generate JWT token
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Manager login route with JWT token generation
app.post('/api/manager', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await CollectionManagerAuth.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, JWT_SECRET); // Generate JWT token
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected route example with JWT verification middleware
// Protected route example with JWT verification middleware
app.post('/api/saveData', async (req, res) => {
    try {
        const data = req.body;
        const newData = await Collection.create(data);
        return res.status(200).json(newData);
    } catch (error) {
        console.error('Error saving data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Define route to fetch data
app.get('/api/data', async (req, res) => {
    try {
        const data = await Collection.find(); // Fetch all data from the collection
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/createEmployee', async (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body
    try {
        // Create a new document in the Author collection with the provided credentials
        const newEmployee = await CollectionAuth.create({ username, password });
        return res.status(201).json({ message: 'Employee created successfully', newEmployee });
    } catch (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/api/employees', async (req, res) => {
    try {
      const employees = await CollectionAuth.find({});
      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});



