import { toast } from 'sonner';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/tasks';

async function handleRequest(url, options, successMessage) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Error inesperado');

    if (successMessage) toast.success(successMessage);
    return data;
  } catch (err) {
    toast.error(err.message || 'Error de red');
    throw err;
  }
}

export const taskService = {
  async getTasks() {
    return handleRequest(`${BASE_URL}`);
  },

  async getTask(id) {
    return handleRequest(`${BASE_URL}/${id}`);
  },

  async createTask(taskData) {
    return handleRequest(
      BASE_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      },
      'Tarea creada'
    );
  },

  async updateTask(id, taskData) {
    return handleRequest(
      `${BASE_URL}/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      },
      'Tarea actualizada'
    );
  },

  async deleteTask(id) {
    return handleRequest(
      `${BASE_URL}/${id}`,
      {
        method: 'DELETE',
      },
      'Tarea eliminada'
    );
  },
};
