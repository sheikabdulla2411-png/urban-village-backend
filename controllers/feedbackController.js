const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// @desc    Submit feedback for a resolved complaint
// @route   POST /api/feedback
// @access  Private (User)
const submitFeedback = async (req, res) => {
    const { complaintId, rating, comment } = req.body;

    try {
        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaint.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to give feedback on this complaint' });
        }

        if (complaint.status !== 'Resolved') {
            return res.status(400).json({ message: 'Complaint must be resolved to submit feedback' });
        }

        const feedback = await Feedback.create({
            complaintId,
            userId: req.user._id,
            rating,
            comment,
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitFeedback };
