import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ErrorPage from "./error-page";
import Root from "./routes/root";
import AuthDevices from "./routes/auth/devices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "auth/devices",
        element: <AuthDevices />,
      },
    ],
  },
]);

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;
