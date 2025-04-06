
const { app } = require('../server');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key';

// Customer Login
app.post('/api/customer_login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'customer' });
        if (!user) return res.status(400).json({ message: 'Customer not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Driver Login
app.post('/api/driver_login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'driver' });
        if (!user) return res.status(400).json({ message: 'Driver not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// General Login (for login.html)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
        res.json({ token, userId: user._id, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
