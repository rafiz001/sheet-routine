import React, { useEffect, useState } from 'react'
import courses from "./../lib/courses.json"

export function popUpInfo(raw,data,type="all") {
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
        <div className=' fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center bg-[#000000dd]'>
          <div className=''>
            <div className=" mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white" >
              {popup} <span onClick={() => setPopup(null)} className='p-1 rounded-full bg-teal-400 cursor-pointer'>❌</span>

            </div>
            <div className="bg-teal-500 p-4">


              <div className="mt-1 " >

                <div className="  bg-teal-400 p-1 w-full text-left content-center">
                  <strong>Course:</strong> <br />{popupInfo.course} <br />
                  <strong>Teacher:</strong> <br />
                  {popupInfo.teachers && popupInfo.teachers.map((v, k) => <>{k + 1}. {v}<br /></>)}
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