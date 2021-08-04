import React from "react";
import { useState, useEffect } from "react";


function TierList() {
  useEffect(() => {
    fetch("/gettierlist").then((res)=> 
    res.json().then((data =>{
      console.log(data)
    })))
  })
  return (
      <div className="tierList">
          <p>test</p>
      </div>
  );
}

export default TierList;