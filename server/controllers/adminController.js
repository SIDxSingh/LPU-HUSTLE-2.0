const User = require('../models/User');
const Resource = require('../models/Resource');
const Report = require('../models/Report');
const { deleteResourceFile } = require('../config/cloudinary');

// @desc    Get system-wide analytics and moderation statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalResources,
      pendingResources,
      approvedResources,
      rejectedResources,
      downloadsAgg,
      totalReports,
    ] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments(),
      Resource.countDocuments({ status: 'pending' }),
      Resource.countDocuments({ status: 'approved' }),
      Resource.countDocuments({ status: 'rejected' }),
      Resource.aggregate([
        { $group: { _id: null, totalDownloads: { $sum: '$downloads' }, totalViews: { $sum: '$views' } } },
      ]),
      Report.countDocuments({ status: 'pending' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalResources,
        pendingResources,
        approvedResources,
        rejectedResources,
        totalDownloads: downloadsAgg[0] ? downloadsAgg[0].totalDownloads : 0,
        totalViews: downloadsAgg[0] ? downloadsAgg[0].totalViews : 0,
        totalReports,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pending resources awaiting moderation
// @route   GET /api/admin/resources/pending
// @access  Private/Admin
const getPendingResources = async (req, res, next) => {
  try {
    const pendingResources = await Resource.find({ status: 'pending' })
      .populate('uploadedBy', 'name email semester avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingResources.length,
      resources: pendingResources,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all resources for admin oversight (all statuses)
// @route   GET /api/admin/resources
// @access  Private/Admin
const getAllResources = async (req, res, next) => {
  try {
    const { status, search, semester } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (semester && semester !== 'all') {
      filter.semester = Number(semester);
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { subject: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const resources = await Resource.find(filter)
      .populate('uploadedBy', 'name email semester')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a pending resource
// @route   PATCH /api/admin/resources/:id/approve
// @access  Private/Admin
const approveResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    resource.status = 'approved';
    resource.rejectionReason = '';
    await resource.save();

    res.status(200).json({
      success: true,
      message: `Resource "${resource.title}" has been approved and published!`,
      resource,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a resource with reason
// @route   PATCH /api/admin/resources/:id/reject
// @access  Private/Admin
const rejectResource = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    resource.status = 'rejected';
    resource.rejectionReason = rejectionReason
      ? rejectionReason.trim()
      : 'Resource does not meet community guidelines or quality standards.';
    await resource.save();

    res.status(200).json({
      success: true,
      message: `Resource "${resource.title}" was marked as rejected.`,
      resource,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a resource permanently
// @route   DELETE /api/admin/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // Clean up file asset
    if (resource.publicId) {
      await deleteResourceFile(resource.publicId);
    }

    // Clean up associated reports
    await Report.deleteMany({ resource: resource._id });

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resource deleted permanently.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get list of all users and their contribution statistics
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsersList = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    // Aggregate contributions count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [uploadsCount, approvedCount] = await Promise.all([
          Resource.countDocuments({ uploadedBy: user._id }),
          Resource.countDocuments({ uploadedBy: user._id, status: 'approved' }),
        ]);

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          semester: user.semester,
          role: user.role,
          createdAt: user.createdAt,
          uploadsCount,
          approvedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reported resources
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReportsList = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('resource')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getPendingResources,
  getAllResources,
  approveResource,
  rejectResource,
  deleteResource,
  getUsersList,
  getReportsList,
};
