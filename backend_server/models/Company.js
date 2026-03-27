const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: String,
    description: String,
    website: String,
    industry: String,
    
    // Eligibility Criteria
    eligibility: {
        minCgpa: {
            type: Number,
            default: 7.0
        },
        allowedBranches: [{
            type: String,
            enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'ALL']
        }],
        maxBacklogs: {
            type: Number,
            default: 0
        },
        allowedYears: [{
            type: String,
            enum: ['2025', '2026', '2027']
        }]
    },
    
    // Job Details
    jobProfile: String,
    jobDescription: String,
    package: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'INR'
        }
    },
    location: String,
    
    // Skills Required
    skillsRequired: [{
        skill: String,
        category: {
            type: String,
            enum: ['technical', 'soft', 'domain']
        },
        importance: {
            type: String,
            enum: ['mandatory', 'preferred', 'bonus']
        }
    }],
    
    // Selection Process
    selectionProcess: [{
        stage: String,
        description: String,
        date: Date
    }],
    
    // Dates
    registrationDeadline: Date,
    testDate: Date,
    interviewDate: Date,
    
    // Status
    status: {
        type: String,
        enum: ['upcoming', 'open', 'closed', 'completed'],
        default: 'upcoming'
    },
    
    // Applications
    applications: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        appliedDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected', 'selected', 'waiting'],
            default: 'applied'
        },
        testScore: Number,
        interviewScore: Number,
        feedback: String
    }],
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Company', CompanySchema);