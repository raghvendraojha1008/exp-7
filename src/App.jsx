import React, { useState, useEffect } from 'react';
// Lucide icons import (Make sure to run: npm install lucide-react)
import { 
  Plus, Trash2, CheckCircle, Circle, ClipboardList, 
  AlertTriangle, X, Check, HelpCircle, Calendar, AlignLeft 
} from 'lucide-react';

export default function App() {
  // --- 1. State Management ---
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Learn React State", 
      date: "2024-05-20", 
      description: "Understand how useState works in functional components.",
      completed: false 
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: ""
  });

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToToggle, setTaskToToggle] = useState(null);
  const [notification, setNotification] = useState(null);

  // --- 2. Helper Functions ---
  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newTask = {
      id: Date.now(),
      ...formData,
      completed: false
    };

    setTasks([newTask, ...tasks]);
    setFormData({ title: "", date: "", description: "" });
    setShowForm(false);
    showNotification("Task added successfully! 🚀");
  };

  const confirmToggle = () => {
    if (!taskToToggle) return;
    const isMarkingComplete = !taskToToggle.completed;
    
    setTasks(tasks.map(task => 
      task.id === taskToToggle.id ? { ...task, completed: isMarkingComplete } : task
    ));

    showNotification(isMarkingComplete ? "Task completed! 🎉" : "Task pending again.", isMarkingComplete ? "success" : "info");
    setTaskToToggle(null);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(tasks.filter(task => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      showNotification("Task deleted.", "error");
    }
  };

  // --- 3. UI Render ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 font-sans relative">
      
      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
            <ClipboardList size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Task Master</h1>
        </div>
        <p className="text-slate-500 font-medium">Your personal productivity hub</p>
      </div>

      {/* Task List */}
      <div className="w-full max-w-lg space-y-4 pb-24">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="bg-white p-6 rounded-full shadow-inner mb-4">
               <Plus size={40} className="opacity-20" />
            </div>
            <p className="text-lg">No tasks for today. Click + to add one!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-sm ${
                task.completed ? 'border-green-100 opacity-80' : 'border-white hover:border-blue-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => setTaskToToggle(task)}
                >
                  <h3 className={`text-xl font-bold text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h3>
                  {task.date && (
                    <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                      <Calendar size={14} />
                      <span>{task.date}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setTaskToToggle(task)}
                    className={`p-2 rounded-full transition-colors ${task.completed ? 'text-green-500 bg-green-50' : 'text-slate-300 hover:bg-blue-50 hover:text-blue-500'}`}
                  >
                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  <button 
                    onClick={() => setTaskToDelete(task)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              {task.description && (
                <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-2xl">
                  <AlignLeft size={16} className="text-slate-400 mt-1 shrink-0" />
                  <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* FAB - Floating Action Button */}
      <button 
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transform transition-transform active:scale-90 z-20 group"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* ADD TASK FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-800">New Goal</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={addTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                <input 
                  autoFocus
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="What needs to be done?"
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add more details here..."
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODALS */}
      {taskToToggle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {taskToToggle.completed ? "Undo Task?" : "Complete Task?"}
            </h3>
            <p className="text-slate-500 text-sm mb-6">Change status for "{taskToToggle.title}"?</p>
            <div className="flex gap-2">
              <button onClick={() => setTaskToToggle(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl">No</button>
              <button onClick={confirmToggle} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {taskToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete?</h3>
            <p className="text-slate-500 text-sm mb-6">Permanently remove "{taskToDelete.title}"?</p>
            <div className="flex gap-2">
              <button onClick={() => setTaskToDelete(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl">No</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl z-[100] ${
          notification.type === 'error' ? 'bg-red-600 text-white' : 
          notification.type === 'info' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
        }`}>
          {notification.type === 'error' ? <AlertTriangle size={18} /> : <Check size={18} className="text-green-400" />}
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
