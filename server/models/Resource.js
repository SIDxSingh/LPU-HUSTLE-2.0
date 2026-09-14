const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a resource title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a resource description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Please specify the academic subject / course code'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Please specify the semester'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    type: {
      type: String,
      required: [true, 'Please select the resource type'],
      enum: ['Notes', 'PYQ', 'Assignment', 'Study Material', 'Other'],
      default: 'Notes',
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileType: {
      type: String,
      default: 'pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    originalFileName: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering
resourceSchema.index({ status: 1, semester: 1, subject: 1 });
resourceSchema.index({ status: 1, type: 1 });
resourceSchema.index({ status: 1, createdAt: -1 });
resourceSchema.index({ status: 1, downloads: -1 });
resourceSchema.index({ title: 'text', subject: 'text', description: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
