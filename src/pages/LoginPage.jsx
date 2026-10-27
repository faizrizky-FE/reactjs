import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginSchema } from '../schemas/forms'
import '../styles/admin-page.css'

export default function LoginPage({ onLogin }) {
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function submit(values) {
    setLoginError('')
    if (values.email !== 'admin@myshop.test' || values.password !== 'myshop123') {
      setLoginError('Email atau kata sandi admin tidak cocok.')
      return
    }
    onLogin()
    navigate(location.state?.from?.pathname || '/admin', { replace: true })
  }

  return (
    <section className="admin-page section-pad">
      <div className="admin-auth-card">
        <span className="eyebrow">Area pengelola</span>
        <h1>Masuk ke Admin</h1>
        <p>Gunakan akun admin lokal untuk mengelola katalog di browser ini.</p>
        <div className="admin-local-credentials">Akun lokal: <strong>admin@myshop.test</strong> / <strong>myshop123</strong></div>
        <form className="admin-form" onSubmit={handleSubmit(submit)} noValidate>
          <label>Email<input type="email" autoComplete="username" {...register('email')} />{errors.email && <small>{errors.email.message}</small>}</label>
          <label>Kata sandi<input type="password" autoComplete="current-password" {...register('password')} />{errors.password && <small>{errors.password.message}</small>}</label>
          {loginError && <p className="form-server-error" role="alert">{loginError}</p>}
          <button className="button button-primary" disabled={isSubmitting}>{isSubmitting ? 'Memeriksa...' : 'Masuk'}</button>
        </form>
      </div>
    </section>
  )
}
