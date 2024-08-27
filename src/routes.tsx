import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import Logout from "./components/Logout";
import LibraryListPage from "./pages/LibraryListPage";
import LibraryItemFormPage from "./pages/LibraryItemFormPage";
import CategoryFormPage from "./pages/CategoryFormPage";
import LibraryPage from "./pages/LibraryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "library-items", element: <LibraryPage /> },
      { path: "library-items/new", element: <LibraryItemFormPage /> },
      { path: "library-items/:id", element: <LibraryItemFormPage /> },
      { path: "library-items/edit", element: <LibraryListPage /> },
      { path: "categories", element: <CategoryFormPage /> },
      { path: "categories/:id", element: <CategoryFormPage /> },
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/not-found",
    element: <NotFoundPage />,
  },
  { path: "/logout", element: <Logout /> },
]);

export default router;
