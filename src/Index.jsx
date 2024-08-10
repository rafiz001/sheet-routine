import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

const Index = () => {
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;


  }, [])


  return (<>
  <ToastContainer />
  <div className="flex flex-col">
    <div className="flex justify-around bg-teal-900 py-2 text-white">
      <div className="text-2xl">Sheet Routine</div>
      <div className="flex gap-7">
        
        <NavLink to={`/`} 
        className={({ isActive, isPending }) =>
          isActive
            ? " border-b-2 "
            : isPending
            ? "pending"
            : ""
        }
      
        >Routine</NavLink>
        <NavLink to={`config`} 
        className={({ isActive, isPending }) =>
          isActive
            ? " border-b-2 "
            : isPending
            ? "pending"
            : ""
        }
      
        >Config</NavLink>
      </div>
    </div>
    <div className="pb-7 bg-teal-950 px-5 md:px-40 xl:px-72">
    <Outlet />
      

    </div>

    </div>

  </>);
};
export default Index;