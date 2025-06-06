export function load(key, defaultValue) {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : defaultValue
}

export function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export const USERS_KEY = 'tm_users'
export const PROJECTS_KEY = 'tm_projects'
export const TASKS_KEY = 'tm_tasks'
export const CURRENT_USER_KEY = 'tm_current_user'