import MultiKillDisplay from "../PlayerPage/MultiKillDisplay";

export default function PlayerCarryScore(props) {
    console.log(props)
    return(
        <div style={{backgroundColor: "#11112a", display: "flex"}}>
            <MultiKillDisplay player={props.player} />
            <div className="carry-score_container">
                <div className="light-blue">Damage Score: {props.player.damageScore}%</div>
                <div className="light-blue">Kill Participation: {props.player.killPart}%</div>
                <div className="light-blue">Gold Score: {props.player.goldScore}%</div>
            </div>
        </div>
    )
}