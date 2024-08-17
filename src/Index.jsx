import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import readExcelFromUrl from "./lib/fetchExcel";
import defaultConfig from "./pages/defaultConfig";

const Index = () => {
  const once = useRef(false);
  const [data, setData] = useState(null);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const navigate = useNavigate();

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    let config = localStorage.getItem("config");
    if(!config){
      localStorage.setItem("config", JSON.stringify(defaultConfig()))
    }

    let datas = localStorage.getItem("datas")
    if(datas )
    {
       
        setData(JSON.parse(datas));
    }
    else
    {
      readExcelFromUrl().then((output)=>{if(output!==undefined){setData(output);localStorage.setItem("datas", JSON.stringify(output));console.log(output)}else{window.location.reload()}});
    }

  }, [])

  function syncNow()
  {
    localStorage.removeItem("datas");
    window.location.reload();
  }
  return (<>
  <ToastContainer />
  <div className="flex flex-col">
    <div className="flex justify-around bg-teal-900 py-2 text-white">
      <div className="text-2xl"><img src="./img/SheetRoutine.svg" alt="Sheet Rutine" className="h-full w-10" /></div>
      <div className="flex gap-7 p-2">
        
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
{data && 
    
    <div class="my-1 flex justify-between rounded-xl bg-teal-800 p-4 text-center text-black">
  <div class="p-1 text-white">Synced at {new Date(data.updated).getDate()} {months[new Date(data.updated).getMonth()]} {new Date(data.updated).getHours()}:{new Date(data.updated).getMinutes()}</div>

  <button onClick={()=>syncNow()} class="rounded-xl bg-green-300 px-3 py-1">Sync Now</button>
</div>}
    <Outlet context={[data, setData]}/>
      

    </div>

    </div>

  </>);
};
export default Index;