"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../utils/api'; 

interface Task { 
  id: number; 
  title: string; 
  status: string; 
  tag: string; 
}

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTag, setNewTaskTag] = useState("General");

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) router.push('/login');
  }, [router]);

  const fetchTasks = async () => {
    try {
      const res = await apiRequest('/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        setServerStatus("✅ Online");
      }
    } catch (err) {
      setServerStatus("❌ Disconnected");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) fetchTasks();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest('/logout'); 
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: newTaskTitle, tag: newTaskTag })
      });

      if (res.ok) {
        const updatedTasks = await res.json();
        setTasks(updatedTasks); 
        setIsModalOpen(false); 
        setNewTaskTitle(""); 
      }
    } catch (err) {
      alert("Failed to add task.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const res = await apiRequest('/tasks', {
        method: 'DELETE',
        body: JSON.stringify({ id }) 
      });

      if (res.ok) {
        const updatedTasks = await res.json();
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const getTasksByStatus = (status: string) => tasks.filter(task => task.status === status);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-700 text-xl font-bold text-blue-500">
          KanbanFlow
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="p-3 bg-gray-700 rounded cursor-pointer border-l-4 border-blue-500">Board View</div>
          <div className="p-3 hover:bg-gray-700 rounded cursor-pointer text-gray-400">Settings</div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Project Board: Alpha</h2>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition"
            >
              + New Task
            </button>

            <span className="text-xs font-mono bg-gray-900 px-3 py-1 rounded border border-gray-700 text-gray-300">
              {serverStatus}
            </span>

            <button 
              onClick={handleLogout} 
              className="text-sm bg-gray-700 hover:bg-red-600 hover:text-white text-gray-300 px-3 py-2 rounded transition font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-6 bg-gray-900">
          <div className="flex space-x-6 h-full">
            <Column 
              title="To Do" 
              tasks={getTasksByStatus('todo')} 
              color="border-gray-500" 
              onDelete={handleDeleteTask}
            />
            <Column 
              title="In Progress" 
              tasks={getTasksByStatus('inprogress')} 
              color="border-blue-500" 
              onDelete={handleDeleteTask}
            />
            <Column 
              title="Done" 
              tasks={getTasksByStatus('done')} 
              color="border-green-500" 
              onDelete={handleDeleteTask}
            />
          </div>
        </main>

        {isModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-96 border border-gray-700 shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Add New Task</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Task Title</label>
                  <input 
                    type="text" 
                    required 
                    value={newTaskTitle} 
                    onChange={e => setNewTaskTitle(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 outline-none focus:border-blue-500" 
                    placeholder="e.g. Fix Navigation" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select 
                    value={newTaskTag} 
                    onChange={e => setNewTaskTag(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:border-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Column({ title, tasks, color, onDelete }: any) {
  return (
    <div className="w-80 flex-shrink-0 bg-gray-800 rounded-lg p-4 flex flex-col">
      <h3 className={`font-bold mb-4 flex justify-between border-b-2 ${color} pb-2 text-gray-100 uppercase tracking-wider text-sm`}>
        {title} <span className="bg-gray-700 px-2 rounded text-sm text-white">{tasks.length}</span>
      </h3>
      <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {tasks.map((task: any) => (
          <div key={task.id} className="bg-gray-700 p-3 rounded border border-gray-600 group relative hover:border-blue-500/50 transition shadow-sm">
            <p className="text-sm font-medium mb-3 text-gray-200">{task.title}</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-blue-900/40 text-blue-200 px-2 py-1 rounded uppercase font-bold border border-blue-900/50">
                {task.tag}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition duration-200">
                <button 
                  onClick={() => onDelete(task.id)} 
                  className="text-[11px] text-red-500 hover:text-red-400 font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}