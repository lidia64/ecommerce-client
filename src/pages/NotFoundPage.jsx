import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-black text-slate-200 select-none">404</p>
      <h1 className="text-2xl font-bold text-slate-900 -mt-4 mb-2">Page not found</h1>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  )
}
