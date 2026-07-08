import useSWR from "swr";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export function useAuth() {
  const router = useRouter();
  const { data, error, mutate, isValidating } = useSWR(
    "/app/welcome",
    authService.fetchWelcomeMessage,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (err) => {
        if (err.response?.status === 401 || err.status === 401) {
          authService.logout();
          router.push("/signin");
        }
      },
    },
  );

  const handleLogout = async () => {
    await authService.logout();
    await mutate(null, false);
    router.push("/signin");
  };

  return {
    user: data?.user || null,
    message: data?.message || "",
    isLoading: !data && !error,
    isAuthenticated: !!data,
    isValidating,
    logout: handleLogout,
    error,
    mutate,
  };
}
