// import React, { useState } from "react";
import "./SearchBar.css";
// import SearchIcon from "@material-ui/icons/Search";
// import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

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
import { Button } from "@material-ui/core";

export default function SearchBarGodPage(data) {
  return (
    <Stack spacing={2} 
      sx={{ 
        width: 200,
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
        clearOnEscape={"true"}
        renderOption={(option) => ( 
          <React.Fragment>
            <Button style={{ cursor: "pointer", color: "black", display: "flex"}}
            onClick={() =>{
              if (option.key == "All Gods"){
                data.changeMatchup("None")
              } else {
              data.changeMatchup(option.key)
              }
            }}>
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
              </Button>
          </React.Fragment>
        )}
        renderInput={(params) => (
          (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
              }}
              label={"Search A Matchup"}
            />
          )
        )}
      />
    </Stack>
  );
}
