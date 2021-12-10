// import React, { useState } from "react";
// import "./SearchBar.css";
// import SearchIcon from "@material-ui/icons/Search";
// import CloseIcon from "@material-ui/icons/Close";
import { Link, withRouter, useHistory } from "react-router-dom";
import Match from "../Match";
import Player from "../PlayerPage/Player";

// export default function SearchBar({ placeholder, data }) {
//   const [filteredData, setFilteredData] = useState([]);
//   const [wordEntered, setWordEntered] = useState("");

//   const handleFilter = (event) => {
//     const searchWord = event.target.value;
//     console.log(searchWord);
//     setWordEntered(searchWord);
//     const newFilter = data.filter((value) => {
//         console.log(value)
//       return value.god.toLowerCase().includes(searchWord.toLowerCase());
//     });

//     if (searchWord === "") {
//       setFilteredData([]);
//     } else {
//       setFilteredData(newFilter);
//     }
//   };

//   const clearInput = () => {
//     setFilteredData([]);
//     setWordEntered("");
//   };

//   return (
//     <div className="search">
//       <div className="searchInputs">
//         <input
//           type="text"
//           placeholder={placeholder}
//           value={wordEntered}
//           onChange={handleFilter}
//         />
//         {/* <div className="searchIcon">
//           {filteredData.length === 0 ? (
//             <SearchIcon />
//           ) : (
//             <CloseIcon id="clearBtn" onClick={clearInput} />
//           )}
//         </div> */}
//       </div>
//       {filteredData.length != 0 && (
//         <div className="dataResult">
//           {filteredData.slice(0, 15).map((value, key) => {
//             return (
//                 <p>
//                 <Link to={value.path} className="dataItem">{value.god}</Link>
//                 </p>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
// // export default SearchBar;


import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

export default function SearchBar(data) {

  let history = useHistory();
  
  function handleKeyPress(event){
    if(event.charCode==13){
      if (parseInt(event.target.value)) {
        history.push(`/Match/${event.target.value}`);
      } else{
        history.push(`/Player/${event.target.value}`);
      }
  }
  }
  return (
    <Stack spacing={2} 
      sx={{ 
        width: 300,
        backgroundColor: "white",
        color: "black",
        marginLeft: "15px",
       }}
      >
      <Autocomplete
        freeSolo
        id="god-seach-bar"
        // disableClearable
        options={data.data.map((option) => option.god)}
        defaultValue={"Search a God"}
        clearOnEscape={"true"}
        renderOption={(option) => (
          <React.Fragment>
            <Link
              style={{ cursor: "pointer", color: "black", display: "flex"}}
              to={"/".concat(option.key.replaceAll(" ", "_"))}
            >
              <img
                src={`https://webcdn.hirezstudios.com/smite/god-icons/${option.key.toLowerCase().replaceAll(" ", "-").replaceAll("'","")}.jpg`}
                alt={option.key}
                style={{
                  height: "48px",
                  width: "48px",
                  transform: "scale(0.625)",
                  transformOrigin: "0px 0px 0px",
                  marginLeft: "10px"
                }}
              />
              <p>{option.key}</p>
            </Link>
          </React.Fragment>
        )}
        renderInput={(params) => (
          (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
              }}
              onKeyPress={e => handleKeyPress(e)}
            />
            
          )
        )}
      />
    </Stack>
  );
}
