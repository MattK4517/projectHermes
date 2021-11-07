import React from "react";
import { withStyles } from "@material-ui/styles";
import { Tooltip } from "@material-ui/core";

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: "#06061f",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      border: ".5px solid gray",
      opacity: 100,
    },
  }))(Tooltip);
  
  const EnsureItem = (data, item) => {
    let ensured;
    data.map((itemdata, index) => {
      if (itemdata.itemName === item) {
        ensured = itemdata;
        return ensured;
      }
    });
    return ensured;
  };

class CreateFilterToolTip extends React.Component {
    render() {
        return (
        <div className="filter-hover" style={{ maxHeight: "10px" }}>
            <p style={{ color: "white" }}>{this.props.filterLabel}</p>
        </div>
        );
    }
}

const getImageUrl = (rank) => {
    let url = "https://i.imgur.com/LVbUJes.png";
    if (rank == "Bronze") {
      url = "https://i.imgur.com/pNAGUeR.png";
    } else if (rank == "Silver") {
      url = "https://i.imgur.com/Cm5uf15.png";
    } else if (rank == "Gold") {
      url = "https://i.imgur.com/L3BmF9F.png";
    } else if (rank == "Platinum") {
      url = "https://i.imgur.com/6M3Ezca.png";
    } else if (rank == "Diamond") {
      url = "https://i.imgur.com/dtXd0Kv.png";
    } else if (rank == "Masters") {
      url = "https://i.imgur.com/2SdBQ4o.png";
    } else if (rank == "Grandmaster") {
      url = "https://i.imgur.com/uh3i4hc.png";
    } else if (rank == "Solo") {
      url = "https://i.imgur.com/WLU0Cel.png";
    } else if (rank == "Jungle") {
      url = "https://i.imgur.com/CyXnzEO.png";
    } else if (rank == "Mid") {
      url = "https://i.imgur.com/0oQkAAZ.png";
    } else if (rank == "Support") {
      url = "https://i.imgur.com/l7CD2QM.png";
    } else if (rank == "Carry") {
      url = "https://i.imgur.com/RlRTbrA.png";
    }
    return url;
  };
    
export default class FilterForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: this.props.role };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({ value: event.target.value });
    }
  
    handleSubmit(event) {
      this.props.roleState(this.props.role);
      event.preventDefault();
    }
  
    render() {
      return (
        <HtmlTooltip
          title={
            <React.Fragment>
              <CreateFilterToolTip filterLabel={this.props.role} />
            </React.Fragment>
          }
          placement="top"
          arrow
        >
          <form onSubmit={this.handleSubmit} className="role-filter">
            <input
              type="image"
              src={getImageUrl(this.props.role)}
              style={{ maxWidth: "36px", maxHeight: "36px" }}
              name="submit"
              value={this.props.role}
            ></input>
          </form>
        </HtmlTooltip>
      );
    }
  }

  export {FilterForm}