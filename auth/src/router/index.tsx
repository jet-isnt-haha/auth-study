import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

//懒加载组件
const AppPage = lazy(() => import("@/App"));
const LoginPage = lazy(() => import("@/layout/Login"));
const RegistryPage = lazy(() => import("@/layout/Registry"));
const router = createBrowserRouter([
  {
    //spa
    path: "/",
    element: <div>home</div>,
    children: [{ index: true }],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registry",
    element: <RegistryPage />,
  },
]);

export default router;
