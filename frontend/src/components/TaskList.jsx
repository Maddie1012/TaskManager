import { useState } from 'react'
import { load, save, TASKS_KEY, USERS_KEY } from '../storage.js'

const STATUS = ['К выполнению', 'В процессе', 'Выполнено']

export default function TaskList({ project, user, users }) {
  const [tasks, setTasks] = useState(load(TASKS_KEY, []).filter(t => t.projectId === project.id))
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', assignedTo: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function createTask(e) {
    e.preventDefault()
    const newTask = { id: Date.now(), projectId: project.id, title: form.title, description: form.description, dueDate: form.dueDate, assignedTo: Number(form.assignedTo), status: 'К выполнению' }
    const updatedAll = load(TASKS_KEY, [])
    const updated = [...updatedAll, newTask]
    save(TASKS_KEY, updated)
    setTasks(updated.filter(t => t.projectId === project.id))
    setForm({ title: '', description: '', dueDate: '', assignedTo: '' })
  }

  function removeTask(id) {
    const updated = load(TASKS_KEY, []).filter(t => t.id !== id)
    save(TASKS_KEY, updated)
    setTasks(updated.filter(t => t.projectId === project.id))
  }

  function updateStatus(id, status) {
    const all = load(TASKS_KEY, [])
    const idx = all.findIndex(t => t.id === id)
    all[idx].status = status
    save(TASKS_KEY, all)
    setTasks(all.filter(t => t.projectId === project.id))
  }

  const summary = STATUS.map(s => ({
    status: s,
    count: tasks.filter(t => t.status === s).length,
  }))

  return (
    <div>
      <h4>Задачи для {project.title}</h4>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <div>
              <strong>{t.title}</strong> - {t.description} (Дедлайн {t.dueDate}) назначен для {users.find(u => u.id === t.assignedTo)?.name || 'Unassigned'} - Статус: {t.status}
            </div>
            {user.role === 'Руководитель проекта' && user.id === project.leadId && (
              <button onClick={() => removeTask(t.id)}>Удалить</button>
            )}
            {(user.role !== 'Руководитель проекта' && user.id === t.assignedTo) && (
              <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}>
                {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </li>
        ))}
      </ul>
      {user.role === 'Руководитель проекта' && user.id === project.leadId && (
        <form onSubmit={createTask}>
          <input name="title" placeholder="Название" value={form.title} onChange={handleChange} required />
          <input name="description" placeholder="Описание" value={form.description} onChange={handleChange} required />
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
            <option value="">Назначить для...</option>
            {users.filter(u => u.role !== 'Руководитель проекта').map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <button type="submit">Add Task</button>
        </form>
      )}
      {user.role === 'Руководитель проекта' && user.id === project.leadId && (
        <div>
          <h5>Отчет</h5>
          <ul>
            {summary.map(s => (
              <li key={s.status}>{s.status}: {s.count}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}