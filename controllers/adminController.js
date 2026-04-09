const User = require('../models/User');
const Complaint = require('../models/Complaint');
const bcrypt = require('bcryptjs');

// @desc    Create a new officer
// @route   POST /api/admin/create-officer
// @access  Private (Admin)
const createOfficer = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'officer',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid officer data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (citizens and officers)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).populate('userId', 'name email').populate('officerId', 'name');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign complaint to officer
// @route   PUT /api/admin/assign-complaint
// @access  Private (Admin)
const assignComplaint = async (req, res) => {
    const { complaintId, officerId } = req.body;

    try {
        const complaint = await Complaint.findById(complaintId);

        if (complaint) {
            complaint.officerId = officerId;
            complaint.status = 'In Progress'; // Auto update status to In Progress or keep Pending? Requirement says "Admin assigns officer". Usually implies In Progress or Assigned.
            // Requirement says: 5. Admin assigns officer. 6. Officer updates status.
            // Let's keep it 'In Progress' for clarity, or just 'Pending' until Officer picks it up.
            // User request: "3. Complaint status = Pending. 5. Admin assigns officer. 6. Officer updates status -> In Progress/Resolved"
            // Wait, "6. Officer updates status ... 7. Status becomes Resolved".
            // Let's just assign the officer and optionally set status to In Progress if not already.

            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOfficer, getAllUsers, getAllComplaints, assignComplaint };
