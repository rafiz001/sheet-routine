import * as XLSX from 'xlsx';
 export default async function readExcelFromUrl(url) {
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
        // console.log('Sheet Data:', jsonData);
        // getting timespans
        if(times.length==0) 
        {  
              jsonData[1].forEach((data, key) => {if (key >= 3) times.push(data);});
        }
        
        let sems = {};
        let lastSemister = null;
  
        // traversing into rows
        jsonData.forEach((row, rk) => {
          //traversing into cols
          if (rk > 1 && rk <= 42) {
            let newSemesterSarting = true;
            let sec = {};
            let sub = [];
            row.forEach((col, ck) => {
              if (ck == 1 && col == null) newSemesterSarting = false;
              if (ck >= 3) {
                let temp = [col];
                temp.push((merged[rk] && (ck in merged[rk])) ? merged[rk][ck] : 1);
                sub.push(temp);
              }
            })
            sec[row[2]] = sub;
            if (newSemesterSarting) {
              lastSemister = row[1];
              sems[lastSemister] = sec;
            }
            else {
              sems[lastSemister] = { ...sems[lastSemister], ...sec }
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