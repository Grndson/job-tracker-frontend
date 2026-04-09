import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createApplication, updateApplication } from '../../api/applications'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

export default function ApplicationDrawer({ open, onClose, application = null }) {
  const queryClient = useQueryClient()
  const isEdit = !!application

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (application) {
      reset({
        company_name:   application.company_name,
        job_title:      application.job_title,
        job_url:        application.job_url || '',
        status:         application.status,
        priority:       application.priority,
        applied_date:   application.applied_date || '',
        follow_up_date: application.follow_up_date || '',
        salary_min:     application.salary_min || '',
        salary_max:     application.salary_max || '',
        location:       application.location || '',
        notes:          application.notes || '',
      })
    } else {
      reset({
        company_name: '', job_title: '', job_url: '',
        status: 'wishlist', priority: 'medium',
        applied_date: '', follow_up_date: '',
        salary_min: '', salary_max: '',
        location: '', notes: '',
      })
    }
  }, [application, open, reset])

  const mutation = useMutation({
    mutationFn: (data) => isEdit
      ? updateApplication(application.id, data)
      : createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success(isEdit ? 'Application updated!' : 'Application added!')
      onClose()
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Something went wrong'
      toast.error(msg)
    }
  })

  const onSubmit = (data) => {
    const cleaned = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? null : v])
    )
    mutation.mutate(cleaned)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-surface1 border-l border-slate-800 z-50 animate-slide-in flex flex-col">

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="font-sora font-bold text-lg text-white">
              {isEdit ? 'Edit Application' : 'New Application'}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {isEdit ? 'Update the details below' : 'Fill in the job details below'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              placeholder="Google"
              error={errors.company_name?.message}
              {...register('company_name', { required: 'Required' })}
            />
            <Input
              label="Job Title *"
              placeholder="Software Engineer"
              error={errors.job_title?.message}
              {...register('job_title', { required: 'Required' })}
            />
          </div>

          <Input
            label="Job URL"
            type="url"
            placeholder="https://jobs.example.com/..."
            error={errors.job_url?.message}
            {...register('job_url')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Status" {...register('status')}>
              <option value="wishlist">Wishlist</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </Select>
            <Select label="Priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Applied Date" type="date" {...register('applied_date')} />
            <Input
              label="Follow-up Date"
              type="date"
              error={errors.follow_up_date?.message}
              {...register('follow_up_date')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Salary Min" type="number" placeholder="80000" {...register('salary_min')} />
            <Input label="Salary Max" type="number" placeholder="120000" {...register('salary_max')} />
          </div>

          <Input label="Location" placeholder="Remote / New York, NY" {...register('location')} />
          <Textarea label="Notes" placeholder="Add any notes about this application..." {...register('notes')} />
        </form>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Add Application'}
          </Button>
        </div>
      </div>
    </>
  )
}