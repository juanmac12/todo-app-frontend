import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// --- IMÁGENES ---
import detectiveDarkIllustration from './assets/detective-dark.png';
import detectiveLightIllustration from './assets/detective-light.png';

// --- Iconos SVG ---
const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PlusIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const EditIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9167 3.41669L4.16669 12.1667V15.8334H7.83335L16.5834 7.08335L12.9167 3.41669Z" stroke="#9B9EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.6667 4.66663L15.3334 8.33329" stroke="#9B9EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DeleteIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 5.83337H2.5" stroke="#9B9EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 9.16663V14.1666" stroke="#9B9EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12.5 9.16663V14.1666" stroke="#9B9EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.8333 5.83337L15 17.5C15 18.4167 14.25 19.1667 13.3333 19.1667H6.66667C5.75 19.1667 5 18.4167 5 17.5L4.16667 5.83337" stroke="#9B9EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.6667 3.33337C11.6667 2.41671 10.9167 1.66671 10 1.66671C9.08333 1.66671 8.33333 2.41671 8.33333 3.33337" stroke="#9B9EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SunIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 1V3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 21V23" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.22 4.22L5.64 5.64" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.36 18.36L19.78 19.78" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 12H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H23" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.22 19.78L5.64 18.36" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.36 5.64L19.78 4.22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const MoonIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79C21 17.09 17.09 21 12.79 21C10.32 21 8.08 20.08 6.47 18.53C4.94 17.02 4 14.9 4 12.55C4 7.23 8.23 3 13.55 3C13.69 3 13.84 3.01 13.98 3.02C13.52 3.86 13.24 4.81 13.24 5.82C13.24 9.56 16.18 12.79 19.92 12.79H21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ArrowDownIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;


// --- Componente Principal ---
function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('dark');
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  
  const API_URL = 'http://localhost:8080/api/tasks';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError('');
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError('No se pudo conectar al servidor. Asegúrate de que el backend de Java esté corriendo.');
    }finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;
    try {
      setError('');
      const response = await axios.post(API_URL, { title: newTaskText, isCompleted: false });
      setTasks([...tasks, response.data]);
      setNewTaskText('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
      setError('No se pudo agregar la tarea. Intenta de nuevo.');
    }
  };
  
  const handleStartEdit = (task) => {
    setEditingTask(task);
    setEditingText(task.title);
  };

  const handleSaveEdit = async () => {
    if (!editingTask || !editingText.trim()) {
        setEditingTask(null);
        return;
    };
    const updatedTask = { ...editingTask, title: editingText };
    try {
        setError('');
        await axios.put(`${API_URL}/${editingTask.id}`, updatedTask);
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        setEditingTask(null);
        setEditingText('');
    } catch (error) {
        console.error("Error saving task:", error);
        setError('No se pudo guardar la tarea. Intenta de nuevo.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError('');
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError('No se pudo borrar la tarea. Intenta de nuevo.');
    }
  };

  const handleToggleComplete = async (task) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    try {
      setError('');
      await axios.put(`${API_URL}/${task.id}`, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error("Error updating task:", error);
      setError('No se pudo actualizar la tarea. Intenta de nuevo.');
    }
  };
  
  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'COMPLETE') return task.isCompleted;
        if (filter === 'INCOMPLETE') return !task.isCompleted;
        return true;
      })
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [tasks, filter, searchTerm]);

  return (
    <div className="bg-white dark:bg-[#252525] min-h-screen font-sans text-gray-800 dark:text-white flex justify-center p-8 transition-colors duration-300">
      <div className="relative w-full max-w-5xl">
        <h1 className="text-center text-3xl font-bold mb-8 tracking-wider">TODO LIST</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-grow">
            <input 
              type="text"
              placeholder="Search note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 dark:bg-[#1E1E1E] border-2 border-[#6C63FF] dark:border-[#4F4F4F] rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-[#6C63FF] transition-colors duration-300 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6C63FF] dark:text-white">
              <SearchIcon />
            </span>
          </div>
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-[#6C63FF] text-white font-bold rounded-lg pl-6 pr-12 py-3 cursor-pointer focus:outline-none"
            >
              <option value="ALL">ALL</option>
              <option value="COMPLETE">COMPLETE</option>
              <option value="INCOMPLETE">INCOMPLETE</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ArrowDownIcon />
            </span>
          </div>
          <button onClick={handleThemeSwitch} className="bg-[#6C63FF] p-3 rounded-lg">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {!isLoading && error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-4 text-center" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500 py-16">Cargando tareas...</p>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="group flex items-center p-4 bg-transparent border-b border-gray-200 dark:border-[#4F4F4F] transition-colors duration-300">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`w-6 h-6 shrink-0 rounded-md border-2 border-[#6C63FF] flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-[#6C63FF]' : 'bg-transparent'}`}
                >
                  {task.isCompleted && <CheckIcon />}
                </button>
                
                {editingTask && editingTask.id === task.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="flex-grow px-4 bg-transparent focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <p 
                    className={`flex-grow px-4 cursor-pointer ${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
                    onClick={() => handleStartEdit(task)}
                  >
                    {task.title}
                  </p>
                )}

                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleStartEdit(task)}><EditIcon /></button>
                  <button onClick={() => handleDeleteTask(task.id)}><DeleteIcon /></button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <img 
                src={theme === 'dark' ? detectiveDarkIllustration : detectiveLightIllustration} 
                alt="No tasks found" 
                className="mx-auto" 
                width="200" 
                height="200" 
              />
              {!error && <p className="mt-4 text-gray-500">Empty...</p>}
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-12 right-0 bg-[#6C63FF] w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
        >
          <PlusIcon />
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#252525] rounded-2xl p-8 w-full max-w-xl border border-gray-200 dark:border-white">
              <h2 className="text-xl font-bold mb-6 text-center text-black dark:text-white">NEW NOTE</h2>
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Input your note..."
                className="w-full bg-gray-100 dark:bg-[#252525] border-2 border-[#6C63FF] dark:border-white rounded-lg p-3 mb-40 text-black dark:text-white focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 rounded-lg border-2 border-[#6C63FF] text-[#6C63FF] font-semibold bg-white hover:bg-gray-100 dark:bg-[#252525] dark:hover:bg-white/10 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleAddTask}
                  className="px-8 py-3 rounded-lg bg-[#6C63FF] text-white font-semibold hover:bg-indigo-500 transition-colors"
                >
                  APPLY
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default App;
