
// Import the actual toast implementation from shadcn ui
import { useToast as useToastImpl, type ToastActionElement, type ToastProps } from "@/components/ui/toast"

// Re-export the hook and types
export const useToast = useToastImpl;
export type { ToastActionElement, ToastProps };

// Export the toast function
export const toast = (props: ToastProps) => {
  const { toast } = useToastImpl()
  return toast(props)
}
