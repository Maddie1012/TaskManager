import { useState } from 'react'
import { load, save, USERS_KEY, CURRENT_USER_KEY } from '../storage.js'

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'Разработчик' })

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
        width: '100%',
        maxWidth: '250px',
        marginTop: '150px',
    }}>
      <h2 style={{
        textAlign: 'center',
      }}>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input style={{
            width: '-webkit-fill-available',
          }} name="email" placeholder="Почта" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <input style={{
            width: '-webkit-fill-available',
          }} type="password" name="password" placeholder="Пароль" value={form.password} onChange={handleChange} required />
        </div>
        {!isLogin && (
          <>
            <div>
              <input style={{
                width: '-webkit-fill-available',
              }} name="name" placeholder="Имя" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <select style={{
                width: '-webkit-fill-available',
              }} name="role" value={form.role} onChange={handleChange}>
                <option value="Руководитель проекта">Руководитель проекта</option>
                <option value="Разработчик">Разработчик</option>
                <option value="Тестировщик">Тестировщик</option>
              </select>
            </div>
          </>
        )}
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <button style={{
        width: '-webkit-fill-available',
      }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  )
}