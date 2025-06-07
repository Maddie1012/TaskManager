import { useState } from 'react'
import { load, save, USERS_KEY, CURRENT_USER_KEY } from '../storage.js'

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'developer' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function login() {
    const users = load(USERS_KEY, [])
    const user = users.find(u => u.email === form.email && u.password === form.password)
    if (user) {
      save(CURRENT_USER_KEY, user.id)
      onAuth(user)
    } else {
      alert('Неверные данные')
    }
  }

  function register() {
    const users = load(USERS_KEY, [])
    if (users.some(u => u.email === form.email)) {
      alert('Пользователь с таким email уже существует')
      return
    }
    const newUser = { id: Date.now(), email: form.email, password: form.password, name: form.name, role: form.role }
    users.push(newUser)
    save(USERS_KEY, users)
    save(CURRENT_USER_KEY, newUser.id)
    onAuth(newUser)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (isLogin) login()
    else register()
  }

  return (
    <div style={{

    }}>
      <h2>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="email" placeholder="Почта" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <input type="password" name="password" placeholder="Пароль" value={form.password} onChange={handleChange} required />
        </div>
        {!isLogin && (
          <>
            <div>
              <input name="name" placeholder="Имя" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="teamlead">Тимлид</option>
                <option value="developer">Разработчик</option>
                <option value="tester">Тестировщик</option>
              </select>
            </div>
          </>
        )}
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  )
}