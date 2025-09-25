import { useAuthStore } from "@/stores/authStore";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const isLoggedIn = !!useAuthStore.getState().accessToken; // !! convert truthy and falsy to boolean

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return false;
        }

        if (isLoggedIn) {
          // retry only network-level failures
          if (axios.isAxiosError(error) && !error.response) {
            return failureCount < 2;
          }
          return false;
        }

        return failureCount < 3; // for users that are not logged in.
      },

      // Refetch settings
      refetchOnWindowFocus: false, // avoid noisy refetch when switching tabs
      refetchOnReconnect: true, // useful if network drops
      refetchOnMount: true, // ensures freshness when component mounts
      staleTime: 60_000, // cache considered fresh for 1 minute
      gcTime: 5 * 60_000, // cached data is garbage-collected 5 min after being unused
    },
    mutations: {
      retry: false,
    },
  },
});
