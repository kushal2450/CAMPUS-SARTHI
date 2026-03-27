const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Register
router.post('/register', [
    body('studentId').notEmpty().withMessage('Student ID is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { studentId, email, password, name, role, department, year, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ studentId }, { email }] });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this Student ID or Email' 
            });
        }

        // Create new user
        const user = new User({
            studentId,
            email,
            password,
            name,
            role: role || 'student',
            department,
            year,
            phone
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id, studentId: user.studentId, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                studentId: user.studentId,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login
router.post('/login', [
    body('studentId').notEmpty().withMessage('Student ID or Email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { studentId, password } = req.body;

        // Find user by studentId or email
        const user = await User.findOne({
            $or: [{ studentId }, { email: studentId }]
        });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, studentId: user.studentId, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                studentId: user.studentId,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                year: user.year
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

module.exports = router;