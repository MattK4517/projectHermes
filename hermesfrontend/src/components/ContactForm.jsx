import { Hidden } from "@material-ui/core";
import React from "react";

function ContactForm() {
    return (
        <div style={{width: "100vw", height: "100vh", position: "absolute", paddingTop: "100px", marginLeft: "25px"}}>
            <div className="contact-page" style={{color: "white", margin: "auto", alignContent: "center", verticalAlign: "center"}}>
                <h1>Where to contact us?</h1>
                <p>Join Our 
                    <a href="https://discord.gg/9dg3gYtFAZ" target="_blank"> Discord!     
                        <img src="https://i.imgur.com/4LOAiBE.png" alt="discord-logo" style={{maxHeight: "24px", maxWidth: "24px", paddingLeft: "10px"}}></img>
                    </a>
                </p> 
                <br></br>
                <p>Follow Us on 
                    <a href="https://twitter.com/smitestatsGG" target="_blank">Twitter!
                        <img src="https://i.imgur.com/4BZ26Gy.png" alt="twitter-logo" style={{maxHeight: "24px", maxWidth: "24px", paddingLeft: "10px"}}></img>
                    </a>
                </p> 
                <br></br>
                <p>Email: Contact@smitestats.gg</p>
            </div>
        </div>
    )
}
export default ContactForm;