import React, { useContext } from "react";
import { DamageContext } from "./DamageContext";
import Picture from "./Picture";
import GodSelectionBox from "./GodSelectionBox";

export default function MainCalcSection(props) {
    return (
        <div className="content-section main-calc">
            <div className="content-section_header">
                God Selection
            </div>
            <GodSelectionBox />
        </div>
    )
}