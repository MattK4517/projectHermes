
import "./SearchBar.css";

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
          borderRadius: "12px",
        }}
        className="search-bar"
      // endAdornment={<InputAdornment><img class="god-icon-style" src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.matchup.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}.jpg`}/></InputAdornment>}
      >
        <Autocomplete
          freeSolo
          id="god-seach-bar"
          // disableClearable

          options={props.data.map((option) => option.god)}
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
                variant="filled"
                label={"Search A Matchup"}
              // endAdornment={<InputAdornment><img class="god-icon-style" src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.matchup.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}.jpg`}/></InputAdornment>}
              />
            )
          )}
        />
      </Stack>
    </div>
  );
}
