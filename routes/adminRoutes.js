const express = require('express');
const router = express.Router();
const { createOfficer, getAllUsers, getAllComplaints, assignComplaint } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/create-officer', protect, authorize('admin'), createOfficer);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/complaints', protect, authorize('admin'), getAllComplaints);
router.put('/assign-complaint', protect, authorize('admin'), assignComplaint);

module.exports = router;
