import FocusedPageContainer from "@/components/common/FocusedPageContainer";
import Loader from "@/components/common/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { CheckCircle, TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  const isValidParams = userId && token;
  const {
    mutate: verifyEmail,
    isPending,
    isSuccess,
    isError,
  } = useVerifyEmail();

  useEffect(() => {
    if (!isValidParams) return;
    const request = { userId, token };
    verifyEmail(request);
  }, []);

  if (isPending) {
    return <Loader message="Verifying your email..." />;
  }

  if (!isValidParams || isError) {
    return (
      <FocusedPageContainer>
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>
            This verification link is invalid or has expired.
          </AlertTitle>
          <AlertDescription>
            Go to the login page to request a new verification link.
            <Button variant="link" asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </FocusedPageContainer>
    );
  }

  if (isSuccess) {
    return (
      <FocusedPageContainer>
        <Alert variant="success">
          <CheckCircle />
          <AlertTitle>Your email has been verified.</AlertTitle>
          <AlertDescription>
            You can now log in.
            <Button variant="link" asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </FocusedPageContainer>
    );
  }
};

export default VerifyEmail;

/*
# OPTION 1
for this type of urls :> /verify-email?userId=123&token=fasjdklfjalskd
{
  path: "verify-email",
  element: <VerifyEmail />,
}

import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
}



# OPTION 2
for this kinda path 

    {
        path: "verify-email/:userId/:token", // "/verify-email/123/abc123"
        element: <VerifyEmail />,
      },

use this in that component to get value.
const { userId, token } = useParams();


below is detailed info of usls like this "/verify-email/123/abc123"

Here are concise notes based on your input:

---

## 📘 React Router – Dynamic Route Params & Usage

### ✅ Route Definition with Parameters

When you define a route with dynamic parameters, use `:` to specify them:

```js
{
  path: "verify-email/:userId/:token", // Example URL: "/verify-email/123/abc123"
  element: <VerifyEmail />,
}
```

* `:userId` and `:token` are **route parameters**.
* These are placeholders for dynamic values in the URL.

---

### ✅ Accessing Parameters in the Component

In the component (`VerifyEmail`), use `useParams()` from `react-router-dom` to extract the values:

```js
import { useParams } from 'react-router-dom';

const { userId, token } = useParams();
```

* `userId` will contain `"123"` if the URL is `/verify-email/123/abc123`
* `token` will contain `"abc123"`

---

### 📌 Example Usage in Component

```jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const { userId, token } = useParams();

  return (
    <div>
      <h1>Verifying Email</h1>
      <p>User ID: {userId}</p>
      <p>Token: {token}</p>
    </div>
  );
};

export default VerifyEmail;


*/
