// import React, { useState } from "react";
import "./SearchBar.css";
// import SearchIcon from "@material-ui/icons/Search";
// import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

// export default function SearchBar({ placeholder, props }) {
//   const [filteredData, setFilteredData] = useState([]);
//   const [wordEntered, setWordEntered] = useState("");

//   const handleFilter = (event) => {
//     const searchWord = event.target.value;
//     console.log(searchWord);
//     setWordEntered(searchWord);
//     const newFilter = props.filter((value) => {
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
//         <div className="propsResult">
//           {filteredData.slice(0, 15).map((value, key) => {
//             return (
//                 <p>
//                 <Link to={value.path} className="propsItem">{value.god}</Link>
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
import { InputAdornment } from '@mui/material';

export default function SearchBarGodPage(props) {
  return (
    <div className="search-bar_god-page hide">
      <Stack spacing={2}
        sx={{
          width: 200,
          backgroundColor: "white",
          color: "black",
          marginLeft: "15px",
        }}
        className="search-bar"
      // endAdornment={<InputAdornment><img class="god-icon-style" src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.matchup.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}.jpg`}/></InputAdornment>}
      >
        <Autocomplete
          freeSolo
          id="god-seach-bar"
          // disableClearable

          options={props.data.map((god) => god)}
          clearOnEscape={"true"}
          renderOption={(option) => (
            <React.Fragment>
              <Button style={{ cursor: "pointer", color: "black", display: "flex" }}
                onClick={() => {
                  if (option.key == "All Gods") {
                    props.changeMatchup("None")
                  } else {
                    props.changeMatchup(option.key)
                  }
                }}
              // endAdornment={<InputAdornment><img class="god-icon-style" src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.matchup.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}.jpg`}/></InputAdornment>}
              >
                <img
                  src={`https://webcdn.hirezstudios.com/smite/god-icons/${option.key.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}.jpg`}
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
                label={props.labelText}
              // endAdornment={<InputAdornment><img class="god-icon-style" src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.matchup.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}.jpg`}/></InputAdornment>}
              />
            )
          )}
        />
      </Stack>
    </div>
  );
}
