import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateProfile, updatePassword } from '../../api/profile'
import useAuthStore from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Profile() {
  const { user, setAuth, token } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm({ defaultValues: { name: user?.name, email: user?.email } })

  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm()

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      setAuth(res.data, token)
      toast.success('Profile updated!')
    },
    onError: (err) => {
      const errors = err.response?.data?.errors
      if (errors?.email) toast.error(errors.email[0])
      else toast.error(err.response?.data?.message || 'Failed to update profile')
    },
  })

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated!')
      resetPassword()
    },
    onError: (err) => {
      const errors = err.response?.data?.errors
      if (errors?.current_password) toast.error(errors.current_password[0])
      else toast.error(err.response?.data?.message || 'Failed to update password')
    },
  })

  return (
    <div className="space-y-5 w-full max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="font-sora font-bold text-xl md:text-2xl text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account information and security</p>
      </div>

      {/* Avatar card */}
      <div style={{ background: '#111827', border: '1px solid #1e293b' }} className="rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <span className="font-sora font-bold text-xl md:text-2xl text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="font-sora font-semibold text-white text-base md:text-lg truncate">
              {user?.name}
            </h2>
            <p className="text-slate-400 text-sm truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-green-400 font-medium">Active account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#111827', border: '1px solid #1e293b' }} className="rounded-xl p-1 flex gap-1">
        {[
          {
            id: 'profile',
            label: 'Profile Info',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          },
          {
            id: 'password',
            label: 'Change Password',
            icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
          },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg
              text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
              }
            `}
            style={activeTab !== tab.id ? { ':hover': { background: 'rgba(255,255,255,0.05)' } } : {}}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Info Tab */}
      {activeTab === 'profile' && (
        <div
          style={{ background: '#111827', border: '1px solid #1e293b' }}
          className="rounded-2xl overflow-hidden animate-fade-in"
        >
          <div style={{ borderBottom: '1px solid #1e293b' }} className="px-5 md:px-6 py-4">
            <h3 className="font-sora font-semibold text-white">Personal Information</h3>
            <p className="text-slate-500 text-xs mt-0.5">Update your name and email address</p>
          </div>
          <div className="p-5 md:p-6">
            <form
              onSubmit={handleProfile((data) => profileMutation.mutate(data))}
              className="space-y-4"
            >
              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                error={profileErrors.name?.message}
                {...regProfile('name', { required: 'Name is required' })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                error={profileErrors.email?.message}
                {...regProfile('email', { required: 'Email is required' })}
              />

              {/* Info note */}
              <div
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
                className="rounded-xl px-4 py-3 flex items-start gap-3"
              >
                <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-indigo-300 text-xs leading-relaxed">
                  Changing your email will update your login credentials. Make sure the new email is valid.
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" loading={profileMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div
          style={{ background: '#111827', border: '1px solid #1e293b' }}
          className="rounded-2xl overflow-hidden animate-fade-in"
        >
          <div style={{ borderBottom: '1px solid #1e293b' }} className="px-5 md:px-6 py-4">
            <h3 className="font-sora font-semibold text-white">Change Password</h3>
            <p className="text-slate-500 text-xs mt-0.5">Use a strong unique password</p>
          </div>
          <div className="p-5 md:p-6">
            <form
              onSubmit={handlePassword((data) => passwordMutation.mutate(data))}
              className="space-y-4"
            >
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.current_password?.message}
                {...regPassword('current_password', { required: 'Current password is required' })}
              />

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div style={{ background: '#1e293b' }} className="flex-1 h-px" />
                <span className="text-xs text-slate-600">new password</span>
                <div style={{ background: '#1e293b' }} className="flex-1 h-px" />
              </div>

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.password?.message}
                {...regPassword('password', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                error={passwordErrors.password_confirmation?.message}
                {...regPassword('password_confirmation', {
                  required: 'Please confirm your new password',
                  // eslint-disable-next-line react-hooks/incompatible-library
                  validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
              />

              {/* Requirements */}
              <div
                style={{ background: '#1e293b', border: '1px solid #334155' }}
                className="rounded-xl p-4"
              >
                <p className="text-xs text-slate-400 font-medium mb-2">Requirements</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'At least 8 characters',
                    'Mix letters and numbers',
                    'Avoid personal info',
                    'Use a unique password',
                  ].map((hint) => (
                    <div key={hint} className="flex items-center gap-2">
                      <div
                        style={{ background: '#475569' }}
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      />
                      <span className="text-xs text-slate-500">{hint}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" loading={passwordMutation.isPending}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Privacy card */}
      <div
        style={{ background: '#111827', border: '1px solid #1e293b' }}
        className="rounded-2xl p-5 md:p-6"
      >
        <div className="flex items-start gap-4">
          <div
            style={{ background: '#1e293b' }}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="font-sora font-semibold text-white text-sm">Your data is private</h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              All your job applications are only visible to you. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}