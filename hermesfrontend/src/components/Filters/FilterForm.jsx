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

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default class FilterForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: this.props.filter };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    };
  
    handleChange(event) {
      this.props.setFilter(event.target.value);
    };
  
    handleSubmit(event) {
      this.props.setFilter(this.props.patch);
      event.preventDefault();
    }

    render() {

      return (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel sx={{color: "white"}}>{this.props.filter}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="patch-filter"
              label={this.props.filter}
              onChange={this.handleChange}
              sx= {{
                color: "white",
                bgcolor: "#191937"
              }}
            >
              {this.props.filters.map((filter) => {
                return(
                  <MenuItem value={filter}>{filter.replaceAll("_", " ")}</MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>
      );
    }
}

export {FilterForm}