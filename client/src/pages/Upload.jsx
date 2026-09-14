import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  X,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { resourceService } from '../services/resourceService';
import { useToast } from '../context/ToastContext';
import { SEMESTERS, RESOURCE_TYPES, POPULAR_SUBJECTS } from '../utils/constants';
import { formatFileSize } from '../utils/formatters';

export const Upload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    semester: searchParams.get('semester') || '5',
    subject: searchParams.get('subject') || '',
    type: searchParams.get('type') || 'Notes',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Check size limit (15MB)
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg('File size exceeds the 15MB limit. Please upload a smaller file.');
      return;
    }

    // Check extension
    const allowed = /\.(pdf|doc|docx|ppt|pptx|jpg|jpeg|png|webp)$/i;
    if (!allowed.test(file.name)) {
      setErrorMsg('Invalid format. Accepted: PDF, DOCX, PPTX, JPG, PNG, WEBP.');
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.subject.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!selectedFile) {
      setErrorMsg('Please attach a study document or image file.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('semester', formData.semester);
      data.append('subject', formData.subject.trim());
      data.append('type', formData.type);
      data.append('file', selectedFile);

      const res = await resourceService.uploadResource(data, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      showToast(
        res.message || 'Resource submitted successfully and is awaiting admin approval.',
        'success',
        6000
      );

      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'File upload failed. Please try again.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
        {/* Title & Moderation Info Banner */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-2">
            <UploadCloud className="w-4 h-4" />
            <span>Community Contribution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Contribute Academic Resource
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Share high quality notes, previous year question solutions, or revision guides with fellow students.
          </p>
        </div>

        {/* Workflow Notice Alert */}
        <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div className="text-xs text-brand-900 leading-relaxed">
            <span className="font-bold">Moderation Workflow: </span>
            Your submission will enter the <strong>Pending Review</strong> moderation queue. Once reviewed and verified by an admin, it will be published publicly on the resource catalog.
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 mb-6 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resource Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Resource Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="upload-title-input"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., DBMS Complete Handwritten Notes & SQL Queries"
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition font-medium"
              required
            />
          </div>

          {/* Semester & Resource Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Semester <span className="text-rose-500">*</span>
              </label>
              <select
                id="upload-semester-select"
                value={formData.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white focus:outline-none focus:border-brand-500 font-medium cursor-pointer"
                required
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Resource Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="upload-type-select"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white focus:outline-none focus:border-brand-500 font-medium cursor-pointer"
                required
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject / Course Code */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Subject / Course Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="upload-subject-input"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="e.g. Database Management Systems (CSE325)"
              className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition font-medium mb-2"
              required
            />
            {/* Quick click suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Suggestions:</span>
              {POPULAR_SUBJECTS.slice(0, 4).map((subj, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleInputChange('subject', subj)}
                  className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition"
                >
                  {subj.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="upload-description-input"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Outline what units, topics, or question papers are included in this upload. (e.g. Covers Units 1 to 5, includes Normalization, SQL commands, and ACID properties)..."
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition font-medium leading-relaxed"
              required
            />
            <div className="text-right text-[11px] text-slate-400 mt-1">
              {formData.description.length}/1000 characters
            </div>
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Upload File (PDF / DOCX / PPTX / Images) <span className="text-rose-500">*</span>
            </label>

            {selectedFile ? (
              <div className="p-4 rounded-2xl border border-brand-200 bg-brand-50/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(selectedFile.size)} • Ready to submit
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition cursor-pointer ${
                  dragActive
                    ? 'border-brand-500 bg-brand-50/50'
                    : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50/50'
                }`}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">
                  Drag & Drop your file here, or{' '}
                  <span className="text-brand-600 underline decoration-2">browse files</span>
                </p>
                <p className="text-xs text-slate-400">
                  Supported formats: PDF, DOCX, PPTX, JPG, PNG, WEBP (Max 15MB)
                </p>
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </div>
            )}
          </div>

          {/* Submit Button & Progress */}
          {submitting && uploadProgress > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Uploading to Cloud Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              id="upload-submit-btn"
              className="px-8 py-3 rounded-xl font-bold text-sm text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center gap-2 transition disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{submitting ? 'Submitting Resource...' : 'Submit for Moderation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
