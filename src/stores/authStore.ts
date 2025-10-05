import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

// separate state and actions. actions are function that modify our state. These are static and don't change. so we can hold all of them in single actions object to hold all of them.
// when consuming the actions. in component or else where we will just get actions. and then destructure it to get all the actions.
// But for state however we will only get one state at a time.
type AuthActions = {
  setAuth: (token: string, user?: User) => void;
  clearAuth: () => void;
};

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  actions: AuthActions;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  actions: {
    setAuth: (token, user) =>
      set((state) => ({ accessToken: token, user: user ?? state.user })),
    clearAuth: () => set({ user: null, accessToken: null }),
  },
}));

// we should only use atomic selector for state. that means we should only ever get one of them.
// we can break above rule for actions however because they are static and never change.
