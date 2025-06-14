import { useState, useEffect } from 'react';
import './index.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const validateTask = (task) => {
    if (!task.trim()) return 'Task cannot be empty';
    if (task.length > 100) return 'Task too long';
    return '';
  };

  const addTask = (e) => {
    e.preventDefault();
    const err = validateTask(newTask);
    if (err) return setError(err);
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      dueDate,
      priority,
      createdAt: new Date()
    };
    setTasks([...tasks, newEntry]);
    setNewTask('');
    setDueDate('');
    setPriority('Medium');
    setError('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id
      ? { ...task, completed: !task.completed }
      : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setNewTask(task.text);
    setDueDate(task.dueDate || '');
    setPriority(task.priority);
  };

  const saveEdit = () => {
    const updated = tasks.map(task =>
      task.id === editingId ? {
        ...task,
        text: newTask,
        dueDate,
        priority
      } : task
    );
    setTasks(updated);
    setEditingId(null);
    setNewTask('');
    setDueDate('');
    setPriority('Medium');
  };

  const getFilteredTasks = () => {
    let list = [...tasks];
    if (filter === 'completed') list = list.filter(t => t.completed);
    else if (filter === 'active') list = list.filter(t => !t.completed);

    if (sortOrder === 'asc') list.sort((a, b) => a.text.localeCompare(b.text));
    else if (sortOrder === 'desc') list.sort((a, b) => b.text.localeCompare(a.text));
    else if (sortOrder === 'date') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">🌈 My To-Do List</h1>
      <form onSubmit={editingId ? saveEdit : addTask} className="input-container">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What do you want to do?"
          className="task-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="task-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="task-input"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="add-button">
          {editingId ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      <div className="controls-container">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-select">
          <option value="default">Default</option>
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
          <option value="date">Newest First</option>
        </select>
      </div>

      <ul className="task-list">
        {getFilteredTasks().map(task => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed-item' : ''}`}>
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="task-checkbox"
              />
              <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.text}</span>
              {task.dueDate && <span className="due-date">📅 {task.dueDate}</span>}
              <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
            </div>
            <div>
              <button className="edit-button" onClick={() => startEdit(task)}>✏️</button>
              <button className="delete-button" onClick={() => removeTask(task.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
