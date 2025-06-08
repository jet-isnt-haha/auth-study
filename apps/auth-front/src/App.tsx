import React, { Suspense, type FC } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
const App: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
