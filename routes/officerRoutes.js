const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAssignedComplaints, updateComplaintStatus } = require('../controllers/officerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const fs = require('fs');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.get('/complaints', protect, authorize('officer'), getAssignedComplaints);
router.put('/update-status', protect, authorize('officer'), upload.single('proof'), updateComplaintStatus);
router.post('/upload-proof', protect, authorize('officer'), upload.single('proof'), (req, res) => {
    // This endpoint was in requirements, but update-status logic handles it too. 
    // "Upload proof of work (image)" implies it might be separate or part of update. 
    // The user requirement says: "6. Officer updates status and uploads proof".
    // I bundled it in update-status. I'll keep this separate route just in case or for simple upload.
    res.send(`/${req.file.path}`);
}); // Optional, but bundled is better.

module.exports = router;
