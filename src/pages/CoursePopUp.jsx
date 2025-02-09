import React, { useEffect, useState } from 'react'
import courses from "./../lib/courses.json"
import { PiXCircle } from 'react-icons/pi';

 function popUpInfo(raw,data,type="all") {
  const courseA = raw.split("[")
  const temp = courseA[0].trim().split("-");
  let courseName = "";
  if (temp.length > 1) courseName = temp[0] + " " + temp[1].split(" ")[0];
  else {
    const temp = courseA[0].trim().split(" ");
    courseName = temp[0] + " " + temp[1];
  }
  if(type=="course") return courses[courseName];
  //console.log(courseName,"-", courses[courseName] )
  //const raw = "CSE-324[SHS] [NEW3](DSAL)"
  const matches = [...raw.matchAll(/\[([\w]+)\]/g)];
  const teachers = matches.map(match => data.teachers ? data.teachers[match[1]]?data.teachers[match[1]]:match[1] : "Sync Routine please");
  if(type=="teacher")return  teachers;
  else return ({ course: courses[courseName], teachers })
}

function CoursePopUp({ popup, setPopup, data }) {
  const [popupInfo, setPopUpInfo] = useState({ course: null, teachers: null });
  useEffect(() => {
    if (popup) {
      
      setPopUpInfo(popUpInfo(popup,data))


    }
  }, [popup])
  return (
    <>
      {popup &&
        <div className=' fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center bg-black/70 '>
          <div className='w-[100vw] h-[50vh] mt-[50vh] md:px-40 ' >
            <div className="  rounded-t-xl bg-teal-800 p-2 text-center text-white  flex justify-between items-center" >
              <span></span>
              Class Details <span onClick={() => setPopup(null)} className='p-1   cursor-pointer'><PiXCircle size={25}/></span>

            </div>
            <div className="bg-teal-500 p-1 h-full">


              <div className="mt-1 " >

                <div className=" px-2 w-full h-[30vh] text-left content-center overflow-y-auto">
                  <strong>Course:</strong> <br />{popupInfo.course} <br />
                  <strong>Teacher:</strong> <br />
                  {popupInfo.teachers && popupInfo.teachers.map((v, k) => <>{k + 1}. {v}<br /></>)}
                  <strong>Raw:</strong> <br /> {popup} <br/>
                </div>
              </div>


            </div>
          </div>
        </div>
      }
    </>
  )
}

export default CoursePopUp