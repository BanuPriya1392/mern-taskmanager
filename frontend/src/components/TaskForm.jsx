import { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, initial, onCancel, users }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        dueDate: initial.dueDate?.slice(0, 10) || '',
        assignedTo: initial.assignedTo?._id || ''
      });
    }
  }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl shadow-xl p-8 space-y-6">
      <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
        <span className="text-2xl">{initial ? '✏️' : '📝'}</span>
        {initial ? 'Edit Task' : 'Add New Task'}
      </h2>

      <div className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title *"
          required
          className="glass-input w-full"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={3}
          className="glass-input w-full resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-medium">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="glass-input w-full">
            <option className="bg-slate-900 text-slate-200" value="pending">Pending</option>
            <option className="bg-slate-900 text-slate-200" value="in-progress">In Progress</option>
            <option className="bg-slate-900 text-slate-200" value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-medium">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="glass-input w-full">
            <option className="bg-slate-900 text-slate-200" value="low">Low</option>
            <option className="bg-slate-900 text-slate-200" value="medium">Medium</option>
            <option className="bg-slate-900 text-slate-200" value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-medium">Due Date</label>
          <div className="relative">
             <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
              className="glass-input w-full [color-scheme:dark]"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-medium">Assign To</label>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="glass-input w-full">
            <option className="bg-slate-900 text-slate-200" value="">Unassigned</option>
            {users?.map(u => (
              <option className="bg-slate-900 text-slate-200" key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-700/50">
        <button type="submit" className="btn-primary flex-1">
          {initial ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}