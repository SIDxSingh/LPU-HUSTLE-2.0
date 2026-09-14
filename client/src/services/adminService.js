import api from './api';

export const adminService = {
  async getAdminStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getPendingResources() {
    const res = await api.get('/admin/resources/pending');
    return res.data;
  },

  async getAllResources(params = {}) {
    const res = await api.get('/admin/resources', { params });
    return res.data;
  },

  async approveResource(id) {
    const res = await api.patch(`/admin/resources/${id}/approve`);
    return res.data;
  },

  async rejectResource(id, rejectionReason) {
    const res = await api.patch(`/admin/resources/${id}/reject`, {
      rejectionReason,
    });
    return res.data;
  },

  async deleteResource(id) {
    const res = await api.delete(`/admin/resources/${id}`);
    return res.data;
  },

  async getUsersList() {
    const res = await api.get('/admin/users');
    return res.data;
  },

  async getReportsList() {
    const res = await api.get('/admin/reports');
    return res.data;
  },
};
