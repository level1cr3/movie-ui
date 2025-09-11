import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors theme="light" />
    </>
  );
}

export default App;
