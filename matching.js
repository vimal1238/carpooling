
const { app, authenticateToken } = require('../server');
const User = require('../models/User');

// Find Drivers
app.get('/api/find_drivers', authenticateToken, async (req, res) => {
    const { lat, lng, maxDistance = 5000 } = req.query; // Distance in meters
    
    try {
        const drivers = await User.find({
            role: 'driver',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseFloat(maxDistance)
                }
            }
        }).limit(10);

        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Find Customers
app.get('/api/find_customers', authenticateToken, async (req, res) => {
    const { lat, lng, maxDistance = 5000 } = req.query;
    
    try {
        const customers = await User.find({
            role: 'customer',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseFloat(maxDistance)
                }
            }
        }).limit(10);

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
