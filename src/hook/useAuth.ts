import { toast } from "react-toastify";

export default function useAuth() {
  const requireAuth = (returnUrl: string) => {
    const encodedReturnUrl = encodeURIComponent(returnUrl);
    toast.error("로그인이 필요합니다.");
    setTimeout(() => {
      window.location.href = `/users/login?redirect=${encodedReturnUrl}&error=Unauthorized`;
    }, 1000);
  };

  return requireAuth;
}
