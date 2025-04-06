
const { app, authenticateToken } = require('../server');

// Mock Payment Model
const Payment = require('mongoose').model('Payment', new require('mongoose').Schema({
    userId: String,
    driverId: String,
    amount: Number,
    status: String,
    timestamp: { type: Date, default: Date.now }
}));

// Process Payment
app.post('/api/payment', authenticateToken, async (req, res) => {
    const { driverId, amount } = req.body;
    
    try {
        const payment = new Payment({
            userId: req.user.id,
            driverId,
            amount,
            status: 'pending'
        });

        await payment.save();
        
        // Simulate payment processing
        setTimeout(async () => {
            payment.status = 'completed';
            await payment.save();
        }, 2000);

        res.json({ message: 'Payment processing', paymentId: payment._id });
    } catch (err) {
        res.status(500).json({ message: 'Payment error' });
    }
});

// Get Payment Status
app.get('/api/payment/:id', authenticateToken, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
