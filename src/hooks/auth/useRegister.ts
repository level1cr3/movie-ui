import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

/*

Exactly ✅ — in most cases, **keep `onSuccess` / `onError` in the component level, not inside the custom hook**.

Here’s why:

---

## 🔹 Why keep them in the component?

1. **Reusability**

   * A hook is just a “bridge” between the API (service) and React Query.
   * If you bake navigation or toasts *inside the hook*, every component that uses it will behave the same — which may not always be what you want.
   * Example: sometimes after registration you want to **navigate to login**, but maybe in another flow you just want a **toast**.

2. **Separation of concerns**

   * Hook = data-fetching/mutation state.
   * Component = what to *do* with that state (UI, navigation, toasts, field errors).

3. **Testability**

   * It’s easier to test hooks when they don’t have side-effects like navigation or global toasts baked in.

---

## 🔹 Where to put what?

* **Services (`authService.ts`)**

  * Only API calls (`axios.post("/auth/register")`).
  * No React Query, no navigation, no toasts.

* **Hooks (`useRegister.ts`)**

  * Wrap services with React Query.
  * Expose mutation state (`isPending`, `error`, `mutate`).
  * No navigation, no toasts (unless global rule).

* **Components (UI layer)**

  * Decide what happens on success (navigate, toast, update UI).
  * Decide how to display errors (toast, inline validation).

---

## 🔹 Example

```ts
 useRegister.ts
export const useRegister = () =>
  useMutation<void, AxiosError<ApiError>, RegisterRequest>({
    mutationFn: register,
  });
```

```tsx
 RegisterForm.tsx
const { mutate: register, isPending } = useRegister();

register(data, {
  onSuccess: () => {
    toast.success("Registered successfully!");
    navigate("/login");
  },
  onError: (error) => {
    const apiError = error.response?.data;
    if (apiError?.errors) {
      apiError.errors.forEach((err) => toast.error(err.message));
    } else {
      toast.error(apiError?.detail || "Something went wrong");
    }
  },
});
```

---

## 🔹 When to put `onError` / `onSuccess` inside the hook?

* If the behavior is **universal and always the same**, e.g.:

  * Refresh token: always retry request or logout user on error.
  * Global error logging (e.g., Sentry).
  * Cache invalidation (React Query stuff like `invalidateQueries`).

But navigation and toasts? → Usually **component level**.

---

👉 Want me to show you a **hybrid pattern** where hooks handle **universal logic** (like cache invalidation) but components handle **UI reactions** (navigation/toasts)? That’s how I usually set it up in real projects.


export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      ✅ Hook ensures data consistency
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};













📐 Industry trends

React Query docs, TanStack, Vercel, and most mature codebases go with:

One hook per function, exported individually.

Grouped by domain (e.g. auth, user, cart, product). (these will be folders inside the hooks folder)

This aligns with Separation of Concerns, which makes your codebase more testable, reusable, and scalable.


Use multiple focused hooks like useLogin, useRegister, useCreateUser in their own files or grouped by domain.


✔️ Use named exports for all your hooks, even if the file only exports one thing.


Pro Tip: Barrel Exports (optional)

If you have many hooks in a domain:

instead of going like this
export * from "./useLogin";
export * from "./useRegister";
export * from "./useLogout";


Do this.
import { useLogin, useRegister } from "@/hooks/auth";







*/
