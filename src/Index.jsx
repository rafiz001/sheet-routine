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
  const [netLoader,setNetLoader] = useState('Sync Now');
  useEffect(() => {
    /*if (once.current) return;
    once.current = true;*/

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
      readExcelFromUrl().then((output)=>
        {
          if(output!==undefined)
            {
              setData(output);
              localStorage.setItem("datas", JSON.stringify(output));
              console.log(output);
            }
          else
          {
            toast.error("Unable to fetch file!");
            //window.location.reload()
          }});
    }

  }, [])
  const checkInternetConnection = async () => {
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD', 
        mode: 'no-cors', 
      });
  
      return true;
    } catch (error) {
      console.error('No internet connection:', error);
      return false;
    }
  };
  
  async function syncNow()
  {
    setNetLoader('Pinging')
    const online =await checkInternetConnection();
    if(online)
    {
      localStorage.removeItem("datas");
      window.location.reload();
      location.reload();
    }
    else toast.error("Maybe internet connection issue.");
    setNetLoader('Sync Now')
  }
  return (<>
  <ToastContainer />
  <div className=" flex flex-col mb-10">
    <div className="flex justify-around bg-teal-900 py-2 text-white fixed left-0 bottom-0 w-full">
      
      
        
        <NavLink to={`/`} 
        className={({ isActive, isPending }) =>
          isActive
            ? " border-b-2 "
            : isPending
            ? "pending"
            : ""
        }
      
        >Routine</NavLink>


        <NavLink to={`full`} 
        className={({ isActive, isPending }) =>
          isActive
            ? " border-b-2 "
            : isPending
            ? "pending"
            : ""
        }
      
        >Full Routine</NavLink>



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
    <div className="pb-7 bg-teal-950 px-5 md:px-40 xl:px-72">
{data && 
    
    <div className="my-1 flex justify-between rounded-xl bg-teal-800 p-4 text-center text-black">
  <div className="p-1 text-white">Synced at {new Date(data.updated).getDate()} {months[new Date(data.updated).getMonth()]} {new Date(data.updated).getHours()}:{new Date(data.updated).getMinutes()}</div>

  <button onClick={()=>syncNow()} className="rounded-xl bg-green-300 px-3 py-1">{netLoader}</button>
</div>}
    <Outlet context={[data, setData]}/>
      

    </div>

    </div>

  </>);
};
export default Index;