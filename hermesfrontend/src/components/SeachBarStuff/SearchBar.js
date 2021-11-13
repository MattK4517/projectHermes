// import React, { useState } from "react";
// import "./SearchBar.css";
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

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function SearchBar(data) {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      {/* <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={data.data.map((option) => option.god)}
        renderInput={(params) => 
            // <TextField {...params} label="freeSolo" />
        }
      /> */}
      <Autocomplete
        freeSolo
        id="god-seach-bar"
        // disableClearable
        options={data.data.map((option) => option.god)}
        renderOption={(option) => (
            <React.Fragment>
              <Link
                style={{ cursor: "pointer", color:"black" }}
                to={"/".concat(option.key)}
              >
                  {option.key}
              </Link>
              <br></br>
            </React.Fragment>
          )}
        renderInput={(params) => (
            console.log({...params}),
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
            }}
          />
        )}
      />
    </Stack>
  );
}