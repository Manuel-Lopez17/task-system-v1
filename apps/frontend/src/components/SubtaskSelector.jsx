import { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';

function SubtaskSelector({ selectedIds, onChange, disabledIds = [] }) {
  const [availableTasks, setAvailableTasks] = useState([]);

  useEffect(() => {
    const fetchAvailableTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setAvailableTasks(data);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };
    fetchAvailableTasks();
  }, []);

  const toggleSubtask = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((subId) => subId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="mb-2">
      <label className="block mb-1 font-semibold">Subtareas</label>
      <div className="border p-2 rounded max-h-40 overflow-y-auto space-y-1">
        {availableTasks
          .filter((task) => !disabledIds.includes(task.id))
          .map((task) => (
            <label key={task.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(task.id)}
                onChange={() => toggleSubtask(task.id)}
              />
              <span className="text-sm">{task.title}</span>
            </label>
          ))}
      </div>
    </div>
  );
}

export default SubtaskSelector;
