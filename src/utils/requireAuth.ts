import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function useAuth() {
  const router = useRouter();

  const requireAuth = (returnUrl: string) => {
    const encodedReturnUrl = encodeURIComponent(returnUrl);
    toast.error("로그인이 필요합니다.");
    router.push(`/users/login?redirect=${encodedReturnUrl}&error=Unauthorized`);
  };

  return requireAuth;
}
