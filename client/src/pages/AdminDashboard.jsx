import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { StatCards } from '../components/admin/StatCards';
import { PendingTable } from '../components/admin/PendingTable';
import { RejectModal } from '../components/admin/RejectModal';
import { UserTable } from '../components/admin/UserTable';
import { FilePreviewModal } from '../components/resources/FilePreviewModal';
import {
  ShieldCheck,
  Clock,
  BookOpen,
  Users,
  AlertTriangle,
  RefreshCw,
  Search,
  Check,
  Trash2,
} from 'lucide-react';
import { STATUS_CONFIG, RESOURCE_TYPE_CONFIG } from '../utils/constants';
import { formatDate } from '../utils/formatters';

export const AdminDashboard = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [pendingResources, setPendingResources] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  // Search & filter for "All Resources" tab
  const [allSearch, setAllSearch] = useState('');
  const [allStatus, setAllStatus] = useState('all');

  // Modals state
  const [previewResource, setPreviewResource] = useState(null);
  const [rejectingResource, setRejectingResource] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, allRes, usersRes, reportsRes] =
        await Promise.all([
          adminService.getAdminStats(),
          adminService.getPendingResources(),
          adminService.getAllResources(),
          adminService.getUsersList(),
          adminService.getReportsList(),
        ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (pendingRes.success) setPendingResources(pendingRes.resources);
      if (allRes.success) setAllResources(allRes.resources);
      if (usersRes.success) setUsers(usersRes.users);
      if (reportsRes.success) setReports(reportsRes.reports);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Failed to load admin dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await adminService.approveResource(id);
      showToast(res.message || 'Resource approved successfully!', 'success');
      // Update state locally
      setPendingResources((prev) => prev.filter((r) => r._id !== id));
      setAllResources((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'approved' } : r))
      );
      // Refresh stats
      const statsRes = await adminService.getAdminStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve resource.', 'error');
    }
  };

  const handleRejectConfirm = async (id, rejectionReason) => {
    try {
      const res = await adminService.rejectResource(id, rejectionReason);
      showToast(res.message || 'Resource marked as rejected.', 'info');
      setPendingResources((prev) => prev.filter((r) => r._id !== id));
      setAllResources((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: 'rejected', rejectionReason } : r
        )
      );
      setRejectingResource(null);
      // Refresh stats
      const statsRes = await adminService.getAdminStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject resource.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this resource?')) {
      return;
    }

    try {
      const res = await adminService.deleteResource(id);
      showToast(res.message || 'Resource deleted.', 'success');
      setPendingResources((prev) => prev.filter((r) => r._id !== id));
      setAllResources((prev) => prev.filter((r) => r._id !== id));
      // Refresh stats
      const statsRes = await adminService.getAdminStats();
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete resource.', 'error');
    }
  };

  const filteredAllResources = allResources.filter((r) => {
    const matchStatus = allStatus === 'all' || r.status === allStatus;
    const matchSearch =
      !allSearch.trim() ||
      r.title.toLowerCase().includes(allSearch.toLowerCase()) ||
      r.subject.toLowerCase().includes(allSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Moderation Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admin Moderation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review incoming student submissions, verify academic quality, and manage resources.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          id="admin-refresh-data-btn"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Platform Stats Grid */}
      <StatCards stats={stats} />

      {/* Main Tab Controls */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto text-sm font-bold pb-2">
          <button
            onClick={() => setActiveTab('pending')}
            id="admin-tab-pending"
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Submissions</span>
            {pendingResources.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-amber-800">
                {pendingResources.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            id="admin-tab-all"
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>All Catalogued Resources ({allResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            id="admin-tab-users"
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'users'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students Directory ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            id="admin-tab-reports"
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 shrink-0 ${
              activeTab === 'reports'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Flagged Reports ({reports.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              Pending Submissions Awaiting Approval
            </h2>
            <span className="text-xs text-slate-500">
              {pendingResources.length} submissions in review queue
            </span>
          </div>

          <PendingTable
            resources={pendingResources}
            onApprove={handleApprove}
            onOpenRejectModal={(res) => setRejectingResource(res)}
            onDelete={handleDelete}
            onPreview={(res) => setPreviewResource(res)}
          />
        </div>
      )}

      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Filters for All Resources */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={allSearch}
                onChange={(e) => setAllSearch(e.target.value)}
                placeholder="Search across all resources..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={allStatus}
                onChange={(e) => setAllStatus(e.target.value)}
                className="py-2 px-3 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Sem</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Contributor</th>
                    <th className="py-3 px-4">Downloads</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAllResources.map((res) => {
                    const st = STATUS_CONFIG[res.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={res._id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                          {res.title}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 max-w-[150px] truncate">
                          {res.subject}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                          Sem {res.semester}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${st.bg} ${st.text} ${st.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 truncate max-w-[120px]">
                          {res.uploadedBy?.name || 'Student'}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                          {res.downloads || 0}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewResource(res)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                              title="Preview"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(res._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete"
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
        </div>
      )}

      {activeTab === 'users' && <UserTable users={users} />}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep._id} className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        Flagged
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(rep.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">
                      Reason: {rep.reason}
                    </p>
                    <p className="text-xs text-slate-500">
                      Reported resource: <strong>{rep.resource?.title || 'Unknown'}</strong> by {rep.reportedBy?.name}
                    </p>
                  </div>
                  {rep.resource && (
                    <button
                      onClick={() => handleDelete(rep.resource._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
                    >
                      Delete Resource
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No reports have been filed by students.
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={Boolean(rejectingResource)}
        onClose={() => setRejectingResource(null)}
        resource={rejectingResource}
        onConfirm={handleRejectConfirm}
      />

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={Boolean(previewResource)}
        onClose={() => setPreviewResource(null)}
        resource={previewResource}
      />
    </div>
  );
};
