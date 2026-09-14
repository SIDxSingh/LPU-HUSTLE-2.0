import api from './api';

export const resourceService = {
  async getResources(params = {}) {
    const res = await api.get('/resources', { params });
    return res.data;
  },

  async getResourceById(id) {
    const res = await api.get(`/resources/${id}`);
    return res.data;
  },

  async uploadResource(formData, onUploadProgress) {
    const res = await api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return res.data;
  },

  async downloadResource(id) {
    const res = await api.get(`/resources/${id}/download`);
    return res.data;
  },

  async reportResource(id, reason) {
    const res = await api.post(`/resources/${id}/report`, { reason });
    return res.data;
  },

  async getFeaturedResources() {
    const res = await api.get('/resources/featured');
    return res.data;
  },

  async getSemestersSummary() {
    const res = await api.get('/resources/semesters-summary');
    return res.data;
  },

  async getSubjectsList(semester) {
    const res = await api.get('/resources/subjects', {
      params: { semester },
    });
    return res.data;
  },

  // User Dashboard endpoints
  async getUserProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async getUserResources(status) {
    const res = await api.get('/users/resources', {
      params: { status },
    });
    return res.data;
  },

  async deleteUserResource(id) {
    const res = await api.delete(`/users/resources/${id}`);
    return res.data;
  },
};
