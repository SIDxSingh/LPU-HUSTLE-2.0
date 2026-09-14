import React, { useState } from 'react';
import { Check, X, Eye, Trash2, Calendar, FileText, ExternalLink } from 'lucide-react';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { RESOURCE_TYPE_CONFIG } from '../../utils/constants';

export const PendingTable = ({
  resources,
  onApprove,
  onOpenRejectModal,
  onDelete,
  onPreview,
}) => {
  if (!resources || resources.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-900 text-base mb-1">Queue is clear!</h3>
        <p className="text-xs text-slate-500">There are no pending submissions awaiting moderation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4">Resource</th>
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Contributor</th>
              <th className="py-3.5 px-4">Sem</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resources.map((item) => {
              const typeCfg = RESOURCE_TYPE_CONFIG[item.type] || RESOURCE_TYPE_CONFIG.Other;

              return (
                <tr key={item._id} className="hover:bg-slate-50/60 transition group">
                  {/* Title & Type */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${typeCfg.color}`}>
                        {item.type}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatFileSize(item.fileSize)}
                      </span>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="py-4 px-4 text-xs font-medium text-slate-700 max-w-[160px] truncate">
                    {item.subject}
                  </td>

                  {/* Contributor */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden">
                        {item.uploadedBy?.avatar ? (
                          <img src={item.uploadedBy.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          item.uploadedBy?.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="text-xs">
                        <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                          {item.uploadedBy?.name || 'Student'}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {item.uploadedBy?.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Semester */}
                  <td className="py-4 px-4 text-xs font-bold text-slate-700">
                    Sem {item.semester}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreview(item)}
                        id={`admin-preview-${item._id}`}
                        title="Preview Document"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onApprove(item._id)}
                        id={`admin-approve-${item._id}`}
                        title="Approve & Publish"
                        className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenRejectModal(item)}
                        id={`admin-reject-${item._id}`}
                        title="Reject Resource"
                        className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(item._id)}
                        id={`admin-delete-${item._id}`}
                        title="Delete Permanently"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
