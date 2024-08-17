import React, { useEffect, useRef, useState } from 'react'
import readExcelFromUrl from '../lib/fetchExcel';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Routine({sorry}) {
    const once = useRef(false);
    const [data, setData] = useOutletContext();
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState({semester: '', section: ''});
    

    
    useEffect(() => {
      if (once.current) return;
      once.current = true;

      if(!localStorage.getItem("config"))navigate("/config");

    //getting class from localstorage
    let class_ = localStorage.getItem("class");
    if(class_)
    {
      setSelectedClass(JSON.parse(class_));

    }
    else navigate("/config");
      
    
    }, [])

  
  
  return (
    <>
    <div class="my-1 flex  rounded-xl bg-teal-800 p-2 text-center text-white justify-center">Showing Semester: {selectedClass.semester} Section: {selectedClass.section}</div>
{(selectedClass.semester!='' && data) && data.days.map((day, dayKey)=><>
  <div className="mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white" key={dayKey}>{day}</div>
  <div className="bg-teal-500 p-4">
  
      {data.data[dayKey][selectedClass.semester][selectedClass.section].map((sub,subKey)=><>
      {sub[0] &&
                <div className="mt-1 flex  gap-2">
                  <div className="bg-teal-400 p-1 w-full text-right content-center">{data.times[subKey]}{(sub[1]>1) && <><hr />{data.times[subKey+sub[1]-1]}</>}</div>
                  <div className="flex items-center bg-teal-400 p-1 w-full text-left content-center">{sub[0]}</div>
                </div>
      }
      </>)}

  </div>
  </>)
}
{!data &&
<>
<div class=" mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white flex justify-center" ><div class="animate-pulse bg-teal-400 p-1 w-32  h-7"></div></div>
  <div class="bg-teal-500 p-4">
  

                <div class=" mt-1 flex  gap-2">
                  <div class="animate-pulse bg-teal-400 p-1 w-full text-right content-center h-20"></div>
                  <div class="animate-pulse flex items-center bg-teal-400 p-1 w-full text-left content-center h-20"></div>
                </div>


  </div>
</>
}


    </>
  )
}
