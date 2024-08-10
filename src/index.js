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


const router = createHashRouter([
  {
    path: "/",
    element: <Index/>,
    
    children: [
      {
        path: "/",
        element: <Routine />,
      },
      {
        path: "config",
        element: <Config />,
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