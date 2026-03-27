const express = require('express'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const cors = require('cors'); 
require('dotenv').config(); 
 
const app = express(); 
const PORT = 5000; 
 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
 
const JWT_SECRET = 'your_secret_key_here'; 
 
let users = [{ 
    id: 1, 
    studentId: 'STU001', 
    email: 'student@example.com', 
    password: 'password123', 
    role: 'student', 
    name: 'John Doe' 
