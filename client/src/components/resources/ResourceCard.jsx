import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Calendar,
  User as UserIcon,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { RESOURCE_TYPE_CONFIG } from '../../utils/constants';
import { formatDate, formatNumber } from '../../utils/formatters';
import { resourceService } from '../../services/resourceService';
import { useToast } from '../../context/ToastContext';

export const ResourceCard = ({ resource, onDownloadSuccess }) => {
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [downloadsCount, setDownloadsCount] = useState(resource.downloads || 0);

  const typeConfig = RESOURCE_TYPE_CONFIG[resource.type] || RESOURCE_TYPE_CONFIG.Other;

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setDownloading(true);
      const res = await resourceService.downloadResource(resource._id);
      setDownloadsCount((prev) => prev + 1);
      showToast('Download started!', 'success');

      if (onDownloadSuccess) {
        onDownloadSuccess(resource._id);
      }

      // Trigger download in browser
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('download', res.fileName || 'academic-resource');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      showToast('Unable to start download. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 hover:shadow-card transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 relative">
      {/* Top Meta Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
            <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
            Semester {resource.semester}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeConfig.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.dotColor}`} />
            {resource.type}
          </span>
        </div>

        {/* Resource Title */}
        <Link
          to={`/resources/${resource._id}`}
          className="block group-hover:text-brand-600 transition-colors"
        >
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2">
            {resource.title}
          </h3>
        </Link>

        {/* Subject */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          <span className="truncate">{resource.subject}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {resource.description}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        {/* Contributor and Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[150px]">
            <div className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-[10px] shrink-0 border border-brand-100 overflow-hidden">
              {resource.uploadedBy?.avatar ? (
                <img
                  src={resource.uploadedBy.avatar}
                  alt={resource.uploadedBy.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                resource.uploadedBy?.name?.charAt(0) || 'S'
              )}
            </div>
            <span className="truncate text-slate-600 font-medium">
              {resource.uploadedBy?.name || 'Student'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 text-slate-500">
            <span className="flex items-center gap-1" title="Views">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(resource.views || 0)}
            </span>
            <span className="flex items-center gap-1 text-brand-600 font-semibold" title="Downloads">
              <Download className="w-3.5 h-3.5" />
              {formatNumber(downloadsCount)}
            </span>
          </div>
        </div>

        {/* Button Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/resources/${resource._id}`}
            id={`resource-view-btn-${resource._id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            Details
          </Link>
          <button
            onClick={handleDownload}
            disabled={downloading}
            id={`resource-download-btn-${resource._id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-98 transition shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? 'Fetching...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};
