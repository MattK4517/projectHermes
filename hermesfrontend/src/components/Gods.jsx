import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Component.css";

function GodsDisplay(props){
        return (
            <>
            <div className="gods-container">
            {props.gods.map((god, index) => {
                return (
                    <Link key = {index}
                    to={"/".concat((god.name).replaceAll(" ","_"))} 
                    className="god-link"
                    >
                        <figure className="snip0015">
                            <img className="god-face" src={god.url} alt={god.name} style={{width: "100%"}}/>
                            <figcaption>
                                <p>Stats for {god.name}</p>
                            </figcaption>
                        </figure>
                        <div className="god-name">
                            {god.name}
                        </div>
                    </Link>
                )
            })}
            </div>
            </>
        )
}
function Gods() {
    const [allgods, setallgods] = useState([]);

    useEffect(() => {
        fetch("/api/gods").then((res) => 
        res.json().then((data) => {
            Object.keys(data).forEach((key) => {
                setallgods((allgods) => [
                    ...allgods,
                    {
                        name: data[key].name,
                        url: data[key].url,
                    }
                ])
            })
        }))
    }, []);
    return (
        <div className="content">
            <div className="god-home-page">
                <div className="god-home content-side-pad">
                    <div className="title-header">
                        <h1 className="tier-list">Smite Gods Search</h1>
                        <h2 className="subtitle">Find the best builds for every god!</h2>
                    </div>
                    <GodsDisplay gods={allgods} />
                </div>
            </div>
        </div>
    )
}

export default Gods;