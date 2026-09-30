import { useApp } from '../context/AppContext';

export function useAuth() {
  const { currentUser, role, loginWithRole, logout } = useApp();
  return {
    currentUser,
    role,
    isAuthenticated: !!currentUser,
    loginWithRole,
    logout
  };
}
