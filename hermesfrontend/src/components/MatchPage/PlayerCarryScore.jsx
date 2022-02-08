import MultiKillDisplay from "../PlayerPage/MultiKillDisplay";

export default function PlayerCarryScore(props) {
    return(
        <div style={{backgroundColor: "#11112a", display: "flex"}}>
            <MultiKillDisplay player={props.player} />
            <div className="carry-score_container">
                <div>Damage Score: {props.player.damageScore}%</div>
                <div>Kill Participation: {props.player.killPart}%</div>
                <div>Gold Score: {props.player.goldScore}%</div>
            </div>
        </div>
    )
}