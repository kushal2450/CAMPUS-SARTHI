const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Academic Details
    cgpa: Number,
    backlogs: {
        type: Number,
        default: 0
    },
    branch: String,
    graduationYear: String,
    
    // Skills
    skills: [{
        name: String,
        category: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert']
        }
    }],
    
    // Resume
    resumeUrl: String,
    
    // Placements
    placementStatus: {
        type: String,
        enum: ['not_placed', 'partially_placed', 'placed', 'not_interested'],
        default: 'not_placed'
    },
    
    // Applied Companies
    appliedCompanies: [{
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        status: String,
        appliedDate: Date
    }],
    
    // Placement Analytics
    analytics: {
        eligibleCompanies: Number,
        appliedCount: Number,
        shortlistedCount: Number,
        rejectedCount: Number,
        selectedCount: Number
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);