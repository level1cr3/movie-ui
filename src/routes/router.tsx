import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "@/layout/PublicLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <div>Not Found</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
