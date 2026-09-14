import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceService } from '../services/resourceService';
import { useToast } from '../context/ToastContext';
import {
  User as UserIcon,
  UploadCloud,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Trash2,
  ExternalLink,
  BookOpen,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { formatDate, formatNumber } from '../utils/formatters';
import { STATUS_CONFIG, RESOURCE_TYPE_CONFIG } from '../utils/constants';
import { EmptyState } from '../components/common/EmptyState';

export const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, resList] = await Promise.all([
        resourceService.getUserProfile(),
        resourceService.getUserResources(),
      ]);

      if (profRes.success) setProfileData(profRes);
      if (resList.success) setResources(resList.resources);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      showToast('Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) {
      return;
    }

    try {
      const res = await resourceService.deleteUserResource(id);
      showToast(res.message || 'Resource removed successfully.', 'success');
      setResources((prev) => prev.filter((r) => r._id !== id));
      // Refresh profile metrics
      const profRes = await resourceService.getUserProfile();
      if (profRes.success) setProfileData(profRes);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove resource.', 'error');
    }
  };

  const stats = profileData?.stats || {
    totalContributions: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalDownloads: 0,
  };

  const filteredResources = resources.filter((r) => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-brand-500/20 overflow-hidden shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-100">
                Semester {user?.semester}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <Link
          to="/upload"
          id="dashboard-upload-cta-btn"
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white gradient-brand shadow-sm hover:opacity-95 transition flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Resource</span>
        </Link>
      </div>

      {/* Contribution Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
            <BookOpen className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalContributions}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Your Contributions</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-subtle">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">
            {stats.approved}
          </p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Live & Public</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-subtle">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-700">
            {stats.pending}
          </p>
          <p className="text-[11px] text-amber-600/80 mt-0.5">In Review Queue</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-subtle">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-700">
            {stats.rejected}
          </p>
          <p className="text-[11px] text-rose-600/80 mt-0.5">Needs Modification</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 bg-purple-50/20 shadow-subtle">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Impact</span>
            <Download className="w-4 h-4" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-700">
            {formatNumber(stats.totalDownloads)}
          </p>
          <p className="text-[11px] text-purple-600/80 mt-0.5">Total Downloads</p>
        </div>
      </div>

      {/* Uploaded Resources Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              My Uploaded Submissions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track approval status and moderation notes for your shared study material.
            </p>
          </div>

          {/* Status Tab Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({resources.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'rejected'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="space-y-3">
            {filteredResources.map((item) => {
              const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
              const typeCfg = RESOURCE_TYPE_CONFIG[item.type] || RESOURCE_TYPE_CONFIG.Other;

              return (
                <div
                  key={item._id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded border ${typeCfg.color}`}>
                        {item.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Semester {item.semester}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Subject: {item.subject}</span>
                      <span>•</span>
                      <span>Submitted on {formatDate(item.createdAt)}</span>
                      {item.status === 'approved' && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-brand-600">
                            {formatNumber(item.downloads || 0)} downloads
                          </span>
                        </>
                      )}
                    </div>

                    {/* Show Rejection Feedback Banner if Rejected */}
                    {item.status === 'rejected' && item.rejectionReason && (
                      <div className="mt-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <span className="font-bold">Moderator Reason: </span>
                          <span>{item.rejectionReason}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {item.status === 'approved' && (
                      <Link
                        to={`/resources/${item._id}`}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Live
                      </Link>
                    )}

                    <button
                      onClick={() => handleDeleteResource(item._id, item.title)}
                      id={`delete-user-resource-${item._id}`}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1.5"
                      title="Delete Submission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="You haven't uploaded any resources yet"
            description="Share your class notes, PYQs with answers, or lab assignments to help fellow students."
            actionText="Upload Resource"
            actionLink="/upload"
          />
        )}
      </div>
    </div>
  );
};
