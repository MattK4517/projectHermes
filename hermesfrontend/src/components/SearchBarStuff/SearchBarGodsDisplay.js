import { Link, withRouter, useHistory } from "react-router-dom";
import { godsDict } from '../drawer';
import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { linkDict } from "../PlayerPage/Player";

export default function SearchBarGodsDisplay() {

  let history = useHistory();
  let data = Object.keys(godsDict)
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
        options={data.map((option) => option)}
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
