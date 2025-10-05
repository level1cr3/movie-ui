import { useAuthStore } from "@/stores/authStore";
import axios, {
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";

const axiosDefaults: CreateAxiosDefaults = {
  baseURL: "https://localhost:7145/api",
  timeout: 10000, // 10s seconds default.
};

const refreshApi = axios.create({
  ...axiosDefaults,
  withCredentials: true,
  // withCredentials true to send refresh token from httpOnly cookie
});

/*
gonna use this refreshApi for refresh. because using main api could cause recursive loops
Why?
The refresh token call itself goes through the same interceptor chain.
If /auth/refresh-token also returns 401, the interceptor will trigger again → infinite loop.

But you might say well. my refresh token endpoint is not secured. so it won't return 401.
Even if your refresh endpoint never returns `401`, it’s still **best practice** to keep a separate Axios instance for refresh tokens.

**Why?**
* Keeps refresh flow isolated → no risk of accidental interceptor recursion in the future.
* Makes it easier to add custom behavior for refresh (timeouts, retries, logging).
* If you later secure refresh (e.g. with IP checks, device checks), you won’t need to refactor everything.
So yes → use a small `refreshApi` just for `/auth/refresh-token`, and keep your main `api` clean.

Avoid interceptor recursion completely:
Your main api instance has the response interceptor.
The refresh call should not trigger the same interceptor, otherwise even with the guard, you’re adding unnecessary logic paths and risk subtle bugs.

*/

const api = axios.create(axiosDefaults); // this create method gives me axios Instance

// Example of overriding for a long-running request
// axiosInstance.get("/big-report", { timeout: 30000 });

// request interceptor (eg: to add auth token, audit logging)
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
type RefreshSubscriber = (token: string) => void;
let refreshSubscribers: RefreshSubscriber[] = [];
// a page might have many api calls and these api calls can fail simultaneously when token expires. so they all will hit the response interceptor as well.
// so we want to queue these request. let one resolve and get the refresh token. this is array of functions.

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token)); // this runs all the queued callbacks resolving their promises with new Token.
  refreshSubscribers = []; // then reset. It is important.
}

// response interceptor (eg : error handling, refresh token etc)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.config) {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue until refresh done.
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      if (error.response?.status === 401) {
        originalRequest._retry = true;
        isRefreshing = true; // queueing other request fails. till below refresh-token request has been resolved
        const { setAuth, clearAuth } = useAuthStore.getState().actions;
        try {
          const res = await refreshApi.post("/auth/refresh-token");
          const newToken = res.data.accessToken;
          setAuth(newToken);
          onRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          clearAuth(); // we will trigger navigation to login. from the consumer of this api not here.
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // for error logging and other stuff.
    return Promise.reject(error); //centerlize error logging
  }
);

export default api;

/*
> Don't use localStorage to store token that is vulnerable to XSS attack. don't expose it to js.
> keep it in state. 
> But on pageReload. state resets so what will do is we will request it via refresh token.
> refresh token is stored in cookie httpdOnly and it gets send automatically to backend api server. and only server manipulates it not client 



`withCredentials: true` is an **Axios (and XHR/fetch) option** that tells the browser:

👉 “When making this request, include credentials such as cookies, authorization headers, or TLS client certificates.”

### Why it matters:

* By default, **cross-site requests** (to a different domain, subdomain, or port) **don’t send cookies** for security reasons.
* Setting `withCredentials: true` ensures that cookies (like your `HttpOnly` refresh token) are sent along with the request.
* It also allows the browser to accept `Set-Cookie` headers in the response if the server allows it.

### Example:

If you store your refresh token in an **HttpOnly cookie**, then:

```ts
await api.post("/auth/refresh-token", {}, { withCredentials: true });
```

→ This sends the cookie to the server, so the backend can validate it and return a new access token.

### Server-side requirements:

For this to work correctly:

* The backend must send **CORS headers** like:

  ```http
  Access-Control-Allow-Origin: https://your-frontend.com
  Access-Control-Allow-Credentials: true
  ```
* The cookie itself must be set with proper flags:

  * `HttpOnly`
  * `Secure` (if using HTTPS, which you should)
  * `SameSite=None` (if cross-site)

⚡Without `withCredentials: true`, your request would go through, but **cookies would not be sent/received**, breaking refresh token flows.

---


2️⃣ Why _retry exists even with the refresh endpoint check

You asked:

Retry original request → it fails again with 401. Why would this happen if we just refreshed the token?

Ideally, if refresh is successful, the retry should never fail with 401.

But in reality, race conditions or misconfigured tokens can happen:

Two requests trigger refresh at almost the same time.

One request updates the token; the other tries with an old token (if not queued properly).

Network issues or server bugs may cause a retry to still return 401.

_retry is a safety net to prevent infinite loops even in those edge cases.

*/
