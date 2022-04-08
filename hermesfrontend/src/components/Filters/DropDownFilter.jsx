// import React from "react";

// export default class DropDownFilter extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = { value: this.props.role };
//       this.handleChange = this.handleChange.bind(this);
//       this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handleChange(event) {
//       this.setState({ value: event.target.value });
//     }

//     handleSubmit(event) {
//       this.props.changePatch(this.props.patch);
//       event.preventDefault();
//     }

//     render() {
//         return (
//           // <div style={{margin: "auto", paddingRight: "1rem"}}>
//           <div>
//             <form onSubmit={this.handleSubmit}>
//               <input
//                 type="image"
//                 style={{ maxWidth: "36px", maxHeight: "36px" }}
//                 name="submit"
//                 value={this.props.patch}
//               ></input>
//             </form>
//           </div>
//         );
//       }
//   }

import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputAdornment } from "@mui/material";

export default class DropDownFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.role };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.props.changePatch(event.target.value);
  }

  handleSubmit(event) {
    this.props.changePatch(this.props.patch);
    event.preventDefault();
  }

  render() {
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }}>Patch</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="patch-filter"
            value={this.props.role}
            label={this.props.role}
            onChange={this.handleChange}
            sx={{
              color: "white",
              bgcolor: "#191937",
            }}
            // endAdornment={<InputAdornment>{this.props.role}</InputAdornment>}
          >
            <MenuItem selected className="drop-down_hover" value={"9.3"}>
              <div className="drop-down_icon">9.3</div>
            </MenuItem>
            <MenuItem selected className="drop-down_hover" value={"9.2"}>
              <div className="drop-down_icon">9.2</div>
            </MenuItem>
            <MenuItem selected className="drop-down_hover" value={"9.1"}>
              <div className="drop-down_icon">9.1</div>
            </MenuItem>
            {/* <MenuItem selected 
            className="drop-down_hover" 
            value={"8.11"}>
              <div className="drop-down_icon">8.11</div>
            </MenuItem> */}
          </Select>
        </FormControl>
      </Box>
    );
  }
}

export { DropDownFilter };
