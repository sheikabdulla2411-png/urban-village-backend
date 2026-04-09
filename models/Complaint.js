const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proofImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
