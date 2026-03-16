const priorityColors = {
  low: 'bg-green-500/20 text-green-300 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const statusColors = {
  pending: 'bg-slate-500/30 text-slate-300 border-slate-500/30',
  'in-progress': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
      {task.status === 'completed' && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
      )}
      
      <div className="flex justify-between items-start">
        <h3 className={`font-semibold text-lg text-slate-100 ${task.status === 'completed' ? 'line-through text-slate-500 opacity-80' : ''}`}>
          {task.title}
        </h3>
        <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)}
            className="text-indigo-400 hover:text-indigo-300 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/10 transition border border-transparent hover:border-indigo-500/20">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)}
            className="text-red-400 hover:text-red-300 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition border border-transparent hover:border-red-500/20">
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-slate-400 leading-relaxed font-light">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-2 pt-4 border-t border-slate-700/50">
        <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusColors[task.status]}`}>
          {task.status}
        </span>
        <span className={`text-xs px-3 py-1 rounded-full font-medium border ${priorityColors[task.priority]}`}>
          {task.priority} priority
        </span>
        {task.dueDate && (
          <span className="text-xs px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 font-medium border border-violet-500/30">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        {task.assignedTo && (
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/30">
            👤 {task.assignedTo.name}
          </span>
        )}
      </div>
    </div>
  );
}