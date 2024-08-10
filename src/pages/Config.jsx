import React, { useEffect, useRef, useState } from 'react'
import readExcelFromUrl from '../lib/fetchExcel';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Config() {
  const navigate = useNavigate();
  const once = useRef(false);
  const defaultConfig = 
        {
            "timeRow" : 1,
            "timeColumn" : 3,
            "sectionColumn" : 2,
            "semesterColumn" : 1,
            "url": 'https://docs.google.com/spreadsheets/d/1BOq80g5PyE9S0WXIqEc8vmPaps_4w_BZ79sBEDD_HbY/',
        }
  const [currentConfig, setCurrentConfig] = useState(defaultConfig);
  const [data, setData] = useState(null);
  const [selectedClass, setSelectedClass] = useState({semester: '', section: ''});
  const [section, setSection] = useState(null);
  useEffect(() => {
    if (once.current) return;
    once.current = true;
    //getting config from localstorage
    let config = localStorage.getItem("config");
    if(!config){
      localStorage.setItem("config", JSON.stringify(defaultConfig))
    }
    else{
      setCurrentConfig(JSON.parse(config));
    }

    //getting class from localstorage
    let class_ = localStorage.getItem("class");
    if(class_)
    {
        setSelectedClass(JSON.parse(class_));
    }


    
    
    readExcelFromUrl().then((output)=>{setData(output);console.log(output);});
  }, [])

  useEffect(()=>{
    if(data)sectionGenerator();
  },[data])


  function saveConfig() 
  {
    const temp = 
    {
      "url": document.querySelector("[name='url']").value,
      "timeRow" : parseInt(document.querySelector("[name='timeRow']").value),
      "timeColumn" : parseInt(document.querySelector("[name='timeColumn']").value),
      "sectionColumn" : parseInt(document.querySelector("[name='sectionColumn']").value),
      "semesterColumn" : parseInt(document.querySelector("[name='semesterColumn']").value),
  }
  localStorage.setItem("config", JSON.stringify(temp));
  toast.success("Configuration saved!",{
    autoClose: 1000,
    onClose: () => navigate(0)
  });
  }

  function saveDefault()
  {
    localStorage.setItem("config", JSON.stringify(defaultConfig));
    toast.success("Configuration restored to default", {
      autoClose: 1000,
      onClose: () => navigate(0)
    });
    
  }

  function sectionGenerator()
  {
    const semester = document.querySelector("[name='semester']").value;
    if(semester != "...") setSection(Object.keys(data.data[0][semester]));
  }

  function saveClass()
  {
    const temp = {semester: document.querySelector("[name='semester']").value, section: document.querySelector("[name='section']").value};
    localStorage.setItem("class", JSON.stringify(temp));
    navigate("/");
  }

  return (
    <>
    {/*Design:  https://play.tailwindcss.com/14BHbypVbt */}
    <div className="mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white">Choose Your Class</div>
  <div className="bg-teal-500 p-4">
    <label
      >Semester:

      <select onInput={()=>sectionGenerator()} name="semester" className="w-full bg-teal-400 p-2">
        
      {data && <option value="...">Select Semester</option>}
        {data ? Object.keys(data.data[0]).map((value)=><>
          <option selected={value === selectedClass.semester} value={value}>{value}</option>
        </>):<option value="...">Loading...</option>}
      </select> 
    </label>

    <label
      >Section:

      <select className="w-full bg-teal-400 p-2" name='section'>
          {section && section.map((value,key)=><>
          <option selected={value === selectedClass.section} value={value}>{value}</option>
        </>)}
      </select>
    </label>

        <div className="mt-4 flex justify-center gap-2"><button className="rounded-xl bg-green-300 px-3 py-1" onClick={()=>saveClass()}>💾 Save</button></div>
  </div>

  <div className="mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white">Google Sheet Config</div>
  <div className="bg-teal-500 p-4">
    <label
      >Sheet URL:
      <textarea className="w-full bg-teal-400 p-2" onChange={(e)=>setCurrentConfig(p=>{return {...p,url: e.target.value}})} value={currentConfig.url} name='url'></textarea>
    </label>

    <label
      >Time Row:
      <input type="number" className="w-full bg-teal-400 p-2" onChange={(e)=>setCurrentConfig(p=>{return {...p,timeRow: e.target.value}})} value={currentConfig.timeRow} name='timeRow'/>
    </label>

    <label
      >Time Column:
      <input type="number" className="w-full bg-teal-400 p-2" onChange={(e)=>setCurrentConfig(p=>{return {...p,timeColumn: e.target.value}})} value={currentConfig.timeColumn} name='timeColumn'/>
    </label>

    <label
      >Section Column:
      <input type="number" className="w-full bg-teal-400 p-2" onChange={(e)=>setCurrentConfig(p=>{return {...p,sectionColumn: e.target.value}})} value={currentConfig.sectionColumn} name='sectionColumn'/>
    </label>

    <label
      >Semester Column:
      <input type="number" className="w-full bg-teal-400 p-2" onChange={()=>{}} value={currentConfig.semesterColumn} name='semesterColumn'/>
    </label>

    <div className="mt-4 flex justify-center gap-2"><button className="rounded-xl bg-green-300 px-3 py-1" onClick={()=>saveConfig()}>💾 Save</button> <button className="rounded-xl bg-green-300 px-3 py-1" onClick={()=>saveDefault()}>↩️ Deafult</button></div>
  </div>
    </>
  )
}
