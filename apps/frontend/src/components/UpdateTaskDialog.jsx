import { useState, useEffect, useRef } from 'react';
import SubtaskSelector from './SubtaskSelector';
import { taskService } from '../services/taskService';
import '../styles/Dialog.css';
import SelectFilter from './SelectFilter';
import { priorityOptions, statusOptions } from '../constants/options';

function UpdateTaskDialog({ task, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    ...task,
    subtasks: task.subtasks?.map((st) => st.id) || [],
  });
  const dialogRef = useRef(null);

  useEffect(() => {
    setFormData({ ...task, subtasks: task.subtasks?.map((st) => st.id) || [] });
  }, [task]);

  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = await taskService.updateTask(task.id, formData);
      onTaskUpdated(updatedTask);
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={openDialog} className="dialog-btn primary-btn">
        Update Task
      </button>
      <dialog ref={dialogRef} className="dialog">
        <h2 className="dialog-title">Update Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <SelectFilter
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
              options={priorityOptions}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <SelectFilter
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={statusOptions}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Estimate</label>
            <input
              type="number"
              min="0"
              value={formData.estimate}
              onChange={(e) => setFormData({ ...formData, estimate: parseInt(e.target.value) })}
              className="form-input"
            />
          </div>
          <SubtaskSelector
            selectedIds={formData.subtasks || []}
            onChange={(subtasks) => setFormData({ ...formData, subtasks })}
            disabledIds={[task.id]}
          />
          <div className="form-actions">
            <button type="button" onClick={closeDialog} className="dialog-btn secondary-btn">
              Cancel
            </button>
            <button type="submit" className="dialog-btn primary-btn">
              Update Task
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default UpdateTaskDialog;
