import React, { useEffect, useRef, useState } from 'react'
import readExcelFromUrl from '../lib/fetchExcel';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CoursePopUp from './CoursePopUp.jsx';

export default function Live({ sorry }) {
  const once = useRef(false);
  const [data, setData] = useOutletContext();
  const navigate = useNavigate();


  const [config,setConfig] = useState(null)
  useEffect(() => {
    if (once.current) return;
    once.current = true;

    if (!localStorage.getItem("config")) navigate("/config");
    setConfig(JSON.parse(localStorage.getItem("config")));

  }, [])

  

  return (
    <>
      <div class="my-1 flex  rounded-xl bg-teal-800  text-center text-white justify-center">
      <iframe src={config && config.url} style={{height: "100vh",width:"100%"}} ></iframe>
</div>

       

    </>
  )
}
