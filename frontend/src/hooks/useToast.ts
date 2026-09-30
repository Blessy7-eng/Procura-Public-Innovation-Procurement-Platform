import { useApp } from '../context/AppContext';

export function useToast() {
  const { toasts, showToast, dismissToast } = useApp();
  return {
    toasts,
    showToast,
    dismissToast
  };
}
