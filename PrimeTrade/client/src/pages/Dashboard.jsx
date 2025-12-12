import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
    // Context and Router hooks
    const authContext = useContext(AuthContext);
    const { user, logout, isAuthenticated, updatePassword } = authContext;
    const navigate = useNavigate();

    // Local State
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null); // Task being edited
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [view, setView] = useState('tasks'); // Toggle between 'tasks' view and 'profile' view

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'

    // Password Update State
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [profileAlert, setProfileAlert] = useState(null);

    // Effect: Load tasks when authenticated and in 'tasks' view
    useEffect(() => {
        if (isAuthenticated && view === 'tasks') fetchTasks();
    }, [isAuthenticated, view]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/tasks');
            setTasks(res.data);
            setLoadingTasks(false);
        } catch (err) { console.error(err); setLoadingTasks(false); }
    };

    // Derived State: Filter tasks based on search query and status
    // This runs on every render, keeping the UI in sync with inputs
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' ? true : task.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // CRUD Operations (Add/Update/Delete)
    const addOrUpdateTask = async (task) => {
        try {
            if (currentTask) {
                // Update existing task
                const res = await axios.put(`http://localhost:5001/api/tasks/${currentTask._id}`, task);
                setTasks(tasks.map((t) => (t._id === currentTask._id ? res.data : t)));
                setCurrentTask(null);
            } else {
                // Create new task
                const res = await axios.post('http://localhost:5001/api/tasks', task);
                setTasks([res.data, ...tasks]);
            }
        } catch (err) { console.error(err); }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Delete this task?')) {
            try {
                await axios.delete(`http://localhost:5001/api/tasks/${id}`);
                setTasks(tasks.filter((task) => task._id !== id));
            } catch (err) { console.error(err); }
        }
    };

    // Handle Password Update Form Submission
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setProfileAlert(null);

        // Basic Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setProfileAlert({ type: 'error', msg: 'Passwords do not match' });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setProfileAlert({ type: 'error', msg: 'Password must be at least 6 characters' });
            return;
        }

        const res = await updatePassword(passwordData.newPassword);
        if (res.success) {
            setProfileAlert({ type: 'success', msg: res.msg });
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } else {
            setProfileAlert({ type: 'error', msg: res.msg });
        }
    };

    // Show loading spinner if user data isn't ready
    if (!user) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="min-h-screen bg-[#FFFDF0] font-sans bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Navbar */}
            <nav className="bg-white border-b-4 border-black px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('tasks')}>
                    <div className="w-10 h-10 bg-[#FF6B6B] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                        <span className="text-white font-black text-xl">P</span>
                    </div>
                    <span className="text-2xl font-black text-black tracking-tight hidden sm:block">Prime Task</span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView('tasks')}
                        className={`font-bold border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none ${view === 'tasks' ? 'bg-[#4ECDC4] text-white' : 'bg-white text-black'}`}
                    >
                        Tasks
                    </button>
                    <button
                        onClick={() => setView('profile')}
                        className={`font-bold border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none ${view === 'profile' ? 'bg-[#FFE66D] text-black' : 'bg-white text-black'}`}
                    >
                        Profile
                    </button>
                    <div className="h-8 w-0.5 bg-black mx-2 hidden sm:block"></div>
                    <button onClick={logout} className="font-bold text-black hover:text-[#FF6B6B] transition-colors">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === 'tasks' ? (
                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Sidebar: Form */}
                        <div className="lg:col-span-4">
                            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sticky top-28">
                                <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                                    {currentTask ? '✏️ Edit Task' : '✨ New Task'}
                                </h2>
                                <TaskForm
                                    addOrUpdateTask={addOrUpdateTask}
                                    currentTask={currentTask}
                                    clearCurrentTask={() => setCurrentTask(null)}
                                />
                            </div>
                        </div>

                        {/* Right Content: Task List */}
                        <div className="lg:col-span-8">
                            <div className="mb-8 flex flex-col sm:flex-row justify-between items-end gap-4">
                                <div>
                                    <h1 className="text-4xl font-black text-black mb-2">My Tasks</h1>
                                    <p className="text-gray-600 font-bold">Manage your daily goals</p>
                                </div>
                                <div className="bg-black text-white px-4 py-2 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                    {filteredTasks.length} Active
                                </div>
                            </div>

                            {/* Search & Filter Toolbar */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="🔍 Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="completed">✅ Completed</option>
                                </select>
                            </div>

                            {loadingTasks ? (
                                <div className="text-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black mx-auto"></div>
                                    <p className="mt-4 font-bold text-gray-500">Loading your world...</p>
                                </div>
                            ) : filteredTasks.length === 0 ? (
                                <div className="text-center py-20 bg-white border-4 border-black border-dashed">
                                    <p className="text-xl font-bold text-gray-500">
                                        {searchQuery ? 'No matching tasks found.' : 'No tasks found. Create one to get started!'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {filteredTasks.map((task) => (
                                        <TaskItem
                                            key={task._id}
                                            task={task}
                                            deleteTask={deleteTask}
                                            setCurrentTask={setCurrentTask}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Profile View */
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-6">
                                <div className="w-20 h-20 bg-[#FFE66D] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="text-4xl">👤</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-black">{user.name}</h1>
                                    <p className="text-gray-600 font-bold">{user.email}</p>
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-black mb-6">Change Password</h2>

                            {profileAlert && (
                                <div className={`mb-6 p-4 border-4 border-black font-bold flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${profileAlert.type === 'error' ? 'bg-[#FF6B6B] text-white' : 'bg-[#4ECDC4] text-white'
                                    }`}>
                                    <span>{profileAlert.type === 'error' ? '⚠️' : '✅'}</span>
                                    {profileAlert.msg}
                                </div>
                            )}

                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-black font-black mb-2 uppercase tracking-wide">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                        placeholder="••••••••"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-black font-black mb-2 uppercase tracking-wide">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-white border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all"
                                        placeholder="••••••••"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#FF6B6B] text-white border-4 border-black p-4 font-black uppercase tracking-wider text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};


export default Dashboard;