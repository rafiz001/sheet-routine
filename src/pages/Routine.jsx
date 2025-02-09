import React, { useEffect, useRef, useState } from 'react'
import readExcelFromUrl from '../lib/fetchExcel';
import { useNavigate, useOutletContext } from 'react-router-dom';
import  CoursePopUp from './CoursePopUp.jsx';

export default function Routine({ sorry }) {
  const once = useRef(false);
  const [data, setData] = useOutletContext();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState({ semester: '', section: '' });
  const [popup, setPopup] = useState("");
  //const date = new Date((new Date).setDate(16));
  const today = (new Date).getDay();
  const nextDay = today >= 4 ? 0 : today + 1

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    if (!localStorage.getItem("config")) navigate("/config");

    //getting class from localstorage
    let class_ = localStorage.getItem("class");
    if (class_) {
      setSelectedClass(JSON.parse(class_));

    }
    else navigate("/config");


  }, [])



  return (
    <>

      {(selectedClass.semester != '' && data) && data.days.map((day, dayKey) => <>
        <div className="mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white" key={dayKey}>{today == dayKey && '✅'} {nextDay == dayKey && '⬇️'} {day}</div>
        <div className="bg-teal-500 p-4">

          {data.data[dayKey][selectedClass.semester][selectedClass.section].map((sub, subKey) => <>
            {sub[0] &&
              <div className="mt-1 flex  gap-2" key={subKey}>
                <div className="bg-teal-400 p-1  text-right content-center w-full">{data.times[subKey]}{(sub[1] > 1) && <><hr />{data.times[subKey + sub[1] - 1]}</>}</div>
                <div onClick={() => setPopup(sub[0])} className="  bg-teal-400 p-1 w-full text-left content-center cursor-pointer">
                  
                  {sub[0]}

                </div>
              </div>
            }
          </>)}

        </div>
      </>)
      }
      {!data &&
        <>
          <div className=" mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white flex justify-center" ><div className="animate-pulse bg-teal-400 p-1 w-32  h-7"></div></div>
          <div className="bg-teal-500 p-4">


            <div className=" mt-1 flex  gap-2">
              <div className="animate-pulse bg-teal-400 p-1 w-full text-right content-center h-20"></div>
              <div className="animate-pulse flex items-center bg-teal-400 p-1 w-full text-left content-center h-20"></div>
            </div>


          </div>
        </>
      }
       <CoursePopUp popup={popup} setPopup={setPopup} data={data}/>
<div className="my-1 flex  rounded-xl bg-teal-800 p-2 text-center text-white justify-center">Tap on the courses to see its details.</div> 
    </>
  )
}
