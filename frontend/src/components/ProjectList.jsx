import { useState } from 'react'
import { save, PROJECTS_KEY } from '../storage.js'
import TaskList from './TaskList.jsx'

export default function ProjectList({ user, projects, users, onAdd }) {
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: '', description: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function createProject(e) {
    e.preventDefault()
    const newProject = { id: Date.now(), title: form.title, description: form.description, leadId: user.id }
    const updated = [...projects, newProject]
    save(PROJECTS_KEY, updated)
    onAdd(newProject)
    setForm({ title: '', description: '' })
  }

  return (
    <div>
      <h3>Projects</h3>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <button onClick={() => setSelected(p)}>{p.title}</button>
          </li>
        ))}
      </ul>
      {user.role === 'teamlead' && (
        <form onSubmit={createProject}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <button type="submit">Add Project</button>
        </form>
      )}
      {selected && <TaskList project={selected} user={user} users={users} />}
    </div>
  )
}