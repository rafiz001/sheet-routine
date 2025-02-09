import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import readExcelFromUrl from "./lib/fetchExcel";
import defaultConfig from "./pages/defaultConfig";
import { formatDistance } from "date-fns";
import { PiBackpack, PiGearFine, PiGlobe } from "react-icons/pi";


const Index = () => {
  const once = useRef(false);
  const [data, setData] = useState(null);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const navigate = useNavigate();
  const [netLoader, setNetLoader] = useState('Sync Now');
  const [selectedClass, setSelectedClass] = useState({ semester: '', section: '' });

  const [startPoint, setStartPoint] = useState(0);
  const [pullChange, setPullChange] = useState(0);
  const refreshCont = useRef(0);

  function syncer() {
    setData(null);
    readExcelFromUrl().then((output) => {
      if (output !== undefined) {
        setData(output);
        localStorage.setItem("datas", JSON.stringify(output));
        console.log(output);

      }
      else {
        toast.error("Unable to fetch file!");
      }
    });
  }

  useEffect(() => {
    /*if (once.current) return;
    once.current = true;*/

    let config = localStorage.getItem("config");
    if (!config) {
      localStorage.setItem("config", JSON.stringify(defaultConfig()))
    }

    let datas = localStorage.getItem("datas")
    if (datas) {

      setData(JSON.parse(datas));
    }
    else {
      syncer();
    }


    let class_ = localStorage.getItem("class");
    if (class_) {
      setSelectedClass(JSON.parse(class_));

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

  async function syncNow() {
    setNetLoader('Pinging')
    const online = await checkInternetConnection();
    if (online) {

      /*
      if (typeof window.Android !== "undefined" && typeof window.Android.reloadWebView === "function") {
        window.Android.reloadWebView();
      }
      else {
        window.location.reload();
        location.reload();
      }
      */

      syncer();
    }
    else toast.error("Maybe internet connection issue.");
    setNetLoader('Sync Now')
  }



  //pull to refresh:
  //collected from: https://blog.logrocket.com/implementing-pull-to-refresh-react-tailwind-css/
  const pullStart = (e) => {
    const { screenY } = e.targetTouches[0];
    setStartPoint(screenY);
  };

  const pull = (e) => {
    if (window.scrollY == 0 && data) {
      if (pullChange > 0) e.preventDefault();
      const touch = e.targetTouches[0];
      const { screenY } = touch;
      let pullLength = startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
      setPullChange(pullLength);
      //console.log({ screenY, startPoint, pullLength, pullChange });
    }

  };
  const endPull = (e) => {
    setStartPoint(0);
    setPullChange(0);

    //  if (pullChange > 220 ) console.log("triggered");
    if (pullChange > 220) syncer();
  };
  useEffect(() => {

    window.addEventListener("touchstart", pullStart);
    window.addEventListener("touchmove", pull, { passive: false });
    window.addEventListener("touchend", endPull);
    return () => {
      window.removeEventListener("touchstart", pullStart);
      window.removeEventListener("touchmove", pull);
      window.removeEventListener("touchend", endPull);
    };

  });



  return (<>
    <ToastContainer />
    <div
      ref={refreshCont}
      className="refresh-container w-full fixed -top-10 flex justify-center -mt-10 m-auto "
      style={{ marginTop: pullChange || "" }}
    >
      <div className="refresh-icon p-2 rounded-full bg-teal-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-6 h-6"
          style={{ transform: `rotate(${pullChange * 4}deg)` }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    </div>
    <div className=" flex flex-col mb-10">
      <div className="flex justify-center   fixed left-0 bottom-5 w-full">
        <div className="flex justify-around w-fit bg-teal-900/60 backdrop-blur-sm py-2 text-white rounded-2xl p-5 gap-5">


          <NavLink to={`/`}
            className={({ isActive, isPending }) =>
              isActive
                ? " text-teal-500 "
                : isPending
                  ? "pending"
                  : ""
            }

          ><div className="flex flex-col items-center"><PiBackpack size={25} /> <span>Routine</span></div></NavLink>


          <NavLink to={`live`}
            className={({ isActive, isPending }) =>
              isActive
                ? " text-teal-400 "
                : isPending
                  ? "pending"
                  : ""
            }

          ><div className="flex flex-col items-center"><PiGlobe size={25} /> <span>Live</span></div></NavLink>



          <NavLink to={`config`}
            className={({ isActive, isPending }) =>
              isActive
                ? " text-teal-400 "
                : isPending
                  ? "pending"
                  : ""
            }

          ><div className="flex flex-col items-center"><PiGearFine size={25} /> <span>Config</span></div></NavLink>
        </div>
      </div>
      <div className="pb-7 bg-teal-950 px-1 md:px-40 mb-20 xl:px-72">
        {data &&

          <div className="my-1 flex justify-between items-center rounded-xl bg-teal-800 p-2 text-center text-black">
            <div className=" text-white">Sem: {selectedClass.semester}({selectedClass.section})</div>
            <div className="flex flex-col">
              <div><button onClick={() => syncNow()} className="rounded-xl bg-teal-400 px-3 ">{netLoader}</button></div>
              <div className=" text-white text-xs">S: {formatDistance(data.updated, new Date(), { addSuffix: true })} </div>
            </div>
          </div>}
        <Outlet context={[data, setData]} />
        <div class="text-white text-right">Developed by: <a className='underline' href='https://rafiz001.github.io/Portfolio/'>Rafiz</a></div>

      </div>

    </div>

  </>);
};
export default Index;