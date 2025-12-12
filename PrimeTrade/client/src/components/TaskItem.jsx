const TaskItem = ({ task, deleteTask, setCurrentTask }) => {
    // Modern "Pill" style badges with soft colors
    const statusStyles = {
        'completed': 'bg-green-100 text-green-700 border-green-200',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
        'pending': 'bg-amber-100 text-amber-700 border-amber-200',
    };

    const statusLabels = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'pending': 'Pending',
    };

    return (
        <div className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[task.status]}`}>
                    {statusLabels[task.status]}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                    {new Date(task.createdAt).toLocaleDateString()}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                {task.title}
            </h3>

            <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                {task.description}
            </p>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                    onClick={() => setCurrentTask(task)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <span className="text-base">✏️</span> Edit
                </button>
                <button
                    onClick={() => deleteTask(task._id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <span className="text-base">🗑️</span> Delete
                </button>
            </div>
        </div>
    );
};

export default TaskItem;