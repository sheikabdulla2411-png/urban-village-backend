const Complaint = require('../models/Complaint');
const sendEmail = require('../utils/sendEmail');

// @desc    Get complaints assigned to officer
// @route   GET /api/officer/complaints
// @access  Private (Officer)
const getAssignedComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ officerId: req.user._id }).populate('userId', 'name email phone');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status and proof
// @route   PUT /api/officer/update-status
// @access  Private (Officer)
const updateComplaintStatus = async (req, res) => {
    console.log('Update Status Request Body:', req.body);
    console.log('Update Status Request File:', req.file);
    const { complaintId, status } = req.body;
    const proofImage = req.file ? req.file.path : null;

    try {
        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaint.officerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this complaint' });
        }

        complaint.status = status || complaint.status;
        if (proofImage) {
            complaint.proofImage = proofImage;
        }

        const updatedComplaint = await complaint.save();
        console.log('Complaint saved with new status:', updatedComplaint.status);

        // Send email notification
        try {
            const populatedComplaint = await Complaint.findById(updatedComplaint._id).populate('userId', 'email name');
            if (populatedComplaint.userId && populatedComplaint.userId.email) {
                const message = `Hello ${populatedComplaint.userId.name},\n\nThe status of your complaint "${populatedComplaint.title}" has been updated to: ${status}.\n\nThank you,\nVillage Grievance System`;
                await sendEmail({
                    email: populatedComplaint.userId.email,
                    subject: 'Complaint Status Update',
                    message,
                });
            }
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Don't fail the request if email fails
        }

        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAssignedComplaints, updateComplaintStatus };
