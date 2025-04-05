import { useEffect, useState } from 'react';
import CreateTaskDialog from './CreateTaskDialog';
import { taskService } from '../services/taskService';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = () => {
    fetchTasks();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-4">Task List</h1>
      <CreateTaskDialog onTaskCreated={handleTaskCreated} />
      <table className="min-w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Priority</th>
            <th className="border p-2">Estimate</th>
            <th className="border p-2">Creation Date</th>
            <th className="border p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="border p-2" colSpan={7}>
                Cargando...
              </td>
            </tr>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td className="border p-2">{task.id}</td>
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.status}</td>
                <td className="border p-2">{task.priority}</td>
                <td className="border p-2">{task.estimate}</td>
                <td className="border p-2">
                  {new Date(task.dates.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <a href={`/task/${task.id}`} className="text-blue-500 hover:underline">
                    View Details
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2" colSpan={7}>
                No hay tareas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
