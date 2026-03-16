import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const fetchTasksAndUsers = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/users')
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasksAndUsers(); }, []);

  const handleCreate = async (form) => {
    try {
      const { data } = await API.post('/tasks', form);
      setTasks([data, ...tasks]);
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (form) => {
    try {
      const { data } = await API.put(`/tasks/${editTask._id}`, form);
      setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
      setEditTask(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen relative flex flex-col pb-12">
      {/* Decorative blobs */}
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none fixed"></div>
      <div className="absolute top-[60%] left-[5%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none fixed"></div>

      <div className="w-full relative z-10 p-4">
        <Navbar />
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 py-4 relative z-10 flex-1 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 glass p-6 rounded-2xl">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">✨</span>
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">My Tasks</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">{tasks.length} total tasks organized</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setEditTask(null); }}
            className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> New Task
          </button>
        </div>

        {/* Add Form */}
        {showForm && !editTask && (
          <div className="mb-8 animate-fade-in">
            <TaskForm users={users} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['all', 'pending', 'in-progress', 'completed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === f
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-800/80 hover:text-slate-200'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)} <span className="ml-1 opacity-60 text-xs px-1.5 py-0.5 bg-black/20 rounded-md">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            Loading tasks...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl flex flex-col items-center">
            <p className="text-6xl mb-4 drop-shadow-xl opacity-80">💫</p>
            <p className="text-slate-300 font-medium text-lg">You're all caught up!</p>
            <p className="text-slate-500 text-sm mt-1">Click "+ New Task" to assign work</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filtered.map((task) =>
              editTask?._id === task._id ? (
                <div key={task._id} className="animate-fade-in">
                  <TaskForm users={users} initial={editTask}
                    onSubmit={handleUpdate} onCancel={() => setEditTask(null)} />
                </div>
              ) : (
                <TaskCard key={task._id} task={task}
                  onEdit={(t) => { setEditTask(t); setShowForm(false); }}
                  onDelete={handleDelete} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}