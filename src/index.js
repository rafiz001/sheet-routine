import React from "react";
import ReactDOM from "react-dom";
import Index from "./Index.jsx";
import Config from "./pages/Config.jsx";
import Routine from "./pages/Routine.jsx";
import readExcelFromUrl from './lib/fetchExcel.js'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Full from "./pages/Full.jsx";
import Live from "./pages/Live.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";


const router = createHashRouter([
  {
    path: "/",
    element: <Index/>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Routine />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "full",
        element: <Full />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "live",
        element: <Live />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "config",
        element: <Config />,
        errorElement: <ErrorBoundary />,
      },
      

      
    ],
  },
]);

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
      
    </React.StrictMode>
  );