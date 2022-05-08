import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputAdornment } from "@mui/material";

export const getImageUrl = (rank, mode) => {
  let url = "https://i.imgur.com/LVbUJes.png";
  if (rank == "Bronze" && mode === "Conquest") {
    url = "https://i.imgur.com/pNAGUeR.png";
  } else if (rank === "Silver" && mode === "Conquest") {
    url = "https://i.imgur.com/Cm5uf15.png";
  } else if (rank === "Gold" && mode === "Conquest") {
    url = "https://i.imgur.com/L3BmF9F.png";
  } else if (rank === "Platinum" && mode === "Conquest") {
    url = "https://i.imgur.com/6M3Ezca.png";
  } else if (rank === "Diamond" && mode === "Conquest") {
    url = "https://i.imgur.com/dtXd0Kv.png";
  } else if (rank === "Masters" && mode === "Conquest") {
    url = "https://i.imgur.com/2SdBQ4o.png";
  } else if (rank === "Grandmaster" && mode === "Conquest") {
    url = "https://i.imgur.com/uh3i4hc.png";
  } else if (rank == "Bronze" && mode === "Joust") {
    url = "https://i.imgur.com/BdF6iJ8.png";
  } else if (rank === "Silver" && mode === "Joust") {
    url = "https://i.imgur.com/8mAVtDs.png";
  } else if (rank === "Gold" && mode === "Joust") {
    url = "https://i.imgur.com/Mz7OHvM.png";
  } else if (rank === "Platinum" && mode === "Joust") {
    url = "https://i.imgur.com/xZn4mdc.png";
  } else if (rank === "Diamond" && mode === "Joust") {
    url = "https://i.imgur.com/d6CgHKn.png";
  } else if (rank === "Masters" && mode === "Joust") {
    url = "https://i.imgur.com/ymZe7Ac.png";
  } else if (rank === "Grandmaster" && mode === "Joust") {
    url = "https://i.imgur.com/qPBFwD6.png";
  } else if (rank == "Bronze" && mode === "Duel") {
    url = "https://i.imgur.com/QP8sPgx.png";
  } else if (rank === "Silver" && mode === "Duel") {
    url = "https://i.imgur.com/OQv6tsn.png";
  } else if (rank === "Gold" && mode === "Duel") {
    url = "https://i.imgur.com/1KFxDi9.png";
  } else if (rank === "Platinum" && mode === "Duel") {
    url = "https://i.imgur.com/YjMr1UA.png";
  } else if (rank === "Diamond" && mode === "Duel") {
    url = "https://i.imgur.com/MuHM8b1.png";
  } else if (rank === "Masters" && mode === "Duel") {
    url = "https://i.imgur.com/U8Ot31L.png";
  } else if (rank === "Grandmaster" && mode === "Duel") {
    url = "https://i.imgur.com/np7y6QP.png";
  } else if (rank === "Solo") {
    url = "https://i.imgur.com/WLU0Cel.png";
  } else if (rank === "Jungle") {
    url = "https://i.imgur.com/CyXnzEO.png";
  } else if (rank === "Mid") {
    url = "https://i.imgur.com/0oQkAAZ.png";
  } else if (rank === "Support") {
    url = "https://i.imgur.com/l7CD2QM.png";
  } else if (rank === "Carry") {
    url = "https://i.imgur.com/RlRTbrA.png";
  } else if (rank === "Casual") {
    url = "https://i.imgur.com/bVKJ1Az.png";
  } else if (rank === "Joust") {
    url = "https://i.imgur.com/tydY7sr.png";
  } else if (rank === "Duel") {
    url = "https://i.imgur.com/KsoBoLs.png";
  } else if (rank === "Assault") {
    url = "https://i.imgur.com/edrgTB8.png";
  } else if (rank === "Arena") {
    url = "https://i.imgur.com/pUh04Os.png";
  } else if (rank === "Slash") {
    url = "https://i.imgur.com/pbbdkTZ.png";
  }
return url;
};

export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.filter };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.setFilter(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <Box sx={{ minWidth: 120, color: "white" }}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }}>{this.props.filter}</InputLabel>
          <Select
            id="patch-filter"
            label={this.props.filter}
            onChange={this.handleChange}
            sx={{
              bgcolor: "#423f61",
              padding: "0px !important",
              margin: "0px !important",
              textAlign: "Center",
            }}
          >
            {this.props.filters.map((filter, index) => {
              return (
                <MenuItem
                  sx={{
                    marginTop: "0px",
                    backgroundColor: "#191937",
                    textAlign: "center",
                    "&:hover": {
                      backgroundColor: "#383864",
                    },
                    "&:active": {
                      backgroundColor: "#191937",
                    },
                  }}
                  value={filter}
                  selected
                  className=""
                  key={index}
                >
                  <div className="drop-down_icon">
                    <div style={{ position: "relative", textAlign: "center" }}>
                      <div className="god-icon">
                        <div
                          style={{
                            height: "30px",
                            width: "30px",
                          }}
                        >
                          <img
                            src={getImageUrl(filter, this.props.mode)}
                            alt={filter.replaceAll("_", " ")}
                            style={{
                              height: "48px",
                              width: "48px",
                              transform: "scale(0.625)",
                              transformOrigin: "0px 0px 0px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <strong className="god-name" style={{ color: "white" }}>
                      {filter.replaceAll("_", " ")}
                    </strong>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    );
  }
}

export { FilterForm };
