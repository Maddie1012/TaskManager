import { useState } from 'react'
import { load, save, CURRENT_USER_KEY, USERS_KEY, PROJECTS_KEY } from '../storage.js'
import ProjectList from './ProjectList.jsx'

export default function Dashboard({ user, onLogout }) {
  const users = load(USERS_KEY, [])
  const [projects, setProjects] = useState(load(PROJECTS_KEY, []))

  function addProject(project) {
    const updated = [...projects, project]
    setProjects(updated)
    save(PROJECTS_KEY, updated)
  }

  return (
    <div>
      <h2>Hello, {user.name} ({user.role})</h2>
      <button onClick={() => { save(CURRENT_USER_KEY, null); onLogout() }}>Logout</button>
      <ProjectList user={user} projects={projects} users={users} onAdd={addProject} />
    </div>
  )
}