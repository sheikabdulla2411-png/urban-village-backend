const express = require('express');
const router = express.Router();
const { createComplaint, getMyComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);

module.exports = router;
