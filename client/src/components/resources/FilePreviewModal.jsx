import React from 'react';
import { X, Download, ExternalLink, FileText, AlertTriangle } from 'lucide-react';

export const FilePreviewModal = ({ isOpen, onClose, resource, onDownload }) => {
  if (!isOpen || !resource) return null;

  const isImage = resource.fileType === 'image' || ['jpg', 'jpeg', 'png', 'webp'].some(ext => resource.fileUrl?.toLowerCase().endsWith(ext));
  const isPdf = resource.fileType === 'pdf' || resource.fileUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[85vh] flex flex-col z-10 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/70">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {resource.title}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {resource.subject} • Semester {resource.semester} • {resource.type}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition text-xs font-semibold flex items-center gap-1.5"
              title="Open original in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">New Tab</span>
            </a>
            {onDownload && (
              <button
                onClick={() => onDownload(resource)}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Preview Area */}
        <div className="flex-1 bg-slate-100 relative overflow-auto flex items-center justify-center">
          {isPdf ? (
            <iframe
              src={`${resource.fileUrl}#toolbar=0`}
              title={resource.title}
              className="w-full h-full border-none"
            />
          ) : isImage ? (
            <div className="p-4 max-h-full flex items-center justify-center">
              <img
                src={resource.fileUrl}
                alt={resource.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">
                Preview Not Supported In-Browser
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                This file format ({resource.fileType || 'document'}) cannot be rendered inside the interactive preview. Download it to view on your device.
              </p>
              <button
                onClick={() => onDownload(resource)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white gradient-brand shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
