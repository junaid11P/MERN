import { useState, useEffect } from 'react';

const TaskForm = ({ addOrUpdateTask, currentTask, clearCurrentTask }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'pending',
    });

    useEffect(() => {
        if (currentTask) {
            setTask(currentTask);
        } else {
            setTask({ title: '', description: '', status: 'pending' });
        }
    }, [currentTask]);

    const onChange = (e) =>
        setTask({ ...task, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();
        addOrUpdateTask(task);
        if (!currentTask) {
            setTask({ title: '', description: '', status: 'pending' });
        }
    };

    const handleCancel = () => {
        clearCurrentTask();
        setTask({ title: '', description: '', status: 'pending' });
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="What needs to be done?"
                    value={task.title}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors sm:text-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                    name="description"
                    placeholder="Add details..."
                    value={task.description}
                    onChange={onChange}
                    rows="4"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors sm:text-sm resize-none"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                    name="status"
                    value={task.status}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors sm:text-sm cursor-pointer bg-white"
                >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTask
                        ? 'bg-amber-600 hover:bg-amber-500 focus:ring-amber-500'
                        : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500'
                        }`}
                >
                    {currentTask ? 'Update Task' : 'Add Task'}
                </button>

                {currentTask && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;