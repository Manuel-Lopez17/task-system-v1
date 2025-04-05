import { useEffect, useState } from 'react';
import UpdateTaskDialog from './UpdateTaskDialog';
import DeleteTaskDialog from './DeleteTaskDialog';
import { taskService } from '../services/taskService';

function TaskDetails({ taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTask(taskId);
      setTask(data);
    } catch (err) {
      console.error('Error al cargar la tarea:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdated = () => {
    fetchTask();
  };

  const handleDeleted = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  if (loading) return <p>Cargando...</p>;
  if (!task) return <p>Tarea no encontrada</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detalles de Tarea {task.title}</h1>
      <table className="min-w-full border-collapse mb-4">
        <tbody>
          <tr>
            <th className="border p-2">ID</th>
            <td className="border p-2">{task.id}</td>
          </tr>
          <tr>
            <th className="border p-2">Title</th>
            <td className="border p-2">{task.title}</td>
          </tr>
          <tr>
            <th className="border p-2">Description</th>
            <td className="border p-2">{task.description}</td>
          </tr>
          <tr>
            <th className="border p-2">Priority</th>
            <td className="border p-2">{task.priority}</td>
          </tr>
          <tr>
            <th className="border p-2">Status</th>
            <td className="border p-2">{task.status}</td>
          </tr>
          <tr>
            <th className="border p-2">Estimate</th>
            <td className="border p-2">{task.estimate}</td>
          </tr>
          <tr>
            <th className="border p-2">Subtasks</th>
            <td className="border p-2">
              {task.subtasks?.length > 0
                ? task.subtasks.map((subtask, index) => (
                    <span key={subtask.id}>
                      <a href={`/task/${subtask.id}`} className="text-blue-600 hover:underline">
                        {subtask.title}
                      </a>
                      {index < task.subtasks.length - 1 && ', '}
                    </span>
                  ))
                : 'None'}
            </td>
          </tr>
          <tr>
            <th className="border p-2">Estimate Breakdown</th>
            <td className="border p-2">
              <ul>
                <li>⏳ Pendiente: {task.estimates?.pending}</li>
                <li>🔄 En progreso: {task.estimates?.inProgress}</li>
                <li>📊 Total: {task.estimates?.total}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <th className="border p-2">Creation Date</th>
            <td className="border p-2">{new Date(task.dates?.createdAt).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th className="border p-2">Last Updated</th>
            <td className="border p-2">{new Date(task.dates?.updatedAt).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-2 mb-4">
        <UpdateTaskDialog task={task} onTaskUpdated={handleUpdated} />
        <DeleteTaskDialog task={task} onTaskDeleted={handleDeleted} />
      </div>

      <a href="/" className="text-blue-600 hover:underline">
        ← Volver a la lista
      </a>
    </div>
  );
}

export default TaskDetails;
