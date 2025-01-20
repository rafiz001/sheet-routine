import React, { useEffect, useRef, useState } from 'react'
import readExcelFromUrl from '../lib/fetchExcel';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CoursePopUp from './CoursePopUp.jsx';

export default function Full({ sorry }) {
  const once = useRef(false);
  const [data, setData] = useOutletContext();
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState('---');
  const [popup, setPopup] = useState(null);

  let newDay = true, newSemester = true;


  useEffect(() => {
    if (once.current) return;
    once.current = true;

    if (!localStorage.getItem("config")) navigate("/config");


  }, [])



  return (
    <>
      <div class="my-1 flex  rounded-xl bg-teal-800 p-2 text-center text-white justify-center">


        <select className="w-full bg-teal-800 p-2" name='section' onInput={(e) => setSelectedDays(e.target.value)}>
          <option value={'---'}>(Select Day)</option>
          {data && data.days && data.days.map((value, key) => <>
            <option key={key} value={key}>{value}</option>
          </>)}
        </select>

      </div>
      <div className='overflow-x-auto overflow-y-auto h-[calc(100vh-7rem)]'>
        <table className='w-full'>
          {data &&
            <tr >

              <th >Semester</th>
              <th >Section</th>
              {data.times.map((time, tk) =>
                <th key={tk}>{time}</th>
              )}
            </tr>

          }


          {selectedDays != '---' && data && Object.keys(data.data[selectedDays]).map((semester, semKey) => <>
            {newSemester = true}
            {Object.keys(data.data[selectedDays][semester]).map((section, secKey) => <>

              <tr>


                {newSemester ? <td>{semester}</td> : <td></td>}
                {newSemester = false}


                <td>{section}</td>

                {data.data[selectedDays][semester][section].map((col, colKey) => <>

                  {data.data[selectedDays][semester][section][colKey - 1] && (data.data[selectedDays][semester][section][colKey - 1][1] <= 1) &&
                    <td onClick={() => setPopup(col[0])} colSpan={col[1] > 1 ? col[1] : ''}>{col[0]}</td>
                  }



                  {!data.data[selectedDays][semester][section][colKey - 1] &&
                    <td onClick={() => setPopup(col[0])} colSpan={col[1] > 1 ? col[1] : ''}>{col[0]}</td>
                  }


                </>)}
              </tr>
            </>)}
          </>)}



        </table>
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
      </div>

      <CoursePopUp popup={popup} setPopup={setPopup} data={data} />
    </>
  )
}
