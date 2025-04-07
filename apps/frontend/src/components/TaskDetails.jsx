import { useEffect, useState } from 'react';
import UpdateTaskDialog from './UpdateTaskDialog';
import DeleteTaskDialog from './DeleteTaskDialog';
import { taskService } from '../services/taskService';
import '../styles/TaskDetails.css';

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
    <div className="task-details">
      <h1 className="task-title">Detalles de Tarea {task.title}</h1>
      <table className="task-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{task.id}</td>
          </tr>
          <tr>
            <th>Title</th>
            <td>{task.title}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{task.description}</td>
          </tr>
          <tr>
            <th>Priority</th>
            <td>{task.priority}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{task.status}</td>
          </tr>
          <tr>
            <th>Estimate</th>
            <td>{task.estimate}</td>
          </tr>
          <tr>
            <th>Subtasks</th>
            <td>
              {task.subtasks?.length > 0
                ? task.subtasks.map((subtask, index) => (
                    <span key={subtask.id}>
                      <a href={`/task/${subtask.id}`}>{subtask.title}</a>
                      {index < task.subtasks.length - 1 && ', '}
                    </span>
                  ))
                : 'None'}
            </td>
          </tr>
          <tr>
            <th>Estimate Breakdown</th>
            <td>
              <ul>
                <li>Pending: {task.estimates?.pending}</li>
                <li>Started: {task.estimates?.inProgress}</li>
                <li>Total: {task.estimates?.total}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Creation Date</th>
            <td>{new Date(task.dates?.createdAt).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Last Updated</th>
            <td>{new Date(task.dates?.updatedAt).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="button-group">
        <UpdateTaskDialog task={task} onTaskUpdated={handleUpdated} />
        <DeleteTaskDialog task={task} onTaskDeleted={handleDeleted} />
      </div>

      <a href="/">← Volver a la lista</a>
    </div>
  );
}

export default TaskDetails;
