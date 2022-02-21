// import React, { useState } from "react";
// import "./SearchBar.css";
// import SearchIcon from "@material-ui/icons/Search";
// import CloseIcon from "@material-ui/icons/Close";
import { Link, withRouter, useHistory } from "react-router-dom";
import Match from "../Match";
import Player from "../PlayerPage/Player";
import { godsDict } from '../drawer'

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
    let flag = false;
    if(event.charCode==13){
      if (parseInt(event.target.value)) {
        history.push(`/Match/${event.target.value.trim()}`);
      } else if (Object.keys(godsDict).findIndex(element => {
        console.log(element.toLowerCase() === event.target.value.toLowerCase())
        return element.toLowerCase() === event.target.value.toLowerCase();
      }) !== -1) {
        history.push(`/${event.target.value.trim().toLowerCase().replaceAll(" ", "-").replaceAll("'","")}`)
        flag = true
      }
      else {
        if (!flag){
          history.push({
            pathname: `/Player/${event.target.value.trim()}`,
            state: {player: event.target.value}
          });
        }
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
       className="search-bar"
      >
      <Autocomplete
        freeSolo
        id="god-seach-bar"
        // disableClearable
        options={data.data.map((option) => option.god)}
        defaultValue={""}
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
              label={"Search A God, Player, or Match ID"}
            />
            
          )
        )}
      />
    </Stack>
  );
}
