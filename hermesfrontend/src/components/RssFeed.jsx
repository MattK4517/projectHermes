
import React, { useState, useEffect } from "react"
//https://store.steampowered.com/feeds/news/app/386360/?cc=US&l=english&snr=1_2108_9__2107
function RSSFeeder(props) {
    useEffect(() => {
        const script = document.createElement('script');
      
        script.src = "//rss.bloople.net/?url=https%3A%2F%2Fstore.steampowered.com%2Ffeeds%2Fnews%2Fapp%2F386360%2F%3Fcc%3DUS%26l%3Denglish%26snr%3D1_2108_9__2107&showtitle=false&type=js";
        script.async = true;
        let element = document.getElementById("insertHere");
        element.appendChild(script);
      
      }, []);
        return (
        <div className="toughest-matchups content-section">
            <div className="content-section_header new" id="insertHere">
            </div>
        </div>
        );
}

export default RSSFeeder;