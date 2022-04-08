import React, { useEffect, useState } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";

function NameForm(props) {
    let history = useHistory();
    const [value, setValue] = useState("")
    function handleSubmit(event){
        history.push(`/Match/${value.trim()}`);
    }

      return (
        <div className="content-section">
          <div className="content-section_header">Search for a Player</div>
          <form onSubmit={handleSubmit}>
            {" "}
            <label style={{ color: "white" }}>
              Match ID:
              <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
              />{" "}
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div className="filler">
            <h4>Don't have a match? try 1219734199</h4>
            {/* <br></br> */}
            <h5>
              Remember all matches must by Ranked PC Conquest from 10/24/2021 or
              later (will expand the match types we support soon!)
            </h5>
          </div>
        </div>
      );
  }

export default function FindAMatch(props) {
    const [match, setMatch] = useState(0);
    return (
      <div
        className="container content-container"
        style={{ maxWidth: "fit-content" }}
      >
        <NameForm setMatch={setMatch} />
        <div
          className="shrink-padding"
          style={{ marginTop: "36px" }}
        >
        </div>
      </div>
    );
  }