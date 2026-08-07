import api from './api';

const buildAuthHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export const getTickets = async (token) => {
  const response = await api.get('/tickets', {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const getTicket = async (token, id) => {
  const response = await api.get(`/tickets/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const createTicket = async (token, payload) => {
  const response = await api.post('/tickets', payload, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const updateTicket = async (token, id, payload) => {
  const response = await api.patch(`/tickets/${id}`, payload, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const deleteTicket = async (token, id) => {
  const response = await api.delete(`/tickets/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const assignTicket = async (token, id, userId) => {
  const response = await api.patch(`/tickets/${id}/assign/${userId}`, {}, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const getInterventions = async (token) => {
  const response = await api.get('/interventions', {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const createIntervention = async (token, payload) => {
  const response = await api.post('/interventions', payload, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const updateIntervention = async (token, id, payload) => {
  const response = await api.patch(`/interventions/${id}`, payload, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const startIntervention = async (token, id) => {
  const response = await api.patch(`/interventions/${id}/start`, {}, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const finishIntervention = async (token, id) => {
  const response = await api.patch(`/interventions/${id}/finish`, {}, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const deleteIntervention = async (token, id) => {
  const response = await api.delete(`/interventions/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const getCommentsByTicket = async (token, ticketId) => {
  const response = await api.get(`/comments/ticket/${ticketId}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const createComment = async (token, payload) => {
  const response = await api.post('/comments', payload, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const updateComment = async (token, id, payload) => {
  const response = await api.patch(`/comments/${id}`, payload, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const deleteComment = async (token, id) => {
  const response = await api.delete(`/comments/${id}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const getNotifications = async (token, userId) => {
  const response = await api.get(`/notifications/user/${userId}`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const getUnreadNotificationCount = async (token, userId) => {
  const response = await api.get(`/notifications/user/${userId}/unread-count`, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const markNotificationAsRead = async (token, id) => {
  const response = await api.patch(`/notifications/${id}/read`, {}, {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};

export const getUsers = async (token) => {
  const response = await api.get('/users', {
    headers: buildAuthHeaders(token),
  });
  return response.data;
};
