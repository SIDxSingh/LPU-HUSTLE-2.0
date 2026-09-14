const Resource = require('../models/Resource');
const Report = require('../models/Report');
const { uploadResourceFile, deleteResourceFile } = require('../config/cloudinary');
const path = require('path');

// @desc    Get all approved resources with search, filtering, and pagination
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
  try {
    const {
      search,
      semester,
      subject,
      type,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'approved' };

    // Semester filter
    if (semester && semester !== 'all') {
      const semNum = Number(semester);
      if (!isNaN(semNum) && semNum >= 1 && semNum <= 8) {
        query.semester = semNum;
      }
    }

    // Subject filter
    if (subject && subject !== 'all') {
      query.subject = { $regex: new RegExp(`^${subject.trim()}$`, 'i') };
    }

    // Type filter
    if (type && type !== 'all') {
      query.type = type;
    }

    // Keyword search across title, subject, and description
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { subject: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Sorting
    let sortCriteria = { createdAt: -1 };
    if (sort === 'popular') {
      sortCriteria = { downloads: -1, views: -1 };
    } else if (sort === 'oldest') {
      sortCriteria = { createdAt: 1 };
    } else if (sort === 'title') {
      sortCriteria = { title: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [resources, totalCount] = await Promise.all([
      Resource.find(query)
        .populate('uploadedBy', 'name semester avatar')
        .sort(sortCriteria)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Resource.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: resources.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      resources,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'uploadedBy',
      'name email semester avatar'
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // If resource is not approved, only the author or an admin may view it
    if (resource.status !== 'approved') {
      const isAuthor = req.user && req.user._id.toString() === resource.uploadedBy._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isAuthor && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'This resource is pending approval or has been restricted.',
        });
      }
    }

    // Increment view counter asynchronously
    resource.views += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      resource,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload & submit a new academic resource (creates pending submission)
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res, next) => {
  try {
    const { title, description, subject, semester, type } = req.body;

    if (!title || !description || !subject || !semester || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, subject, semester, and type.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file or document to upload.',
      });
    }

    // Upload file to Cloudinary or local fallback
    const uploadResult = await uploadResourceFile(req.file);

    // Determine extension/type
    const ext = (path.extname(req.file.originalname) || '').toLowerCase().replace('.', '');
    let fileType = 'pdf';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      fileType = 'image';
    } else if (['doc', 'docx'].includes(ext)) {
      fileType = 'doc';
    } else if (['ppt', 'pptx'].includes(ext)) {
      fileType = 'ppt';
    }

    const resource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      semester: Number(semester),
      type,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId || '',
      fileType,
      fileSize: uploadResult.bytes || req.file.size,
      originalFileName: req.file.originalname,
      uploadedBy: req.user._id,
      status: 'pending', // Moderation workflow requirement
    });

    res.status(201).json({
      success: true,
      message: 'Resource submitted successfully and is awaiting admin approval.',
      resource,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Record download and return file URL
// @route   GET /api/resources/:id/download
// @access  Public
const downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    resource.downloads += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      downloadUrl: resource.fileUrl,
      fileName: resource.originalFileName || `${resource.title}.${resource.fileType || 'pdf'}`,
      downloads: resource.downloads,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Report an inappropriate or broken resource
// @route   POST /api/resources/:id/report
// @access  Private
const reportResource = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for the report.',
      });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    await Report.create({
      resource: resource._id,
      reportedBy: req.user._id,
      reason: reason.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. The report has been submitted to the moderation team.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured resources (popular and recent) for home page
// @route   GET /api/resources/featured
// @access  Public
const getFeaturedResources = async (req, res, next) => {
  try {
    const [popular, recent] = await Promise.all([
      Resource.find({ status: 'approved' })
        .populate('uploadedBy', 'name semester avatar')
        .sort({ downloads: -1, views: -1 })
        .limit(6)
        .lean(),
      Resource.find({ status: 'approved' })
        .populate('uploadedBy', 'name semester avatar')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      popular,
      recent,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get breakdown summary of subjects and resources by semester (1 to 8)
// @route   GET /api/resources/semesters-summary
// @access  Public
const getSemestersSummary = async (req, res, next) => {
  try {
    const summary = await Resource.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$semester',
          totalResources: { $sum: 1 },
          subjects: { $addToSet: '$subject' },
          totalDownloads: { $sum: '$downloads' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build 1 through 8 lookup
    const semesters = [];
    for (let i = 1; i <= 8; i++) {
      const found = summary.find((s) => s._id === i);
      semesters.push({
        semester: i,
        totalResources: found ? found.totalResources : 0,
        subjectsCount: found ? found.subjects.length : 0,
        subjects: found ? found.subjects : [],
        totalDownloads: found ? found.totalDownloads : 0,
      });
    }

    res.status(200).json({
      success: true,
      semesters,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get list of unique subjects with their counts
// @route   GET /api/resources/subjects
// @access  Public
const getSubjectsList = async (req, res, next) => {
  try {
    const { semester } = req.query;
    const match = { status: 'approved' };
    if (semester && semester !== 'all') {
      match.semester = Number(semester);
    }

    const subjects = await Resource.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$subject',
          semester: { $first: '$semester' },
          count: { $sum: 1 },
          types: { $addToSet: '$type' },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      subjects: subjects.map((s) => ({
        name: s._id,
        semester: s.semester,
        count: s.count,
        types: s.types,
      })),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  downloadResource,
  reportResource,
  getFeaturedResources,
  getSemestersSummary,
  getSubjectsList,
};
