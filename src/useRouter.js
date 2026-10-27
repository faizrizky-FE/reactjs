import { useLocation, useNavigate } from 'react-router-dom'

export function useRouter() {
  const location = useLocation()
  const navigate = useNavigate()
  return { location: `${location.pathname}${location.search}`, navigate }
}
