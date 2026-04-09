import toast from 'react-hot-toast'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { register as registerApi } from '../../api/auth'
import useAuthStore from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
  setLoading(true)
  setApiError('')
  try {
    const res = await registerApi(data)
    setAuth(res.data.user, res.data.token)
    toast.success(`Welcome, ${res.data.user.name.split(' ')[0]}!`)
    navigate('/dashboard')
  } catch (err) {
    setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-sora font-bold text-xl text-white">JobTracker</span>
        </div>

        {/* Card */}
        <div className="bg-surface2 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="font-sora font-bold text-2xl text-white mb-1">Create account</h1>
          <p className="text-slate-400 text-sm mb-6">Start tracking your job applications today</p>

          {apiError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6">
              <p className="text-red-400 text-sm">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' }
              })}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.password_confirmation?.message}
              {...register('password_confirmation', {
                required: 'Please confirm your password',
                validate: (val) => val === watch('password') || 'Passwords do not match'
              })}
            />

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-indigo-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}