const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[Cloudinary] Configured successfully with cloud:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('[Cloudinary] Credentials not set or placeholder. Operating in local storage mode.');
}

/**
 * Upload a file to Cloudinary or fallback to local uploads directory
 * @param {Object} file - Multer file object
 * @param {String} folder - Destination folder
 * @returns {Promise<{ url: String, publicId: String }>}
 */
const uploadResourceFile = async (file, folder = 'lpuhustle_resources') => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder,
        resource_type: 'auto',
      };

      // Multer memoryStorage or diskStorage
      if (file.path) {
        cloudinary.uploader.upload(file.path, uploadOptions, (error, result) => {
          // Cleanup local temp file if exists
          try {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          } catch (cleanupErr) {
            console.warn('Could not clean up temp file:', cleanupErr.message);
          }

          if (error) return reject(error);
          return resolve({
            url: result.secure_url || result.url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });
        });
      } else if (file.buffer) {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) return reject(error);
          return resolve({
            url: result.secure_url || result.url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });
        });
        stream.end(file.buffer);
      } else {
        reject(new Error('Invalid file payload for Cloudinary upload'));
      }
    });
  }

  // Fallback: Local file serving
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileExt = path.extname(file.originalname) || '.pdf';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
  const targetPath = path.join(uploadsDir, fileName);

  if (file.path) {
    fs.copyFileSync(file.path, targetPath);
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch (_) {}
  } else if (file.buffer) {
    fs.writeFileSync(targetPath, file.buffer);
  }

  const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  const localUrl = `${serverUrl}/uploads/${fileName}`;

  return {
    url: localUrl,
    publicId: `local_${fileName}`,
    bytes: file.size,
    format: fileExt.replace('.', ''),
  };
};

/**
 * Delete a file from Cloudinary or local storage
 * @param {String} publicId
 */
const deleteResourceFile = async (publicId) => {
  if (!publicId) return;

  if (isCloudinaryConfigured && !publicId.startsWith('local_')) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      await cloudinary.uploader.destroy(publicId); // also try default
    } catch (err) {
      console.warn('[Cloudinary] Error deleting file:', err.message);
    }
  } else if (publicId.startsWith('local_')) {
    const fileName = publicId.replace('local_', '');
    const targetPath = path.join(__dirname, '..', 'uploads', fileName);
    try {
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
    } catch (err) {
      console.warn('[Storage] Error deleting local file:', err.message);
    }
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadResourceFile,
  deleteResourceFile,
};
