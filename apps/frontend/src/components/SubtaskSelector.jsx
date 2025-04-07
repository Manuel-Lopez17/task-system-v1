import { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';
import '../styles/SubtaskSelector.css';

function SubtaskSelector({ selectedIds, onChange, disabledIds = [] }) {
  const [availableTasks, setAvailableTasks] = useState([]);

  useEffect(() => {
    const fetchAvailableTasks = async () => {
      try {
        const { data } = await taskService.getTasks({ paginate: false });
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
    <div className="subtask-selector-container">
      <label className="subtask-selector-title">Subtask</label>
      <div className="subtask-selector-list">
        {availableTasks
          .filter((task) => !disabledIds.includes(task.id))
          .map((task) => (
            <label key={task.id} className="subtask-selector-item">
              <input
                type="checkbox"
                checked={selectedIds.includes(task.id)}
                onChange={() => toggleSubtask(task.id)}
                className="subtask-selector-checkbox"
              />
              <span className="subtask-selector-text">{task.title}</span>
            </label>
          ))}
      </div>
    </div>
  );
}

export default SubtaskSelector;
