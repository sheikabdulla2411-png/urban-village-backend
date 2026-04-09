const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// @desc    Get all resolved complaints with images
// @route   GET /api/public/resolved-complaints
// @access  Public
router.get('/resolved-complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find({ status: 'Resolved', proofImage: { $ne: null } })
            .select('title description location proofImage updatedAt')
            .sort({ updatedAt: -1 })
            .limit(6);
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
