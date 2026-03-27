const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// Get student certificates
router.get('/student/:studentId', async (req, res) => {
    try {
        const certificates = await Certificate.find({ 
            studentId: req.params.studentId 
        }).sort({ issueDate: -1 });
        
        res.json(certificates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;