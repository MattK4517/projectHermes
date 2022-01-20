import React, { useState, useEffect, useContext} from "react";
import ItemBuffs from "./ItemBuffs";
import DragDropGodList, { DragDropItemList } from "./DragDropGodList";
import MainCalcSection from "./MainCalcSection";
import { DamageContext } from "./DamageContext";

import { physGods, magGods, physicalItems } from "../constants"

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        god: "",
        power: "0",
        ability1: "0",
        ability2: "0",
        ability3: "0",
        ability4: "0",
 };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({[event.target.name]: value});
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.setGod(this.state.god);
    this.props.setPower(this.state.power);
    this.props.setLevels({
        "1": this.state.ability1,
        "2": this.state.ability2,
        "3": this.state.ability3,
        "4": this.state.ability4,
        "5": 0
    })
      this.props.setSubmit(true)
    // this.props.setMatch(event.target[0].value);
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit}>
          {" "}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ color: "white" }}>
              God:
              <input
                type="text"
                value={this.state.god}
                onChange={this.handleChange}
                name="god"
              />{" "}
            </label>
            <label style={{ color: "white" }}>
              Power:
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                name="power"
              />{" "}
            </label>

            <label style={{ color: "white" }}>
              Ability 1 Level:
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                name="ability1"
              />{" "}
            </label>
            <label style={{ color: "white" }}>
                Ability 2 Level:
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                name="ability2"
              />{" "}
            </label>
            <label style={{ color: "white" }}>
            Ability 3 Level:
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                name="ability3"
              />{" "}
            </label>
            <label style={{ color: "white" }}>
            Ultimate Level:
              <input
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
                name="ability4"
              />{" "}
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
    );
  }
}

export default function DamageCalculator() {
  const [drop, allgods, board, setBoard, god, setGod] = useContext(DamageContext);;
  const [levels, setLevels] = useState({
    "1": 1, 
    "2": 1, 
    "3": 1, 
    "4": 1, 
    "5": 1
  });
  const [power, setPower] = useState("");
  const [submit, setSubmit] = useState(false);
  const [totalDamage, setTotalDamage] = useState("");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      god: god,
      levels: levels,
      power: power,
    }),
  };
  const [message, setMessage] = useState([])
  let td = 0
  if (physGods.indexOf(god) !== -1) {
    console.log(god)
  }
  // useEffect(() => {
  //   fetch("/api/getdmgcalc/", requestOptions).then((res) =>
  //     res.json().then((data) => {
  //       setMessage([])
  //       td = 0
  //       Object.keys(data).map((ability) => {
  //           td = td + data[ability]["damage"]["damageTotal"]
  //           setMessage(message => [
  //               ...message,
  //               {
  //                   ...data[ability]
  //               },
  //             ]);
  //         });
  //       setSubmit(false);
  //       setTotalDamage(td)
  //     })
  //   );
  // }, [submit]);

  return (
    <div className="player-profile-page">
      <div
        className="player-profile-container content-side-padding"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        {/* <NameForm setPlayer={setPlayer} /> */}
        <div className="player-content-container">
          <div className="damage-content-main">
            <div className="player-side">
              <ItemBuffs />
              <DragDropGodList />
            </div>
            <div className="player-main">
              <MainCalcSection />
              <p>{god}</p>
            </div>
            <div className="player-side">
              <DragDropItemList items={physicalItems}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


{/* <NameForm
setSubmit={setSubmit} 
setGod={setGod} 
setPower={setPower} 
setLevels={setLevels}/>
<div className="return">
{message.map(ability => {
    return (
        <div>{ability.name} {ability.damage.damageTotal}</div>
    )
})}
<div>Total Damage: {totalDamage}</div>
</div> */}