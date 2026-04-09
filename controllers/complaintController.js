const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
const createComplaint = async (req, res) => {
    const { title, description, category, location } = req.body;

    try {
        const complaint = new Complaint({
            title,
            description,
            category,
            location,
            userId: req.user._id,
        });

        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user complaints
// @route   GET /api/complaints/my
// @access  Private (User)
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createComplaint, getMyComplaints };
