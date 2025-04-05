import { useEffect, useState } from 'react';
import CreateTaskDialog from './CreateTaskDialog';
import { taskService } from '../services/taskService';
import '../styles/TaskList.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, total } = await taskService.getTasks({ page, limit, ...filters });
      setTasks(data);
      setTotal(total);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filters]);

  const handleTaskCreated = () => {
    setPage(1);
    fetchTasks();
  };

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="task-container">
      <h1 className="task-title">Task List</h1>

      <div className="task-filters">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Backlog">Backlog</option>
          <option value="Unstarted">Unstarted</option>
          <option value="Started">Started</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="">Todas las prioridades</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
        <CreateTaskDialog onTaskCreated={handleTaskCreated} />
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Estimate</th>
            <th>Creation Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center">
                Cargando...
              </td>
            </tr>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>{task.estimate}</td>
                <td>{new Date(task.dates.createdAt).toLocaleDateString()}</td>
                <td>
                  <a href={`/task/${task.id}`}>View Details</a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No hay tareas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="task-pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default TaskList;
