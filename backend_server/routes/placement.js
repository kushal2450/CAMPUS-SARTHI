const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all companies (with filters)
router.get('/companies', async (req, res) => {
    try {
        const { status, branch, minCgpa } = req.query;
        let query = {};
        
        if (status) query.status = status;
        
        const companies = await Company.find(query)
            .sort({ registrationDeadline: 1 });
        
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single company details
router.get('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check eligibility for a company
router.get('/companies/:id/eligibility/:studentId', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        const student = await StudentProfile.findOne({ 
            userId: req.params.studentId 
        });
        
        if (!company || !student) {
            return res.status(404).json({ message: 'Not found' });
        }
        
        // Check eligibility
        const eligibility = {
            cgpa: student.cgpa >= company.eligibility.minCgpa,
            branch: company.eligibility.allowedBranches.includes(student.branch) || 
                   company.eligibility.allowedBranches.includes('ALL'),
            backlogs: student.backlogs <= company.eligibility.maxBacklogs,
            year: company.eligibility.allowedYears.includes(student.graduationYear)
        };
        
        const isEligible = Object.values(eligibility).every(v => v === true);
        
        // Skill gap analysis
        const skillGap = company.skillsRequired.filter(cs => 
            !student.skills.some(ss => ss.name.toLowerCase() === cs.skill.toLowerCase())
        );
        
        res.json({
            isEligible,
            eligibility,
            skillGap,
            totalSkills: company.skillsRequired.length,
            skillsPossessed: company.skillsRequired.length - skillGap.length
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Apply to company
router.post('/companies/:id/apply', auth, async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        
        // Check if already applied
        const alreadyApplied = company.applications.some(
            app => app.studentId.toString() === req.user.id
        );
        
        if (alreadyApplied) {
            return res.status(400).json({ message: 'Already applied' });
        }
        
        // Add application
        company.applications.push({
            studentId: req.user.id,
            status: 'applied'
        });
        
        await company.save();
        
        // Update student profile
        await StudentProfile.findOneAndUpdate(
            { userId: req.user.id },
            {
                $push: {
                    appliedCompanies: {
                        companyId: company._id,
                        status: 'applied',
                        appliedDate: new Date()
                    }
                }
            }
        );
        
        res.json({ message: 'Applied successfully' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get student's placement analytics
router.get('/analytics/:studentId', async (req, res) => {
    try {
        const student = await StudentProfile.findOne({ 
            userId: req.params.studentId 
        });
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        // Get all companies
        const companies = await Company.find();
        
        // Calculate analytics
        const eligibleCompanies = companies.filter(company => {
            const cgpaOk = student.cgpa >= company.eligibility.minCgpa;
            const branchOk = company.eligibility.allowedBranches.includes(student.branch) ||
                           company.eligibility.allowedBranches.includes('ALL');
            const backlogOk = student.backlogs <= company.eligibility.maxBacklogs;
            return cgpaOk && branchOk && backlogOk;
        });
        
        // Skill analysis
        const allSkills = new Set();
        companies.forEach(c => {
            c.skillsRequired.forEach(s => allSkills.add(s.skill));
        });
        
        const requiredSkills = Array.from(allSkills);
        const possessedSkills = student.skills.map(s => s.name);
        const missingSkills = requiredSkills.filter(s => 
            !possessedSkills.includes(s)
        );
        
        res.json({
            studentInfo: {
                cgpa: student.cgpa,
                branch: student.branch,
                backlogs: student.backlogs,
                skills: student.skills
            },
            placementStats: {
                totalCompanies: companies.length,
                eligibleCompanies: eligibleCompanies.length,
                appliedCount: student.appliedCompanies.length,
                shortlistedCount: student.appliedCompanies.filter(
                    a => ['shortlisted', 'selected'].includes(a.status)
                ).length
            },
            skillAnalysis: {
                totalSkillsRequired: requiredSkills.length,
                skillsPossessed: possessedSkills.length,
                missingSkills: missingSkills.slice(0, 10), // Top 10 missing skills
                skillGapPercentage: ((requiredSkills.length - possessedSkills.length) / 
                                    requiredSkills.length * 100).toFixed(2)
            }
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get detailed analytics for student
router.get('/analytics/detailed/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        
        // Get student profile
        const student = await StudentProfile.findOne({ userId: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }
        
        // Get all companies
        const companies = await Company.find();
        
        // Calculate analytics
        const analytics = {
            studentInfo: {
                cgpa: student.cgpa,
                branch: student.branch,
                backlogs: student.backlogs,
                skills: student.skills
            },
            
            // Company statistics
            companyStats: {
                total: companies.length,
                byStatus: {
                    open: companies.filter(c => c.status === 'open').length,
                    upcoming: companies.filter(c => c.status === 'upcoming').length,
                    closed: companies.filter(c => c.status === 'closed').length
                },
                byPackage: {
                    high: companies.filter(c => (c.package?.min || 0) >= 20).length,
                    medium: companies.filter(c => (c.package?.min || 0) >= 10 && (c.package?.min || 0) < 20).length,
                    low: companies.filter(c => (c.package?.min || 0) < 10).length
                }
            },
            
            // Eligibility analysis
            eligibilityAnalysis: {
                eligibleCompanies: [],
                notEligibleCompanies: [],
                byReason: {
                    cgpa: 0,
                    branch: 0,
                    backlogs: 0,
                    year: 0
                }
            },
            
            // Skill analysis
            skillAnalysis: {
                allRequiredSkills: [],
                possessedSkills: student.skills.map(s => s.name),
                missingSkills: [],
                categoryWise: {
                    technical: { required: 0, possessed: 0 },
                    soft: { required: 0, possessed: 0 },
                    domain: { required: 0, possessed: 0 }
                }
            },
            
            // Application stats
            applicationStats: {
                applied: student.appliedCompanies?.length || 0,
                shortlisted: student.appliedCompanies?.filter(a => 
                    ['shortlisted', 'selected'].includes(a.status)
                ).length || 0,
                rejected: student.appliedCompanies?.filter(a => 
                    a.status === 'rejected'
                ).length || 0,
                waiting: student.appliedCompanies?.filter(a => 
                    a.status === 'waiting'
                ).length || 0
            },
            
            // Company recommendations
            recommendations: []
        };
        
        // Process each company
        const allSkills = new Set();
        const skillCategories = { technical: 0, soft: 0, domain: 0 };
        
        companies.forEach(company => {
            // Track all required skills
            company.skillsRequired?.forEach(s => {
                allSkills.add(s.skill);
                if (s.category) {
                    skillCategories[s.category] = (skillCategories[s.category] || 0) + 1;
                }
            });
            
            // Check eligibility
            const cgpaOk = student.cgpa >= (company.eligibility?.minCgpa || 0);
            const branchOk = company.eligibility?.allowedBranches?.includes(student.branch) || 
                           company.eligibility?.allowedBranches?.includes('ALL');
            const backlogOk = student.backlogs <= (company.eligibility?.maxBacklogs || 0);
            const yearOk = company.eligibility?.allowedYears?.includes(student.graduationYear);
            
            const isEligible = cgpaOk && branchOk && backlogOk && yearOk;
            
            if (isEligible) {
                analytics.eligibilityAnalysis.eligibleCompanies.push({
                    id: company._id,
                    name: company.name,
                    package: company.package,
                    deadline: company.registrationDeadline
                });
            } else {
                analytics.eligibilityAnalysis.notEligibleCompanies.push({
                    id: company._id,
                    name: company.name,
                    reasons: {
                        cgpa: !cgpaOk,
                        branch: !branchOk,
                        backlogs: !backlogOk,
                        year: !yearOk
                    }
                });
                
                // Count reasons
                if (!cgpaOk) analytics.eligibilityAnalysis.byReason.cgpa++;
                if (!branchOk) analytics.eligibilityAnalysis.byReason.branch++;
                if (!backlogOk) analytics.eligibilityAnalysis.byReason.backlogs++;
                if (!yearOk) analytics.eligibilityAnalysis.byReason.year++;
            }
            
            // Calculate skill match for eligible companies
            if (isEligible && company.skillsRequired) {
                const possessed = company.skillsRequired.filter(s => 
                    student.skills.some(ss => ss.name.toLowerCase() === s.skill.toLowerCase())
                ).length;
                
                analytics.recommendations.push({
                    id: company._id,
                    name: company.name,
                    package: company.package?.min || 0,
                    totalSkills: company.skillsRequired.length,
                    possessedSkills: possessed,
                    matchPercentage: (possessed / company.skillsRequired.length * 100).toFixed(1),
                    deadline: company.registrationDeadline
                });
            }
        });
        
        // Calculate skill analysis
        analytics.skillAnalysis.allRequiredSkills = Array.from(allSkills);
        analytics.skillAnalysis.missingSkills = analytics.skillAnalysis.allRequiredSkills.filter(
            skill => !student.skills.some(s => s.name === skill)
        );
        
        // Sort recommendations by match percentage
        analytics.recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        // Get top 5 recommendations
        analytics.recommendations = analytics.recommendations.slice(0, 5);
        
        res.json(analytics);
        
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;