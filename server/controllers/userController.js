const User = require('../models/User');
const Resource = require('../models/Resource');
const { deleteResourceFile } = require('../config/cloudinary');

// @desc    Get user profile with contribution statistics
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const [totalContributions, approved, pending, rejected, downloadsAgg] = await Promise.all([
      Resource.countDocuments({ uploadedBy: user._id }),
      Resource.countDocuments({ uploadedBy: user._id, status: 'approved' }),
      Resource.countDocuments({ uploadedBy: user._id, status: 'pending' }),
      Resource.countDocuments({ uploadedBy: user._id, status: 'rejected' }),
      Resource.aggregate([
        { $match: { uploadedBy: user._id } },
        { $group: { _id: null, totalDownloads: { $sum: '$downloads' }, totalViews: { $sum: '$views' } } },
      ]),
    ]);

    const stats = {
      totalContributions,
      approved,
      pending,
      rejected,
      totalDownloads: downloadsAgg[0] ? downloadsAgg[0].totalDownloads : 0,
      totalViews: downloadsAgg[0] ? downloadsAgg[0].totalViews : 0,
    };

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        semester: user.semester,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      stats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get resources uploaded by current user
// @route   GET /api/users/resources
// @access  Private
const getUserResources = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { uploadedBy: req.user._id };

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete own resource (if pending or rejected)
// @route   DELETE /api/users/resources/:id
// @access  Private
const deleteUserResource = async (req, res, next) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found or you do not have permission to delete it.',
      });
    }

    // Clean up file storage
    if (resource.publicId) {
      await deleteResourceFile(resource.publicId);
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resource removed successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile,
  getUserResources,
  deleteUserResource,
};
