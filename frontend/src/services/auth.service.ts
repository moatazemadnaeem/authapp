import api from "@/lib/api";
import { SigninFormValues, SignupFormValues } from "@/lib/validations/auth";
import { setAuthSession, deleteAuthSession } from "@/app/actions/auth";

export const authService = {
  async signIn(data: SigninFormValues) {
    const response = await api.post("/auth/signin", data);
    if (response.data?.access_token) {
      await setAuthSession(response.data.access_token);
    }
    return response.data;
  },

  async signUp(data: SignupFormValues) {
    const response = await api.post("/auth/signup", data);
    if (response.data?.access_token) {
      await setAuthSession(response.data.access_token);
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore server-side logout failures and still clear the local token.
    } finally {
      await deleteAuthSession();
    }
  },

  // SWR fetcher function for fetching welcome message (caching GET queries)
  async fetchWelcomeMessage(url: string) {
    const response = await api.get(url);
    return response.data;
  },
};
