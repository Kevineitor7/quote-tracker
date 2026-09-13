import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../store/useAuthStore.js'

export default function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}