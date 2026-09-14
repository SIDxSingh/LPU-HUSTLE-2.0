import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export const RejectModal = ({ isOpen, onClose, resource, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !resource) return null;

  const presets = [
    'Document is illegible or corrupted scan.',
    'Wrong subject or semester classification.',
    'Copyrighted textbook content is not permitted.',
    'Duplicate submission already exists.',
    'Insufficient study content or incomplete notes.',
  ];

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setSubmitting(true);
    await onConfirm(resource._id, reason.trim());
    setSubmitting(false);
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reject Resource</h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{resource.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quick Pre-written Reasons:
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {presets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setReason(preset)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  {preset}
                </button>
              ))}
            </div>

            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rejection Feedback (Sent to student):
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this resource cannot be approved and how the student can improve it..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
