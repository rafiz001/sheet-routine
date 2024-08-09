import React, { useEffect, useRef, useState } from "react";
import './styles.css';
import readExcelFromUrl from './lib/fetchExcel'


const Index = () => {
  const once = useRef(false);
  const [data, setData] = useState(null);
  const sem = "6th";
  const sec = "B";
  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const excelFileUrl = 'https://docs.google.com/spreadsheets/u/0/d/1BOq80g5PyE9S0WXIqEc8vmPaps_4w_BZ79sBEDD_HbY/export?format=xlsx';

    readExcelFromUrl(excelFileUrl).then((output)=>{setData(output);console.log(output)});
  }, [])


  return (<>
<div className="flex justify-around bg-teal-900 py-2 text-white">
  <div className="text-2xl">Sheet Routine</div>
  <div className="flex gap-7">
    <a className="cursor-pointer border-b-2">Routine</a>
    <a className="cursor-pointer ">Config</a>
  </div>
</div>
<div className="flex h-[300vh] flex-col bg-teal-950 px-5 md:px-40 xl:px-72">
  <div className="text-center text-white">Showing Semester: {sem} Section: {sec}</div>
{ data && data.days.map((day, dayKey)=><>
  <div className="mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white" key={dayKey}>{day}</div>
  <div className="bg-teal-500 p-4">
  
      {data.data[dayKey][sem][sec].map((sub,subKey)=><>
      {sub[0] &&
                <div className="mt-1 flex justify-center gap-2">
                  <div className="bg-teal-400 p-1">{data.times[subKey]}{(sub[1]>1) && <><hr />{data.times[subKey+1]}</>}</div>
                  <div className="flex items-center bg-teal-400 p-1">{sub[0]}</div>
                </div>
      }
      </>)}

  </div>
  </>)
} 
  </div>



  </>);
};
export default Index;