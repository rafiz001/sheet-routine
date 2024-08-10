import * as XLSX from 'xlsx';

 export default async function readExcelFromUrl() {

   let config = localStorage.getItem("config");
   if(!config)return;
   
   
   
   
   
   config = JSON.parse(config);
   const timeRow = config.timeRow;
   const timeColumn = config.timeColumn;
   const sectionColumn = config.sectionColumn;
   const semesterColumn = config.semesterColumn;
   const url = config.url;
   


    let times = [];
    let data = [];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    try {
      // Fetch the file from the URL
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
  
      // Read the file as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
  
      // Parse the ArrayBuffer into a workbook object
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
       
      // console.log(workbook.SheetNames);
      days.forEach((day) => {
        const worksheet = workbook.Sheets[day];
  
        // Check for merged cells
        const merges = worksheet['!merges'];
        let merged = {};
        merges.forEach((v, k) => {
          if (v.s.c != v.e.c) {
            if (!(v.s.r in merged)) merged[v.s.r] = {};
            merged[v.s.r][v.s.c] = Math.abs(v.s.c - v.e.c) + 1;
          }
        })
        // console.log(merged);
  
        // Process the sheet data 
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null, header: 1 });
        //console.log('Sheet Data:', jsonData);
        // getting timespans
        if(times.length==0) 
        {  
              jsonData[timeRow].forEach((data, key) => {if (key >= timeColumn) times.push(data);});
        }
        
        let sems = {};
        let lastSemester = null;
  
        // traversing into rows
        jsonData.some((row, rk) => {
          //traversing into cols
          if (rk > timeRow) {
            if(row[sectionColumn]==null)return true;
            let newSemesterSarting = true;
            let sec = {};
            let sub = [];
            row.forEach((col, ck) => {
              if (ck == semesterColumn && col == null) newSemesterSarting = false;
              if (ck >= timeColumn) {
                let temp = [col];
                temp.push((merged[rk] && (ck in merged[rk])) ? merged[rk][ck] : 1);
                sub.push(temp);
              }
            })
            sec[row[sectionColumn]] = sub;
            if (newSemesterSarting) {
              lastSemester = row[semesterColumn];
              sems[lastSemester] = sec;
            }
            else {
              sems[lastSemester] = { ...sems[lastSemester], ...sec }
            }
  
          }
        })
        data.push(sems);
      })
      const output = { "data": data,"times": times,"days": days };
      return output;
  
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
  }
/*
data is like:

[
    { //sunday start
        "1st": 
        {
            "A": [[null,1], ["abc",1], [null,1], ["cde",2]],
            "B": [[null,1], ["abc",1], [null,1], ["cde",2]]
        },
        
        "2nd": 
        {
            "A": [[null,1], ["abc",1], [null,1], ["cde",2]]
        }
        
        
    },
    { //monday start
        "1st": 
        {
            "A": [[null,1], ["abc",1], [null,1], ["cde",2]],
            "B": [[null,1], ["abc",1], [null,1], ["cde",2]]
        },
        
        "2nd": 
        {
            "A": [[null,1], ["abc",1], [null,1], ["cde",2]]
        }
        
        
    },
]


*/