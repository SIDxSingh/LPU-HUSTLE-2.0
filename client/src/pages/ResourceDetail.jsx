import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  Download,
  Eye,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Share2,
  FileText,
  User as UserIcon,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { resourceService } from '../services/resourceService';
import { RESOURCE_TYPE_CONFIG } from '../utils/constants';
import { formatDate, formatFileSize, formatNumber } from '../utils/formatters';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ReportModal } from '../components/resources/ReportModal';
import { ResourceCard } from '../components/resources/ResourceCard';

export const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const [resource, setResource] = useState(null);
  const [relatedResources, setRelatedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await resourceService.getResourceById(id);
        if (isMounted && res.success) {
          setResource(res.resource);
          setDownloadsCount(res.resource.downloads || 0);

          // Fetch related resources in same subject/semester
          const relatedRes = await resourceService.getResources({
            semester: res.resource.semester,
            limit: 3,
          });
          if (isMounted && relatedRes.success) {
            setRelatedResources(
              relatedRes.resources.filter((r) => r._id !== res.resource._id)
            );
          }
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Resource not found or inaccessible.', 'error');
        navigate('/resources');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id, navigate, showToast]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await resourceService.downloadResource(resource._id);
      setDownloadsCount((prev) => prev + 1);
      showToast('Download started successfully!', 'success');

      // Trigger file download
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('download', res.fileName || `${resource.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      showToast('Download failed. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: `Check out ${resource.title} on LpuHustle!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading resource details...</p>
      </div>
    );
  }

  if (!resource) return null;

  const typeConfig = RESOURCE_TYPE_CONFIG[resource.type] || RESOURCE_TYPE_CONFIG.Other;
  const isImage = resource.fileType === 'image' || ['jpg', 'jpeg', 'png', 'webp'].some(ext => resource.fileUrl?.toLowerCase().endsWith(ext));
  const isPdf = resource.fileType === 'pdf' || resource.fileUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation breadcrumb / back */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all resources
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition text-xs font-semibold flex items-center gap-1.5"
            title="Share Resource"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                showToast('Please log in to report a resource.', 'info');
                navigate('/login');
                return;
              }
              setIsReportOpen(true);
            }}
            id="resource-report-btn"
            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition text-xs font-semibold flex items-center gap-1.5"
            title="Report inaccurate or copyright material"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* Main Header & Metadata Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            <GraduationCap className="w-4 h-4" />
            Semester {resource.semester}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${typeConfig.color}`}>
            <span className={`w-2 h-2 rounded-full ${typeConfig.dotColor}`} />
            {resource.type}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Uploaded {formatDate(resource.createdAt)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          {resource.title}
        </h1>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-6">
          <BookOpen className="w-4 h-4 text-brand-500" />
          <span>Subject: {resource.subject}</span>
        </div>

        {/* Description */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Resource Description & Overview
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {resource.description}
          </p>
        </div>

        {/* Metadata stats & Contributor */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Uploaded By</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] overflow-hidden">
                {resource.uploadedBy?.avatar ? (
                  <img src={resource.uploadedBy.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  resource.uploadedBy?.name?.charAt(0) || 'S'
                )}
              </div>
              <span className="truncate">{resource.uploadedBy?.name || 'Student Contributor'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">File Format</span>
            <span className="font-bold text-slate-800 uppercase">
              {resource.fileType || 'PDF'} ({formatFileSize(resource.fileSize)})
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Total Views</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {formatNumber(resource.views || 0)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Downloads</span>
            <span className="font-bold text-brand-600 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              {formatNumber(downloadsCount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            id="detail-download-btn"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white gradient-brand hover:opacity-95 shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Downloading...' : 'Download Resource File'}</span>
          </button>

          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>

      {/* Interactive Document Preview Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Document Preview</h2>
            <p className="text-xs text-slate-500">
              Read directly online before downloading to your local device.
            </p>
          </div>
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Full View <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="h-[550px] w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={`${resource.fileUrl}#toolbar=0`}
              title={resource.title}
              className="w-full h-full border-none"
            />
          ) : isImage ? (
            <div className="p-4 w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={resource.fileUrl}
                alt={resource.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="text-center p-8 max-w-md">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 mb-1">
                Preview not available in-browser
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Please download the file ({resource.fileType || 'document'}) to view complete contents.
              </p>
              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand shadow-sm"
              >
                Download Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Resources in this Semester */}
      {relatedResources.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-black text-slate-900">
            More in Semester {resource.semester}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResources.map((rel) => (
              <ResourceCard key={rel._id} resource={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        resourceId={resource._id}
      />
    </div>
  );
};
