import React, { useContext } from "react";
import { DamageContext } from "./DamageContext";
import Picture from "./Picture";
import GodSelectionBox from "./GodSelectionBox";
import BuildSection from "./BuildSection";

export default function MainCalcSection(props) {
    return (
        <div className="content-section main-calc">
            <div className="content-section_header">
                God Selection
            </div>
            <GodSelectionBox />
            <BuildSection />
        </div>
    )
}