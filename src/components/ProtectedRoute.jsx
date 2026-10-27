import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ isAuthenticated, children }) {
  const location = useLocation()
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />
}
